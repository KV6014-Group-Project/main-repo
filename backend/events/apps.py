from django.apps import AppConfig
from django.db.models.signals import post_migrate

class EventsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'events'

    def ready(self):
        post_migrate.connect(create_defaults, sender=self)


def create_defaults(sender, **kwargs):
    """Create default event statuses after migrations."""
    from .models import EventStatuses, RSVPStatuses, RSVPSources
    
    event_status_defaults = [
        {'name': 'draft', 'description': 'Event is being prepared'},
        {'name': 'published', 'description': 'Event is live and visible'},
        {'name': 'cancelled', 'description': 'Event has been cancelled'},
        {'name': 'completed', 'description': 'Event has finished'},
    ]
    
    for status in event_status_defaults:
        EventStatuses.objects.get_or_create(
            name=status['name'],
            defaults={'description': status['description']}
        )
    
    rsvp_status_defaults = [
        {'name': 'rsvp', 'description': 'Confirmed attendance'},
        {'name': 'interested', 'description': 'Interested in attending'},
        {'name': 'cancelled', 'description': 'Cancelled attendance'},
    ]
    
    for status in rsvp_status_defaults:
        RSVPStatuses.objects.get_or_create(
            name=status['name'],
            defaults={'description': status['description']}
        )

    source_defaults = [
        {'name': 'qr', 'description': 'Scanned QR code'},
        {'name': 'link', 'description': 'Clicked shared link'},
        {'name': 'offline_sync', 'description': 'Synced from offline device'},
    ]
    for source in source_defaults:
        RSVPSources.objects.get_or_create(
            name=source['name'],
            defaults={'description': source['description']}
        )
