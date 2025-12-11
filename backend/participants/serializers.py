"""
Serializers for participants app.
"""
from rest_framework import serializers
from .models import DeviceProfile
from events.serializers import EventSerializer, RSVPSerializer


class DeviceProfileSerializer(serializers.ModelSerializer):
    """Serializer for DeviceProfile model."""
    class Meta:
        model = DeviceProfile
        fields = ['id', 'device_id', 'platform', 'app_version', 'metadata', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SyncEntrySerializer(serializers.Serializer):
    """Serializer for a single sync entry."""
    yaml = serializers.CharField(required=False, allow_blank=True)
    token = serializers.CharField(required=False, allow_blank=True)
    local_status = serializers.ChoiceField(choices=['rsvp', 'interested', 'scanned'], required=True)
    scanned_at = serializers.IntegerField(required=True)  # Epoch ms
    
    def validate(self, attrs):
        """Validate that either yaml or token is provided."""
        if not attrs.get('yaml') and not attrs.get('token'):
            raise serializers.ValidationError("Either 'yaml' or 'token' must be provided.")
        return attrs


class ParticipantSyncSerializer(serializers.Serializer):
    """Serializer for participant sync request."""
    device_id = serializers.CharField(required=True)
    entries = SyncEntrySerializer(many=True, required=True)


class SyncEntryResponseSerializer(serializers.Serializer):
    """Serializer for sync entry response."""
    entry_index = serializers.IntegerField()
    success = serializers.BooleanField()
    event_id = serializers.UUIDField(required=False, allow_null=True)
    rsvp_id = serializers.UUIDField(required=False, allow_null=True)
    error = serializers.CharField(required=False, allow_blank=True)


class ParticipantSyncResponseSerializer(serializers.Serializer):
    """Serializer for participant sync response."""
    device_id = serializers.CharField()
    entries = SyncEntryResponseSerializer(many=True)
    events = serializers.ListField(child=serializers.DictField(), required=False)

