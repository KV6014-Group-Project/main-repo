"""
Event models for organisers, promoters, and participants.
"""
import uuid
from django.db import models
from django.utils import timezone
from users.models import User, PromoterProfile
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class EventVenues(models.Model):
    """
    Reusable venues for events
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=True)
    room = models.CharField(max_length=255, blank=True)
    address = models.TextField(blank=True)

    class Meta:
        db_table = 'events_venues'
        ordering = ['name', 'room', 'address']
    
    def __str__(self):
        if self.room:
            return f"{self.name} - {self.room}"
        return self.name


class EventStatuses(models.Model):
    """
    Event statuses for the event
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=20)
    description = models.TextField(max_length=255, blank=True)

    class Meta:
        db_table = 'events_statuses'
        ordering = ['name']

    def __str__(self):
        return self.name


class Event(models.Model):
    """
    Event model representing an event created by an organiser.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organiser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organised_events')
    
    # Event details
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Date and time
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()

    # Location
    venue = models.ForeignKey(
        EventVenues,
        on_delete=models.PROTECT
    )
    
    # Status and visibility
    status = models.ForeignKey(
        EventStatuses,
        on_delete=models.PROTECT
    )
    is_private = models.BooleanField(default=False)

    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # TODO Capacity
        
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
        if not self.venue:
            return {
                'name': '',
                'room': '',
                'address': ''
            }
        
        return {
            'name': self.venue.name,
            'room': self.venue.room,
            'address': self.venue.address
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
                'name': f"{self.organiser.last_name}, {self.organiser.first_name}".strip() or self.organiser.email,
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


class RSVPStatuses(models.Model):
    """RSVP status lookup table."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'rsvp_statuses'
        ordering = ['name']

    def __str__(self):
        return self.name


class RSVPSources(models.Model):
    """RSVP source lookup table."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'rsvp_sources'
        ordering = ['name']

    def __str__(self):
        return self.name


class RSVP(models.Model):
    """
    RSVP model for participant responses to events.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='rsvps')
    
    # Participant identification (device-based or user-based)
    device = models.ForeignKey('participants.DeviceProfile', on_delete=models.CASCADE, null=True, blank=True, related_name='rsvps')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='rsvps')
    
    # Attribution
    promoter = models.ForeignKey(PromoterProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='attributed_rsvps')
    
    # RSVP details - now ForeignKeys
    status = models.ForeignKey(RSVPStatuses, on_delete=models.PROTECT)
    source = models.ForeignKey(RSVPSources, on_delete=models.PROTECT)
    
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
