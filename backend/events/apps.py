from django.apps import AppConfig
from django.db.models.signals import post_migrate

class EventsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'events'

    """
    # this creates the default values on migration
    def ready(self):
        from .models import EventStatuses, Roles

        def create_defaults(sender, **kwargs):
            # create roles defaults
            role_defaults = [
                {'name': 'admin', 'description': 'Admin with full access controls'},
                {'name': 'staff', 'description': 'Staff access controls'},
                {'name': 'organizer', 'description': 'Organizer access controls'}
            ]
            for role in role_defaults:
                Roles.objects.get_or_create(name=role['name'], defaults={'description': role['description']})

            # create status defaults
            status_defaults = ['draft', 'published', 'cancelled', 'completed']
            for status in status_defaults:
                EventStatuses.objects.get_or_create(name=status)
            
        post_migrate.connect(create_defaults, sender=self)
    """
