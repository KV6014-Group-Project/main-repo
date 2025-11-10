"""
Shared serializers and base classes for DRF.
"""
from rest_framework import serializers


class BaseModelSerializer(serializers.ModelSerializer):
    """
    Base serializer with common functionality.
    """
    id = serializers.UUIDField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)


class ErrorResponseSerializer(serializers.Serializer):
    """
    Standard error response serializer.
    """
    error = serializers.CharField()
    message = serializers.CharField(required=False)
    details = serializers.DictField(required=False)


class SuccessResponseSerializer(serializers.Serializer):
    """
    Standard success response serializer.
    """
    success = serializers.BooleanField()
    message = serializers.CharField(required=False)
    data = serializers.DictField(required=False)

