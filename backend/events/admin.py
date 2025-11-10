"""
Admin configuration for events app.
"""
from django.contrib import admin
from .models import Event, EventPromoter, RSVP


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Admin interface for Event model."""
    list_display = ['title', 'organiser', 'start_datetime', 'status', 'visibility', 'created_at']
    list_filter = ['status', 'visibility', 'created_at', 'start_datetime']
    search_fields = ['title', 'description', 'organiser__email']
    readonly_fields = ['id', 'created_at', 'updated_at']
    date_hierarchy = 'start_datetime'


@admin.register(EventPromoter)
class EventPromoterAdmin(admin.ModelAdmin):
    """Admin interface for EventPromoter model."""
    list_display = ['event', 'promoter', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['event__title', 'promoter__user__email']
    readonly_fields = ['id', 'created_at']


@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    """Admin interface for RSVP model."""
    list_display = ['event', 'device', 'user', 'promoter', 'status', 'source', 'created_at']
    list_filter = ['status', 'source', 'created_at']
    search_fields = ['event__title', 'device__device_id', 'user__email', 'promoter__user__email']
    readonly_fields = ['id', 'created_at']
    date_hierarchy = 'created_at'
