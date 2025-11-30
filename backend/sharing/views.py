"""API views for sharing tokens (RSVP links).

Provides a public endpoint that accepts a share token and creates an
RSVP for the associated Event. The endpoint is intentionally public
but enforces token validity (expiry and single-use) and minimal
rate-limiting should be applied via DRF throttling.
"""
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import PermissionDenied

from .models import ShareToken
from events.models import RSVP as EventRSVP
from participants.models import DeviceProfile
from core.utils import get_client_ip, ip_to_country_code


class RSVPView(APIView):
	permission_classes = [AllowAny]

	def post(self, request, token: str):
		"""Accept an RSVP using a share token.

		Body (JSON):
		  - device_id (optional): string identifier for device
		  - status (optional): RSVP status (defaults to 'rsvp')
		"""
		share = get_object_or_404(ShareToken, token=token)

		if not share.is_valid():
			raise PermissionDenied("Token expired or already used")

		# Optionally attach a device profile
		device = None
		device_id = request.data.get('device_id')
		if device_id:
			try:
				device = DeviceProfile.objects.get(device_id=device_id)
			except DeviceProfile.DoesNotExist:
				device = None

		status_value = request.data.get('status', 'rsvp')

		# Region enforcement: determine client's IP and country and flag if outside allowed list
		client_ip = get_client_ip(request)
		country = ip_to_country_code(client_ip)

		suspicious = False
		if getattr(share.event, 'enforce_country_restriction', False):
			allowed = share.event.allowed_country_codes or []
			# If country cannot be resolved or is not in allowed list, mark suspicious
			if country is None or country not in allowed:
				suspicious = True

		# Create RSVP record (record IP, country & suspicious flag for audit)
		rsvp = EventRSVP.objects.create(
			event=share.event,
			device=device,
			status=status_value,
			source='link',
			scanned_at=timezone.now(),
			ip_address=client_ip,
			country_code=country,
			suspicious=suspicious,
		)

		# Mark token as used (single-use link)
		share.used = True
		share.save()

		# If suspicious and enforcement is strict you could return 403 instead.
		return Response({
			'status': 'ok',
			'rsvp_id': str(rsvp.id),
			'suspicious': suspicious,
		}, status=status.HTTP_201_CREATED)
