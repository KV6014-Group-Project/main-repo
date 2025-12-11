"""
Views for participants app.
"""
from datetime import datetime
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from core.utils import parse_yaml_payload, verify_yaml_payload, normalize_yaml_payload_for_sync
from .models import DeviceProfile
from .serializers import ParticipantSyncSerializer, ParticipantSyncResponseSerializer
from events.models import Event, RSVP, RSVPStatuses, RSVPSources, EventStatuses, EventPromoter
from events.serializers import EventSerializer
from users.models import PromoterProfile


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def sync(request):
    """
    Sync participant entries (YAML/token) and create RSVPs.
    
    This endpoint:
    1. Parses YAML or decodes token
    2. Validates signature
    3. Resolves event and promoter attribution
    4. Creates/updates DeviceProfile and RSVP
    """
    serializer = ParticipantSyncSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    device_id = serializer.validated_data['device_id']
    entries = serializer.validated_data['entries']
    
    # Get or create device profile
    device_profile, created = DeviceProfile.objects.get_or_create(
        device_id=device_id,
        defaults={
            'platform': request.META.get('HTTP_USER_AGENT', '')[:50],
        }
    )
    
    # Process each entry
    entry_responses = []
    event_ids = set()
    
    for index, entry in enumerate(entries):
        entry_response = {
            'entry_index': index,
            'success': False,
            'event_id': None,
            'rsvp_id': None,
            'error': None,
        }
        
        try:
            # Parse YAML or token
            yaml_data = None
            if entry.get('yaml'):
                yaml_data = parse_yaml_payload(entry['yaml'])
                if not yaml_data:
                    entry_response['error'] = 'Invalid YAML format'
                    entry_responses.append(entry_response)
                    continue
                
                # Verify signature
                if not verify_yaml_payload(yaml_data):
                    entry_response['error'] = 'Invalid signature'
                    entry_responses.append(entry_response)
                    continue
            elif entry.get('token'):
                entry_response['error'] = 'Token decoding not yet implemented'
                entry_responses.append(entry_response)
                continue
            else:
                entry_response['error'] = 'No YAML or token provided'
                entry_responses.append(entry_response)
                continue
            
            # Extract event and share data
            normalized_data = normalize_yaml_payload_for_sync(yaml_data)
            event_data = normalized_data.get('event', {})
            share_data = normalized_data.get('share', {})
            
            event_id = event_data.get('id') or share_data.get('eventId')
            if not event_id:
                entry_response['error'] = 'Event ID not found'
                entry_responses.append(entry_response)
                continue
            
            # Get event - check status FK name is 'published'
            try:
                # Get published status
                published_status = EventStatuses.objects.get(name='published')
                event = Event.objects.get(id=event_id, status=published_status)
            except (Event.DoesNotExist, EventStatuses.DoesNotExist):
                entry_response['error'] = 'Event not found or not published'
                entry_responses.append(entry_response)
                continue
            
            # Check if device+event combo already exists to prevetn duplicate entries
            existing_rsvp = RSVP.objects.filter(
                event=event,
                device=device_profile
            ).first()
            
            # Only check when creating, not updating
            # And no capacity = unlimited capacity
            if event.capacity and not existing_rsvp:
                # Count current RSVPs (excluding cancelled)
                current_rsvps = RSVP.objects.filter(
                    event=event
                ).exclude(
                    status__name='cancelled'
                ).count()
                
                # Check if capacity is reached
                if current_rsvps >= event.capacity:
                    entry_response['error'] = f'Event is at full capacity ({event.capacity}/{event.capacity})'
                    entry_responses.append(entry_response)
                    continue
            
            # Resolve promoter attribution
            promoter = None
            promoter_id = share_data.get('promoterId')
            if promoter_id:
                try:
                    promoter = PromoterProfile.objects.get(id=promoter_id)
                    # Verify promoter is assigned to event
                    if not EventPromoter.objects.filter(
                        event=event,
                        promoter=promoter,
                        is_active=True
                    ).exists():
                        promoter = None  # Invalid attribution
                except PromoterProfile.DoesNotExist:
                    promoter = None
            
            # Map local_status to RSVP status FK
            status_map = {
                'rsvp': 'rsvp',
                'interested': 'interested',
                'scanned': 'rsvp',  # Default scanned to rsvp
            }
            rsvp_status_name = status_map.get(entry['local_status'], 'rsvp')
            
            # Get RSVP status FK
            try:
                rsvp_status = RSVPStatuses.objects.get(name=rsvp_status_name)
            except RSVPStatuses.DoesNotExist:
                entry_response['error'] = f'RSVP status "{rsvp_status_name}" not found'
                entry_responses.append(entry_response)
                continue
            
            # Determine source and get FK
            source_name = share_data.get('channel', 'offline_sync')
            if source_name == 'qr':
                source_name = 'qr'
            elif source_name in ['link', 'poster']:
                source_name = 'link'
            else:
                source_name = 'offline_sync'
            
            try:
                rsvp_source = RSVPSources.objects.get(name=source_name)
            except RSVPSources.DoesNotExist:
                entry_response['error'] = f'RSVP source "{source_name}" not found'
                entry_responses.append(entry_response)
                continue
            
            # Parse scanned_at
            scanned_at = None
            if entry.get('scanned_at'):
                try:
                    scanned_at = datetime.fromtimestamp(entry['scanned_at'] / 1000, tz=timezone.utc)
                except Exception:
                    scanned_at = timezone.now()
            
            # Create or update RSVP
            rsvp, created = RSVP.objects.update_or_create(
                event=event,
                device=device_profile,
                defaults={
                    'promoter': promoter,
                    'status': rsvp_status,  # FK to RSVPStatuses
                    'source': rsvp_source,  # FK to RSVPSources
                    'scanned_at': scanned_at or timezone.now(),
                }
            )
            
            entry_response['success'] = True
            entry_response['event_id'] = str(event.id)
            entry_response['rsvp_id'] = str(rsvp.id)
            event_ids.add(event.id)
            
        except Exception as e:
            entry_response['error'] = str(e)
        
        entry_responses.append(entry_response)
    
    # Get canonical event data for all synced events
    events = Event.objects.filter(id__in=event_ids)
    event_serializer = EventSerializer(events, many=True)
    
    response_data = {
        'device_id': device_id,
        'entries': entry_responses,
        'events': event_serializer.data,
    }
    
    response_serializer = ParticipantSyncResponseSerializer(response_data)
    return Response(response_serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def events(request):
    """
    Get events associated with a device_id.
    """
    device_id = request.query_params.get('device_id')
    if not device_id:
        return Response(
            {'error': 'device_id parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        device_profile = DeviceProfile.objects.get(device_id=device_id)
    except DeviceProfile.DoesNotExist:
        return Response(
            {'error': 'Device not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get events through RSVPs
    rsvps = RSVP.objects.filter(device=device_profile).select_related('event')
    events = [rsvp.event for rsvp in rsvps]
    
    event_serializer = EventSerializer(events, many=True)
    return Response(event_serializer.data, status=status.HTTP_200_OK)
