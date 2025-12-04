"""
Serializers for users app.
"""
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import Roles, User, PromoterProfile
import re
from uuid import UUID

class RolesSerializer(serializers.ModelSerializer):
    """Serializer for Roles."""
    class Meta:
        model = Roles
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    role = RolesSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'first_name', 'last_name', 'phone', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(required=True)

    def validate_email(self, value):
        """Validate email"""
        # ensure email is unique
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")

        # allowed email domains, expand as needed
        allowed_domains = [
            "hotmail.com",
            "hotmail.co.uk",
            "outlook.com",
            "gmail.com",
            "yahoo.com",
            "googlemail.com",
            "live.com",
            "msn.com",
            "aol.com",
            "icloud.com",
            "protonmail.com",
            "yandex.com",
            "tencent.com",
            "verizon.net",
            "comcast.net"
        ]

        domain = value.split('@')[-1].lower()
        if domain not in allowed_domains:
            raise serializers.ValidationError(f"Email domain '{domain}' isn't supported. Please use a common provider.")
        
        return value
    
    def validate_password(self, value):
        """Validate password"""
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r"\d", value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain at least one uppercase character.")
        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Password must contain at least one lowercase character.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value
    
    def validate_role(self, value):
        """Validate that the role exists by UUID or name."""
        role = None
        
        # Try to find role by UUID first
        try:
            UUID(str(value))  # Validate it's a valid UUID format
            role = Roles.objects.filter(id=value).first()
        except (ValueError, AttributeError):
            # If not a valid UUID, try to find by name
            role = Roles.objects.filter(name__iexact=value).first()
        
        if not role:
            raise serializers.ValidationError(
                "The selected role does not exist. Please provide a valid role name or UUID."
            )
        
        # Return the role object so it can be used in create()
        return role
        """
        if value not in ['organiser', 'promoter']:
            raise serializers.ValidationError("Role must be 'organiser' or 'promoter'.")
        return value
        """
    
    def create(self, validated_data):
        """Create a new user."""
        password = validated_data.pop('password')
        role = validated_data.pop('role')
        
        # Create user with role FK
        user = User.objects.create_user(password=password, role=role, **validated_data)
        
        # Create promoter profile if role is promoter
        if user.role.name == 'promoter':
            PromoterProfile.objects.create(user=user)
        
        return user
    
    class Meta:
        model = User
        fields = ['email', 'password', 'role', 'first_name', 'last_name', 'phone']
        extra_kwargs = {
            'email': {'required': True},
            'role': {'required': True},
        }


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class AuthResponseSerializer(serializers.Serializer):
    """Serializer for authentication response."""
    user = UserSerializer()
    token = serializers.CharField()


class PromoterProfileSerializer(serializers.ModelSerializer):
    """Serializer for PromoterProfile model."""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PromoterProfile
        fields = ['id', 'user', 'metadata', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

