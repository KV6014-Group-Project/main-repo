"""
Views for events app.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Count
from core.permissions import IsOrganiser, IsOrganiserOfEvent
from .models import Event, EventStatuses, EventPromoter, RSVP
from .serializers import (
    EventStatusesSerializer,
    EventSerializer,
    EventCreateSerializer,
    EventPromoterSerializer,
    EventPromoterCreateSerializer,
    RSVPSerializer,
    EventStatsSerializer,
)

class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOrganiser]
    queryset = Event.objects.all()
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action in ['create', 'update', 'partial_update']:
            return EventCreateSerializer
        return EventSerializer
    
    def get_queryset(self):
        """Filter events based on action and user."""
        # For retrieve action with anonymous users, return all events
        # (privacy will be checked in the retrieve method)
        if self.action == 'retrieve' and not self.request.user.is_authenticated:
            return Event.objects.all()
        
        # For authenticated users, filter to only their events
        return Event.objects.filter(organiser=self.request.user)

    def get_permissions(self):
        """Override permissions for specific actions."""
        if self.action == 'retrieve':
            return [AllowAny()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        """Create event with current user as organiser."""
        serializer.save(organiser=self.request.user)
    
    @action(
        detail=False,
        methods=['get'],
        authentication_classes=[],
        permission_classes=[AllowAny]
    )
    def public(self, request):
        """Get all public events."""
        events = Event.objects.filter(is_private=False)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(
        detail=False,
        methods=['get'],
        permission_classes=[IsAuthenticated, IsOrganiser]
    )
    def statuses(self, request):
        """Get all event statuses."""
        statuses = EventStatuses.objects.all()
        serializer = EventStatusesSerializer(statuses, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get a single event with privacy checks."""
        event = self.get_object()
        
        # If private, check permissions
        if event.is_private:
            # Must be logged in
            if not request.user.is_authenticated:
                return Response(
                    {'error': 'This event is private'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Must be owner
            if event.organiser != request.user:
                return Response(
                    {'error': 'This event is private'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer = self.get_serializer(event)
        return Response(serializer.data)
    
    @action(
        detail=True,
        methods=['get'],
        permission_classes=[IsAuthenticated, IsOrganiserOfEvent]
    )
    def stats(self, request, pk=None):
        """Get statistics for an event."""
        event = self.get_object()
        
        # Aggregate RSVPs
        rsvps = RSVP.objects.filter(event=event)
        total_rsvps = rsvps.filter(status__name='rsvp').count()
        total_interested = rsvps.filter(status__name='interested').count()
        total_cancelled = rsvps.filter(status__name='cancelled').count()
        
        # By promoter
        by_promoter = {}
        promoter_rsvps = rsvps.filter(promoter__isnull=False).values(
            'promoter__user__email'
        ).annotate(count=Count('id'))
        for item in promoter_rsvps:
            by_promoter[item['promoter__user__email']] = item['count']
        
        # By source
        by_source = {}
        source_rsvps = rsvps.values('source__name').annotate(count=Count('id'))
        for item in source_rsvps:
            by_source[item['source__name']] = item['count']
        
        stats_data = {
            'total_rsvps': total_rsvps,
            'total_interested': total_interested,
            'total_cancelled': total_cancelled,
            'by_promoter': by_promoter,
            'by_source': by_source,
        }
        
        serializer = EventStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(
        detail=True,
        methods=['post'],
        permission_classes=[IsAuthenticated, IsOrganiserOfEvent]
    )
    def promoters(self, request, pk=None):
        """Add a promoter to an event."""
        event = self.get_object()
        serializer = EventPromoterCreateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        promoter_id = serializer.validated_data['promoter_id']
        
        try:
            from users.models import PromoterProfile
            promoter_profile = PromoterProfile.objects.get(user=promoter_id)
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

            return Response(
                {'error': 'Promoter already added to event!'},
                status=status.HTTP_409_CONFLICT
            )
        
        response_serializer = EventPromoterSerializer(event_promoter)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(
        detail=True,
        methods=['get'],
        permission_classes=[IsAuthenticated, IsOrganiserOfEvent]
    )
    def promoter_list(self, request, pk=None):
        """List promoters for an event."""
        event = self.get_object()
        event_promoters = EventPromoter.objects.filter(event=event, is_active=True)
        serializer = EventPromoterSerializer(event_promoters, many=True)
        return Response(serializer.data)
    
    @action(
        detail=True,
        methods=['delete'],
        url_path='promoters/(?P<promoter_id>[^/.]+)',
        permission_classes=[IsOrganiserOfEvent]
    )
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
            return Response({
                'message': 'Promoter has been removed from this event.',
            }, status=status.HTTP_200_OK)
        except EventPromoter.DoesNotExist:
            return Response(
                {'error': 'Promoter not found for this event'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(
        detail=True,
        methods=['post'],
        url_path='share/organiser',
        permission_classes=[IsAuthenticated, IsOrganiserOfEvent]
    )
    def share_organiser(self, request, pk=None):
        """
        Generate organiser→promoter invitation token.
        
        Optionally specify a promoter_id to create a targeted invitation.
        If no ID provided, creates a generic invitation any promoter can accept.
        """
        from core.utils import create_organiser_invitation_token
        from users.models import PromoterProfile
        
        event = self.get_object()
        promoter_id = request.data.get('promoter_id')
        
        # Optional: Validate promoter exists
        promoter_profile = None
        if promoter_id:
            try:
                promoter_profile = PromoterProfile.objects.select_related('user').get(id=promoter_id)
            except PromoterProfile.DoesNotExist:
                return Response(
                    {'error': f'Promoter not found with ID: {promoter_id}'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Generate token
        token_data = create_organiser_invitation_token(
            event_id=str(event.id),
            promoter_id=str(promoter_id) if promoter_id else None
        )
        
        # Build response
        response_data = {
            'success': True,
            'event_id': str(event.id),
            'event_title': event.title,
            'token': token_data['token'],
            'share_id': token_data['share_id'],
            'issued_at': token_data['issued_at'],
            'expires_at': token_data['expires_at'],
            'expires_in_days': 7,
            'share_url': f"{request.scheme}://{request.get_host()}/promoter/accept?token={token_data['token']}"
        }
        
        # Add promoter info if targeted
        if promoter_profile:
            response_data['targeted_to'] = {
                'promoter_id': str(promoter_profile.id),
                'email': promoter_profile.user.email,
                'name': f"{promoter_profile.user.first_name} {promoter_profile.user.last_name}".strip() 
                        or promoter_profile.user.email,
            }
        
        return Response(response_data)
    
    @action(
        detail=True,
        methods=['post'],
        url_path='share/qr',
        permission_classes=[IsOrganiserOfEvent]
    )
    def share_qr(self, request, pk=None):
        """Generate QR code YAML payload for event."""
        event = self.get_object()
        # TODO: Full implementation in Phase 2 with YAML generation
        return Response({
            'event_id': str(event.id),
            'message': 'QR code generation will be implemented in Phase 2',
        }, status=status.HTTP_501_NOT_IMPLEMENTED)
    
"""
class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOrganiser]
    queryset = Event.objects.all()
    
    def get_serializer_class(self):
        #Return appropriate serializer based on action.
        if self.action == 'create':
            return EventCreateSerializer
        return EventSerializer
    
    def get_queryset(self):
        #Filter events to only those owned by the current user.
        return Event.objects.filter(organiser=self.request.user)
    
    def perform_create(self, serializer):
        #Create event with current user as organiser.
        serializer.save(organiser=self.request.user)
    
    @action(detail=True, methods=['get'], permission_classes=[IsOrganiserOfEvent])
    def stats(self, request, pk=None):
        #Get statistics for an event.
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
        #Add a promoter to an event.
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
        #List promoters for an event.
        event = self.get_object()
        event_promoters = EventPromoter.objects.filter(event=event, is_active=True)
        serializer = EventPromoterSerializer(event_promoters, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['delete'], url_path='promoters/(?P<promoter_id>[^/.]+)', permission_classes=[IsOrganiserOfEvent])
    def remove_promoter(self, request, pk=None, promoter_id=None):
        #Remove a promoter from an event.
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
        #
        #Generate organiser→promoter share token.
        #TODO: Full implementation in Phase 2 with token generation.
        event = self.get_object()
        # Placeholder for Phase 2 - will generate signed tokens
        return Response({
            'event_id': str(event.id),
            'message': 'Share token generation will be implemented in Phase 2',
        }, status=status.HTTP_501_NOT_IMPLEMENTED)
    
    @action(detail=True, methods=['post'], url_path='share/qr', permission_classes=[IsOrganiserOfEvent])
    def share_qr(self, request, pk=None):
        #Generate QR code YAML payload for event.
        #TODO: Full implementation in Phase 2 with YAML generation.
        event = self.get_object()
        # Placeholder for Phase 2 - will generate signed YAML
        return Response({
            'event_id': str(event.id),
            'message': 'QR code generation will be implemented in Phase 2',
        }, status=status.HTTP_501_NOT_IMPLEMENTED)
"""