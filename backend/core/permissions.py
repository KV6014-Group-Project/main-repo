"""
Custom DRF permissions for role-based access control.
"""
from rest_framework import permissions
from rest_framework.permissions import BasePermission


class IsOrganiser(BasePermission):
    """
    Permission check for organisers only.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'role') and
            request.user.role.name == 'organiser'
        )


class IsPromoter(BasePermission):
    """
    Permission check for promoters only.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'role') and
            request.user.role.name == 'promoter'
        )


class IsOrganiserOrReadOnly(BasePermission):
    """
    Permission check: organisers can do everything, others read-only.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'role') and
            request.user.role.name == 'organiser'
        )


class IsOrganiserOfEvent(BasePermission):
    """
    Permission check: user must be the organiser of the event.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if not hasattr(request.user, 'role') or request.user.role != 'organiser':
            return False
        
        # Check if obj has an organiser attribute and it matches
        if hasattr(obj, 'organiser'):
            return obj.organiser == request.user
        
        return False


class IsPromoterOfEvent(BasePermission):
    """
    Permission check: user must be a promoter assigned to the event.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if not hasattr(request.user, 'role') or request.user.role != 'promoter':
            return False
        
        # Check if user has a promoter profile
        if not hasattr(request.user, 'promoter_profile'):
            return False
        
        # Check if the event has this promoter assigned
        if hasattr(obj, 'promoters'):
            return obj.promoters.filter(
                promoter=request.user.promoter_profile,
                is_active=True
            ).exists()
        
        return False

