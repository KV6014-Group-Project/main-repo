"""
Serializers for events app.
"""
from rest_framework import serializers
from .models import EventStatuses, Event, EventVenues, EventPromoter, RSVP
from users.serializers import UserSerializer, PromoterProfileSerializer
from uuid import UUID


class EventStatusesSerializer(serializers.ModelSerializer):
    """Serializer for Roles."""
    class Meta:
        model = EventStatuses
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']


class EventSerializer(serializers.ModelSerializer):
    """Serializer for Event model."""
    organiser = UserSerializer(read_only=True)
    location = serializers.SerializerMethodField()
    status = EventStatusesSerializer(read_only=True)
    
    def get_location(self, obj):
        """Get location as a dictionary."""
        return obj.location

    class Meta:
        model = Event
        fields = [
            'id', 'organiser', 'title', 'description',
            'start_datetime', 'end_datetime',
            'location', 'status', 'is_private', 'metadata',
            'capacity',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'organiser', 'created_at', 'updated_at']


class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating an event."""
    location = serializers.JSONField(write_only=True, source='venue')  # Map location -> venue
    status = serializers.CharField(write_only=True)

    def validate_title(self, value):
        """Ensure the title is at least 3 characters."""
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long!")
        return value
    
    def validate_location(self, value):  # Changed from validate_venue
        """Ensure location is provided."""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Location must be a dictionary")
        
        required_keys = ['name', 'room', 'address']
        for key in required_keys:
            if key not in value:
                raise serializers.ValidationError(f"Location must include key: '{key}'")
        
        if not value.get('name', '').strip():
            raise serializers.ValidationError("Location name cannot be empty")
        
        return value

    def validate_status(self, value):
        """Validate that the status exists by UUID or name."""
        status = None
        
        # Try to find status by UUID first
        try:
            UUID(str(value))  # Validate it's a valid UUID format
            status = EventStatuses.objects.filter(id=value).first()
        except (ValueError, AttributeError):
            # If not a valid UUID, try to find by name
            status = EventStatuses.objects.filter(name__iexact=value).first()
        
        if not status:
            raise serializers.ValidationError(
                "The selected status does not exist. Please provide a valid status name or UUID."
            )
        
        # Return the status object so it can be used in create()
        return status

    def create(self, validated_data):
        """Create a new event with the current user as organiser."""
        venue_data = validated_data.pop('venue')  # DRF converts 'location' to 'venue' via source
        status = validated_data.pop('status')
        
        # Find or create venue
        venue, _ = EventVenues.objects.get_or_create(
            name=venue_data.get('name', ''),
            room=venue_data.get('room', ''),
            address=venue_data.get('address', ''),
        )
        
        validated_data['venue'] = venue
        validated_data['status'] = status

        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Update an existing event."""
        venue_data = validated_data.pop('venue', None)
        status = validated_data.pop('status', None)

        # Update venue if provided
        if venue_data:
            venue, _ = EventVenues.objects.get_or_create(
                name=venue_data.get('name', ''),
                room=venue_data.get('room', ''),
                address=venue_data.get('address', ''),
            )
            instance.venue = venue
        
        # Update status if provided
        if status:
            instance.status = status
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

    def to_representation(self, instance):
        return EventSerializer(instance, context=self.context).data

    class Meta:
        model = Event
        fields = [
            'id',
            'title', 'description',
            'start_datetime', 'end_datetime',
            'location',
            'capacity',
            'status', 'is_private', 'metadata',
        ]


class EventPromoterSerializer(serializers.ModelSerializer):
    """Serializer for EventPromoter model."""
    event = EventSerializer(read_only=True)
    promoter = PromoterProfileSerializer(read_only=True)
    
    class Meta:
        model = EventPromoter
        fields = ['id', 'event', 'promoter', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class EventPromoterCreateSerializer(serializers.Serializer):
    """Serializer for creating an EventPromoter link."""
    promoter_id = serializers.UUIDField(required=True)


class RSVPSerializer(serializers.ModelSerializer):
    """Serializer for RSVP model."""
    event = EventSerializer(read_only=True)
    device_id = serializers.CharField(source='device.device_id', read_only=True, allow_null=True)
    user = UserSerializer(read_only=True)
    promoter = PromoterProfileSerializer(read_only=True)
    
    class Meta:
        model = RSVP
        fields = [
            'id', 'event', 'device', 'device_id', 'user', 'promoter',
            'status', 'source', 'scanned_at', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class EventStatsSerializer(serializers.Serializer):
    """Serializer for event statistics."""
    total_rsvps = serializers.IntegerField()
    total_interested = serializers.IntegerField()
    total_cancelled = serializers.IntegerField()
    by_promoter = serializers.DictField()
    by_source = serializers.DictField()

