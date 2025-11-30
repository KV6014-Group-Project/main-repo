"""
Serializers for events app.
"""
from rest_framework import serializers
from .models import EventStatuses, Event, EventVenues, EventPromoter, RSVP
from users.serializers import UserSerializer, PromoterProfileSerializer


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
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'organiser', 'created_at', 'updated_at']


class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating an event."""
    venue = serializers.JSONField(write_only=True)
    status = serializers.UUIDField(write_only=True)

    def validate_title(self, value):
        """Ensure the title is at least 3 characters."""
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long!")
        return value
    
    def validate_venue(self, value):
        """Ensure venue is provided."""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Location must be a dictionary")
        
        required_keys = ['name', 'room', 'address']
        for key in required_keys:
            if key not in value:
                raise serializers.ValidationError(f"Location must include '{key}'")
        
        if not value.get('name', '').strip():
            raise serializers.ValidationError("Location name cannot be empty")
        
        return value

    # TODO output entire entry on create, not just partial
    def create(self, validated_data):
        """Create a new event with the current user as organiser."""
        venue_data = validated_data.pop('venue')
        status_id = validated_data.pop('status')
        
        # Find or create venue
        venue, _ = EventVenues.objects.get_or_create(
            name=venue_data.get('name', ''),
            room=venue_data.get('room', ''),
            address=venue_data.get('address', ''),
        )
        
        validated_data['venue'] = venue
        validated_data['status_id'] = status_id
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Update an existing event."""
        venue_data = validated_data.pop('venue', None)
        status_id = validated_data.pop('status', None)
        
        # Update venue if provided
        if venue_data:
            venue, _ = EventVenues.objects.get_or_create(
                name=venue_data.get('name', ''),
                room=venue_data.get('room', ''),
                address=venue_data.get('address', ''),
            )
            instance.venue = venue
        
        # Update status if provided
        if status_id:
            instance.status_id = status_id
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

    
    class Meta:
        model = Event
        fields = [
            'id',
            'title', 'description',
            'start_datetime', 'end_datetime',
            'venue',
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

