"""
Serializers for users app.
"""
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import User, PromoterProfile
import re

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'first_name', 'last_name', 'phone', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

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
    
    # redundant due to choices in models. If I get around to normalizing, then this will need to be sorted.
    def validate_role(self, value):
        """Validate role."""
        if value not in ['organiser', 'promoter']:
            raise serializers.ValidationError("Role must be 'organiser' or 'promoter'.")
        return value
    
    def create(self, validated_data):
        """Create a new user."""
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        
        # Create promoter profile if role is promoter
        if user.role == 'promoter':
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

