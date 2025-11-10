"""
Admin configuration for participants app.
"""
from django.contrib import admin
from .models import DeviceProfile


@admin.register(DeviceProfile)
class DeviceProfileAdmin(admin.ModelAdmin):
    """Admin interface for DeviceProfile model."""
    list_display = ['device_id', 'platform', 'app_version', 'created_at', 'updated_at']
    list_filter = ['platform', 'created_at']
    search_fields = ['device_id']
    readonly_fields = ['id', 'created_at', 'updated_at']
