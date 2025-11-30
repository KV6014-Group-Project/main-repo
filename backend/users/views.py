"""
Authentication views for users app.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from core.views import BaseAPIView
from .models import Roles, User
from .serializers import (
    RolesSerializer,
    UserSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    AuthResponseSerializer,
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user."""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        response_serializer = AuthResponseSerializer({
            'user': user,
            'token': token.key,
        })
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login a user."""
    serializer = UserLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.is_active:
        return Response(
            {'error': 'User account is disabled'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    token, created = Token.objects.get_or_create(user=user)
    
    response_serializer = AuthResponseSerializer({
        'user': user,
        'token': token.key,
    })
    return Response(response_serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout a user by deleting their token."""
    try:
        request.user.auth_token.delete()
    except Exception:
        pass
    
    return Response({'success': True, 'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get current user information."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_roles(request):
    """Get current roles"""
    roles = Roles.objects.all()
    serializer = RolesSerializer(roles, many=True)
    return Response(serializer.data)


# TODO: setup account delete with password check