"""
Admin configuration for events app.
"""
from django.contrib import admin
from .models import Event, EventPromoter, RSVP, EventVenues, EventStatuses


@admin.register(EventVenues)
class EventVenuesAdmin(admin.ModelAdmin):
    """Admin interface for EventVenues model."""
    list_display = ['name', 'room', 'address']
    search_fields = ['name', 'room', 'address']
    readonly_fields = ['id']


@admin.register(EventStatuses)
class EventStatusesAdmin(admin.ModelAdmin):
    """Admin interface for EventStatuses model."""
    list_display = ['name', 'description']
    search_fields = ['name', 'description']
    readonly_fields = ['id']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Admin interface for Event model."""
    list_display = ['title', 'organiser', 'start_datetime', 'status', 'is_private', 'venue', 'created_at']
    list_filter = ['status', 'is_private', 'created_at', 'start_datetime']
    search_fields = ['title', 'description', 'organiser__email', 'venue__name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    date_hierarchy = 'start_datetime'
    autocomplete_fields = ['venue', 'status']  # Makes selecting FK easier in admin


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