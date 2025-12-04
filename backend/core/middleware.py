from django.conf import settings
from django.contrib.gis.geoip2 import GeoIP2
from django.http import JsonResponse
import logging

# Logging setup for when log files stored and not just sent to console
logger = logging.getLogger(__name__)


class CountryBlockMiddleware:
    """Middleware to block requests from certain countries."""
    
    def __init__(self, get_response):
        self.get_response = get_response
        try:
            self.geoip = GeoIP2()
        except Exception as e:
            logger.error(f"Failed to initialize GeoIP2: {e}")
            self.geoip = None
    
    def __call__(self, request):
        # Skip blocking for admin
        if request.path.startswith('/admin/'):
            return self.get_response(request)
        
        # Get allowed countries from settings
        allowed_countries = getattr(settings, 'ALLOWED_COUNTRIES', [])
        
        # If no countries specified or GeoIP not available, allow all
        if not allowed_countries or not self.geoip:
            return self.get_response(request)
        
        # Get client IP
        ip = self.get_client_ip(request)
        
        # Skip for localhost/private IPs (development)
        # comment out for security test, or create .env and add DEV/PROD variable for dynamic check.
        """
        if self.is_private_ip(ip):
            return self.get_response(request)
        """
            
        try:
            # Look up country
            country_code = self.geoip.country_code(ip)
            
            # Block if country not in allowed list
            if country_code not in allowed_countries:
                logger.warning(f"Blocked request from {country_code} (IP: {ip})")
                return JsonResponse({
                    'message': 'Access from your country is not permitted!'
                }, status=403)
        
        except Exception as e:
            # Block if we can't determine country
            logger.warning(f"Could not determine country for IP {ip}: {e} - BLOCKING")
            return JsonResponse({
                'message': 'Unable to verify your location'
            }, status=403)
        
        return self.get_response(request)
    
    def get_client_ip(self, request):
        """Extract the client's IP address from the request."""
        # Check for X-Forwarded-For header (if behind proxy/load balancer)
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # Take the first IP in the list
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def is_private_ip(self, ip):
        """Check if IP is private/localhost (for development)."""
        if not ip:
            return True
        
        # Localhost
        if ip in ['127.0.0.1', '::1', 'localhost']:
            return True
        
        # Private IP ranges
        private_ranges = [
            '10.',
            '172.16.', '172.17.', '172.18.', '172.19.',
            '172.20.', '172.21.', '172.22.', '172.23.',
            '172.24.', '172.25.', '172.26.', '172.27.',
            '172.28.', '172.29.', '172.30.', '172.31.',
            '192.168.'
        ]
        
        return any(ip.startswith(prefix) for prefix in private_ranges)