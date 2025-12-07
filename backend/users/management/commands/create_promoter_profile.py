from django.core.management.base import BaseCommand
from users.models import User, PromoterProfile


class Command(BaseCommand):
    help = 'Create PromoterProfile for existing promoter test account'

    def handle(self, *args, **options):
        try:
            promoter_user = User.objects.get(email='promoter@gmail.com')
            profile, created = PromoterProfile.objects.get_or_create(user=promoter_user)
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created PromoterProfile for {promoter_user.email}'))
            else:
                self.stdout.write(self.style.WARNING(f'PromoterProfile already exists for {promoter_user.email}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('Promoter test account does not exist'))
