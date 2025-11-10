"""
Participant models for device-based identification.
"""
import uuid
from django.db import models
from django.utils import timezone


class DeviceProfile(models.Model):
    """
    Device profile for participant identification.
    Participants are identified by device_id (from frontend secure ID).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    device_id = models.CharField(max_length=255, unique=True, db_index=True)
    
    # Optional metadata
    platform = models.CharField(max_length=50, blank=True)  # e.g., 'ios', 'android'
    app_version = models.CharField(max_length=50, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'device_profiles'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['device_id']),
        ]
    
    def __str__(self):
        return f"DeviceProfile: {self.device_id}"
