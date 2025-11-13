"""
Event models for organisers, promoters, and participants.
"""
import uuid
from django.db import models
from django.utils import timezone
from users.models import User, PromoterProfile
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

"""
class Roles(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=256, unique=True)

    class Meta:
        db_table = 'roles'
        ordering = ['name']

class EventStatuses(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)

    # Indexes are inefficient for such a small lookup table
    class Meta:
        db_table = 'event_statuses'
        ordering = ['name']
"""

class Event(models.Model):
    """
    Event model representing an event created by an organiser.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Why are we allowing capitalization? We should just lowercase it.
    # this should be normalized
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]
    
    # models have a default id without being stated,
    # you don't need to define this
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organiser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organised_events')
    
    # Event details
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Date and time
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    
    # Location
    location_venue = models.CharField(max_length=255, blank=True)
    location_room = models.CharField(max_length=255, blank=True)
    location_address = models.TextField(blank=True)
    
    # Status and visibility
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='public')
    
    # Status table for normalization
    """
    status_id = models.ForeignKey(
        EventStatuses,
        on_delete=models.CASCADE
    )
    """

    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'events'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organiser', 'status']),
            models.Index(fields=['start_datetime']),
        ]
    
    def __str__(self):
        return self.title
    
    @property
    def location(self):
        """Get location as a dictionary."""
        return {
            'venue': self.location_venue,
            'room': self.location_room,
            'address': self.location_address,
        }
    
    def to_event_snapshot(self):
        """Convert event to snapshot format for YAML payload."""
        return {
            'id': str(self.id),
            'title': self.title,
            'description': self.description,
            'start': self.start_datetime.isoformat(),
            'end': self.end_datetime.isoformat(),
            'location': self.location,
            'organiser': {
                'id': str(self.organiser.id),
                'name': self.organiser.name or self.organiser.email,
            },
        }


class EventPromoter(models.Model):
    """
    Many-to-many relationship between events and promoters.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='event_promoters')
    promoter = models.ForeignKey(PromoterProfile, on_delete=models.CASCADE, related_name='promoted_events')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_promoters'
        unique_together = [['event', 'promoter']]
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event', 'is_active']),
            models.Index(fields=['promoter', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.promoter.user.email} -> {self.event.title}"


class RSVP(models.Model):
    """
    RSVP model for participant responses to events.
    """
    STATUS_CHOICES = [
        ('rsvp', 'RSVP'),
        ('interested', 'Interested'),
        ('cancelled', 'Cancelled'),
    ]
    
    SOURCE_CHOICES = [
        ('qr', 'QR Code'),
        ('link', 'Link'),
        ('offline_sync', 'Offline Sync'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='rsvps')
    
    # Participant identification (device-based or user-based)
    device = models.ForeignKey('participants.DeviceProfile', on_delete=models.CASCADE, null=True, blank=True, related_name='rsvps')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='rsvps')
    
    # Attribution
    promoter = models.ForeignKey(PromoterProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='attributed_rsvps')
    
    # RSVP details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='rsvp')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='offline_sync')
    
    # Timestamps
    scanned_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'rsvps'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event', 'status']),
            models.Index(fields=['device']),
            models.Index(fields=['promoter', 'event']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        identifier = self.device.device_id if self.device else (self.user.email if self.user else 'Unknown')
        return f"RSVP: {identifier} -> {self.event.title}"
