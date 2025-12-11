from django.apps import AppConfig
from django.db.models.signals import post_migrate

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        post_migrate.connect(create_defaults, sender=self)


def create_defaults(sender, **kwargs):
    """Create default roles and test accounts after migrations."""
    from .models import Roles, User, PromoterProfile
    
    # Create default roles
    role_defaults = [
        {'name': 'organiser', 'description': 'The organisers for events.'},
        {'name': 'promoter', 'description': 'The promoters for events.'}
    ]
    
    for role in role_defaults:
        Roles.objects.get_or_create(
            name=role['name'],
            defaults={'description': role['description']}
        )
    
    # Create test accounts
    test_accounts = [
        {
            'email': 'promoter@gmail.com',
            'password': 'Password12345',
            'role_name': 'promoter'
        },
        {
            'email': 'organiser@gmail.com',
            'password': 'Password12345',
            'role_name': 'organiser'
        }
    ]
    
    for account in test_accounts:
        role = Roles.objects.get(name=account['role_name'])
        user, created = User.objects.get_or_create(
            email=account['email'],
            defaults={'role': role}
        )
        if created:
            user.set_password(account['password'])
            user.save()
            print(f"Created test account: {account['email']}")
            
            # Create PromoterProfile for promoter accounts
            if account['role_name'] == 'promoter':
                PromoterProfile.objects.get_or_create(user=user)
                print(f"Created PromoterProfile for {account['email']}")