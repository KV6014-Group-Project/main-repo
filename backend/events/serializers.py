"""
Serializers for events app.
"""
from rest_framework import serializers
from .models import Event, EventPromoter, RSVP
from users.serializers import UserSerializer, PromoterProfileSerializer


class EventSerializer(serializers.ModelSerializer):
    """Serializer for Event model."""
    organiser = UserSerializer(read_only=True)
    location = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'organiser', 'title', 'description',
            'start_datetime', 'end_datetime',
            'location_venue', 'location_room', 'location_address',
            'location', 'status', 'visibility', 'metadata',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'organiser', 'created_at', 'updated_at']
    
    def get_location(self, obj):
        """Get location as a dictionary."""
        return obj.location


class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating an event."""
    class Meta:
        model = Event
        fields = [
            'title', 'description',
            'start_datetime', 'end_datetime',
            'location_venue', 'location_room', 'location_address',
            'status', 'visibility', 'metadata',
        ]
    
    def create(self, validated_data):
        """Create a new event with the current user as organiser."""
        validated_data['organiser'] = self.context['request'].user
        return super().create(validated_data)


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

