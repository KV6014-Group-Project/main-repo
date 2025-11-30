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

		# Create RSVP record
		rsvp = EventRSVP.objects.create(
			event=share.event,
			device=device,
			status=status_value,
			source='link',
			scanned_at=timezone.now(),
		)

		# Mark token as used (single-use link)
		share.used = True
		share.save()

		return Response({
			'status': 'ok',
			'rsvp_id': str(rsvp.id),
		}, status=status.HTTP_201_CREATED)
