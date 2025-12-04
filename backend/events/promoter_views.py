"""
Promoter-specific views for events app.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Count
from core.permissions import IsPromoter
from .models import Event, EventPromoter, RSVP
from .serializers import EventSerializer, EventStatsSerializer
from core.utils import create_compact_yaml_payload
import time, uuid
from core.utils import parse_organiser_invitation_token

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPromoter])
def promoter_events(request):
    """Get events where the current user (promoter) is assigned."""
    if not hasattr(request.user, 'promoter_profile'):
        return Response(
            {'error': 'User does not have a promoter profile'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    event_promoters = EventPromoter.objects.filter(
        promoter=request.user.promoter_profile,
        is_active=True
    ).select_related('event')
    
    events = [ep.event for ep in event_promoters]
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPromoter])
def promoter_event_detail(request, event_id):
    """Get a single event that the promoter is assigned to."""
    if not hasattr(request.user, 'promoter_profile'):
        return Response(
            {'error': 'User does not have a promoter profile'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    event = get_object_or_404(Event, id=event_id)
    
    # Verify promoter is assigned to this event
    if not EventPromoter.objects.filter(
        event=event,
        promoter=request.user.promoter_profile,
        is_active=True
    ).exists():
        return Response(
            {'error': 'You are not assigned to this event'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = EventSerializer(event)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPromoter])
def promoter_accept(request):
    """Accept an organiser invitation token."""
    
    token = request.data.get('token')
    if not token:
        return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Parse and validate token
        token_data = parse_organiser_invitation_token(
            token, 
            promoter_id=str(request.user.promoter_profile.id)
        )
        event_id = token_data['event_id']
        share_id = token_data['share_id']
        token_promoter_id = token_data['promoter_id']
        
        # Get event
        event = get_object_or_404(Event, id=event_id)
        
        # Create or update EventPromoter link
        event_promoter, created = EventPromoter.objects.get_or_create(
            event=event,
            promoter=request.user.promoter_profile,
            defaults={'is_active': True}
        )
        
        # Nice added response for promoter
        if not created and not event_promoter.is_active:
            event_promoter.is_active = True
            event_promoter.save()
            message = 'Welcome back! Your access has been reactivated.'
        elif not created:
            message = 'You are already connected to this event.'
        else:
            message = 'Successfully joined event! You can now promote and track RSVPs.'
        
        from .serializers import EventPromoterSerializer
        event_serializer = EventSerializer(event)
        link_serializer = EventPromoterSerializer(event_promoter)
        
        response_data = {
            'success': True,
            'message': message,
            'created': created,
            'event': event_serializer.data,
            'link': link_serializer.data,
            'share_id': share_id,
        }
        
        # Indicate if this was a targeted invitation
        if token_promoter_id:
            response_data['was_targeted'] = True
        
        return Response(
            response_data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
        
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': f'Failed to process token: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPromoter])
def promoter_share_participant(request, event_id):
    """Generate participant-facing share token/QR for an event."""
    event = get_object_or_404(Event, id=event_id)
    
    # Verify promoter is assigned to this event
    if not EventPromoter.objects.filter(
        event=event,
        promoter=request.user.promoter_profile,
        is_active=True
    ).exists():
        return Response(
            {'error': 'Promoter is not assigned to this event'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    share_id = str(uuid.uuid4())
    promoter_id = str(request.user.promoter_profile.id)
    
    # Generate compact YAML payload for QR code
    yaml_payload = create_compact_yaml_payload(
        event_id=str(event.id),
        event_title=event.title,
        event_start=event.start_datetime.isoformat(),
        promoter_id=promoter_id,
        share_id=share_id,
    )
    
    return Response({
        'event_id': str(event.id),
        'promoter_id': promoter_id,
        'yaml': yaml_payload,
        'share_id': share_id,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPromoter])
def promoter_event_stats(request, event_id):
    """Get statistics for an event, filtered to this promoter's attributed RSVPs."""
    if not hasattr(request.user, 'promoter_profile'):
        return Response(
            {'error': 'User does not have a promoter profile'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    event = get_object_or_404(Event, id=event_id)
    
    # Verify promoter is assigned to this event
    if not EventPromoter.objects.filter(
        event=event,
        promoter=request.user.promoter_profile,
        is_active=True
    ).exists():
        return Response(
            {'error': 'Promoter is not assigned to this event'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get RSVPs attributed to this promoter
    rsvps = RSVP.objects.filter(
        event=event,
        promoter=request.user.promoter_profile
    )
    
    # Use FK instead
    total_rsvps = rsvps.filter(status__name='rsvp').count()
    total_interested = rsvps.filter(status__name='interested').count()
    total_cancelled = rsvps.filter(status__name='cancelled').count()
    
    # By source
    by_source = {}
    source_rsvps = rsvps.values('source__name').annotate(count=Count('id'))
    for item in source_rsvps:
        by_source[item['source__name']] = item['count']
    
    stats_data = {
        'total_rsvps': total_rsvps,
        'total_interested': total_interested,
        'total_cancelled': total_cancelled,
        'by_promoter': {},  # Not applicable for promoter view
        'by_source': by_source,
    }
    
    serializer = EventStatsSerializer(stats_data)
    return Response(serializer.data, status=status.HTTP_200_OK)