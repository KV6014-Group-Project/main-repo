"""
Views for events app.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from core.permissions import IsOrganiser, IsOrganiserOfEvent
from .models import Event, EventPromoter, RSVP
from .serializers import (
    EventSerializer,
    EventCreateSerializer,
    EventPromoterSerializer,
    EventPromoterCreateSerializer,
    RSVPSerializer,
    EventStatsSerializer,
)


class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Event CRUD operations.
    Only organisers can create/update/delete events.
    """
    permission_classes = [IsAuthenticated, IsOrganiser]
    queryset = Event.objects.all()
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return EventCreateSerializer
        return EventSerializer
    
    def get_queryset(self):
        """Filter events to only those owned by the current user."""
        return Event.objects.filter(organiser=self.request.user)
    
    def perform_create(self, serializer):
        """Create event with current user as organiser."""
        serializer.save(organiser=self.request.user)
    
    @action(detail=True, methods=['get'], permission_classes=[IsOrganiserOfEvent])
    def stats(self, request, pk=None):
        """Get statistics for an event."""
        event = self.get_object()
        
        # Aggregate RSVPs
        rsvps = RSVP.objects.filter(event=event)
        total_rsvps = rsvps.filter(status='rsvp').count()
        total_interested = rsvps.filter(status='interested').count()
        total_cancelled = rsvps.filter(status='cancelled').count()
        
        # By promoter
        by_promoter = {}
        promoter_rsvps = rsvps.filter(promoter__isnull=False).values('promoter__user__email').annotate(
            count=Count('id')
        )
        for item in promoter_rsvps:
            by_promoter[item['promoter__user__email']] = item['count']
        
        # By source
        by_source = {}
        source_rsvps = rsvps.values('source').annotate(count=Count('id'))
        for item in source_rsvps:
            by_source[item['source']] = item['count']
        
        stats_data = {
            'total_rsvps': total_rsvps,
            'total_interested': total_interested,
            'total_cancelled': total_cancelled,
            'by_promoter': by_promoter,
            'by_source': by_source,
        }
        
        serializer = EventStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsOrganiserOfEvent])
    def promoters(self, request, pk=None):
        """Add a promoter to an event."""
        event = self.get_object()
        serializer = EventPromoterCreateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        promoter_id = serializer.validated_data['promoter_id']
        
        try:
            from users.models import PromoterProfile
            promoter_profile = PromoterProfile.objects.get(id=promoter_id)
        except PromoterProfile.DoesNotExist:
            return Response(
                {'error': 'Promoter not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if link already exists
        event_promoter, created = EventPromoter.objects.get_or_create(
            event=event,
            promoter=promoter_profile,
            defaults={'is_active': True}
        )
        
        if not created:
            event_promoter.is_active = True
            event_promoter.save()
        
        response_serializer = EventPromoterSerializer(event_promoter)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'], permission_classes=[IsOrganiserOfEvent])
    def promoter_list(self, request, pk=None):
        """List promoters for an event."""
        event = self.get_object()
        event_promoters = EventPromoter.objects.filter(event=event, is_active=True)
        serializer = EventPromoterSerializer(event_promoters, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['delete'], url_path='promoters/(?P<promoter_id>[^/.]+)', permission_classes=[IsOrganiserOfEvent])
    def remove_promoter(self, request, pk=None, promoter_id=None):
        """Remove a promoter from an event."""
        event = self.get_object()
        
        try:
            event_promoter = EventPromoter.objects.get(
                event=event,
                promoter_id=promoter_id,
                is_active=True
            )
            event_promoter.is_active = False
            event_promoter.save()
            return Response({'success': True}, status=status.HTTP_200_OK)
        except EventPromoter.DoesNotExist:
            return Response(
                {'error': 'Promoter not found for this event'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'], url_path='share/organiser', permission_classes=[IsOrganiserOfEvent])
    def share_organiser(self, request, pk=None):
        """
        Generate organiser→promoter share token.
        TODO: Full implementation in Phase 2 with token generation.
        """
        event = self.get_object()
        # Placeholder for Phase 2 - will generate signed tokens
        return Response({
            'event_id': str(event.id),
            'message': 'Share token generation will be implemented in Phase 2',
        }, status=status.HTTP_501_NOT_IMPLEMENTED)
    
    @action(detail=True, methods=['post'], url_path='share/qr', permission_classes=[IsOrganiserOfEvent])
    def share_qr(self, request, pk=None):
        """
        Generate QR code YAML payload for event.
        TODO: Full implementation in Phase 2 with YAML generation.
        """
        event = self.get_object()
        # Placeholder for Phase 2 - will generate signed YAML
        return Response({
            'event_id': str(event.id),
            'message': 'QR code generation will be implemented in Phase 2',
        }, status=status.HTTP_501_NOT_IMPLEMENTED)
