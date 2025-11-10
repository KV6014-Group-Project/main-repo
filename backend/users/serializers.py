"""
Serializers for users app.
"""
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import User, PromoterProfile


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'name', 'phone', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'role', 'name', 'phone']
        extra_kwargs = {
            'email': {'required': True},
            'role': {'required': True},
        }
    
    def validate(self, attrs):
        """Validate password confirmation."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs
    
    def validate_role(self, value):
        """Validate role."""
        if value not in ['organiser', 'promoter']:
            raise serializers.ValidationError("Role must be 'organiser' or 'promoter'.")
        return value
    
    def create(self, validated_data):
        """Create a new user."""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        
        # Create promoter profile if role is promoter
        if user.role == 'promoter':
            PromoterProfile.objects.create(user=user)
        
        return user


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

