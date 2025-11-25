from django.apps import AppConfig
from django.db.models.signals import post_migrate

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        post_migrate.connect(create_defaults, sender=self)


def create_defaults(sender, **kwargs):
    """Create default roles after migrations."""
    from .models import Roles
    
    role_defaults = [
        {'name': 'organiser', 'description': 'The organisers for events.'},
        {'name': 'promoter', 'description': 'The promoters for events.'}
    ]
    
    for role in role_defaults:
        Roles.objects.get_or_create(
            name=role['name'],
            defaults={'description': role['description']}
        )