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
    list_display = ['event', 'device', 'user', 'promoter', 'status', 'source', 'country_code', 'suspicious', 'created_at']
    list_filter = ['status', 'source', 'suspicious', 'country_code', 'created_at']
    search_fields = ['event__title', 'device__device_id', 'user__email', 'promoter__user__email', 'ip_address']
    readonly_fields = ['id', 'created_at', 'ip_address', 'country_code']
    date_hierarchy = 'created_at'

    actions = ['mark_suspicious', 'clear_suspicious']

    def mark_suspicious(self, request, queryset):
        updated = queryset.update(suspicious=True)
        self.message_user(request, f"Marked {updated} RSVP(s) as suspicious")
    mark_suspicious.short_description = 'Mark selected RSVPs as suspicious'

    def clear_suspicious(self, request, queryset):
        updated = queryset.update(suspicious=False)
        self.message_user(request, f"Cleared suspicious flag on {updated} RSVP(s)")
    clear_suspicious.short_description = 'Clear suspicious flag on selected RSVPs'
