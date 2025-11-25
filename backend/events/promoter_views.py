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
from core.utils import create_signed_yaml_payload
import time, uuid

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPromoter])
def promoter_events(request):
    """
    Get events where the current user (promoter) is assigned.
    """
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


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPromoter])
def promoter_accept(request):
    """
    Accept an organiser token and link promoter to event.
    TODO: Full implementation in Phase 2 with token validation.
    
    TODO: use db instead. server authoritive, and association through XREF table, which already exists, makes it a simple check.
    """
    token = request.data.get('token')
    if not token:
        return Response(
            {'error': 'Token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Placeholder for Phase 2 - will decode and validate token
    return Response({
        'message': 'Token acceptance will be implemented in Phase 2',
    }, status=status.HTTP_501_NOT_IMPLEMENTED)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPromoter])
def promoter_share_participant(request, event_id):
    """
    Generate participant-facing share token/QR for an event.
    """
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
    
    # Create event snapshot (using your Event model's method)
    event_data = event.to_event_snapshot()
    
    # Create share metadata with promoter attribution
    share_data = {
        'scope': 'participant',
        'eventId': str(event.id),
        'shareId': str(uuid.uuid4()),
        'promoterId': str(request.user.promoter_profile.id),
        'issuedAt': int(time.time() * 1000),
        'channel': 'qr'
    }
    
    # Generate signed YAML payload
    yaml_payload = create_signed_yaml_payload(event_data, share_data)
    
    return Response({
        'event_id': str(event.id),
        'promoter_id': str(request.user.promoter_profile.id),
        'yaml': yaml_payload,
        'share_id': share_data['shareId']
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPromoter])
def promoter_event_stats(request, event_id):
    """
    Get statistics for an event, filtered to this promoter's attributed RSVPs.
    """
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
    
    total_rsvps = rsvps.filter(status='rsvp').count()
    total_interested = rsvps.filter(status='interested').count()
    total_cancelled = rsvps.filter(status='cancelled').count()
    
    # By source
    by_source = {}
    source_rsvps = rsvps.values('source').annotate(count=Count('id'))
    for item in source_rsvps:
        by_source[item['source']] = item['count']
    
    stats_data = {
        'total_rsvps': total_rsvps,
        'total_interested': total_interested,
        'total_cancelled': total_cancelled,
        'by_promoter': {},  # Not applicable for promoter view
        'by_source': by_source,
    }
    
    serializer = EventStatsSerializer(stats_data)
    return Response(serializer.data, status=status.HTTP_200_OK)

