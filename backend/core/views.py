"""
Base views and view utilities.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework import status


class BaseAPIView(APIView):
    """
    Base API view with common functionality.
    """
    
    def success_response(self, data=None, message=None, status_code=status.HTTP_200_OK):
        """Return a success response."""
        response = {'success': True}
        if message:
            response['message'] = message
        if data is not None:
            response['data'] = data
        return Response(response, status=status_code)
    
    def error_response(self, error, message=None, details=None, status_code=status.HTTP_400_BAD_REQUEST):
        """Return an error response."""
        response = {'error': error}
        if message:
            response['message'] = message
        if details:
            response['details'] = details
        return Response(response, status=status_code)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def get_public_key(request):
    """Get the Ed25519 public key for signature verification."""
    from .utils import get_public_key_base64
    return Response({'public_key': get_public_key_base64()})