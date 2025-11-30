"""
User models for organisers and promoters.
"""
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class Roles(models.Model):
    """Role lookup table."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(max_length=255, blank=True)

    class Meta:
        db_table = 'roles'
        ordering = ['name']

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    """Custom user manager."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user."""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        # set fk role, or create if doesn't exist then set fk role
        organiser_role, _ = Roles.objects.get_or_create(name='organiser')
        extra_fields.setdefault('role', organiser_role)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)
    
        
class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model with role-based authentication.
    Roles: 'organiser' | 'promoter'
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.ForeignKey(Roles, on_delete=models.PROTECT, related_name='users')
    
    # Profile fields
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    # Django auth fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role']
    
    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.email
    
    @property
    def is_organiser(self):
        """Check if user is an organiser."""
        return self.role == 'organiser'
    
    @property
    def is_promoter(self):
        """Check if user is a promoter."""
        return self.role == 'promoter'


class PromoterProfile(models.Model):
    """
    Profile for promoters with additional metadata.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='promoter_profile')
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'promoter_profiles'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"PromoterProfile for {self.user.email}"
