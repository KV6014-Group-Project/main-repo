"""Sharing models.

This module implements short-lived share tokens used for RSVP links and
other shareable links. Tokens are cryptographically-secure, have an
optional expiry, and are single-use when appropriate.
"""
from django.db import models
from django.utils import timezone
from django.conf import settings

from events.models import Event
from core.utils import generate_secure_token


class ShareToken(models.Model):
	"""Represent a shareable token for an Event (e.g., RSVP link).

	- `token`: cryptographically secure string
	- `event`: link to the Event
	- `scope`: purpose (e.g., 'rsvp')
	- `promoter_id`: optional promoter attribution
	- `expires_at`: optional expiry datetime
	- `used`: mark token as consumed
	"""
	token = models.CharField(max_length=128, unique=True, default=generate_secure_token)
	event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='share_tokens')
	scope = models.CharField(max_length=50, default='rsvp')
	promoter_id = models.UUIDField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	expires_at = models.DateTimeField(null=True, blank=True)
	used = models.BooleanField(default=False)

	class Meta:
		db_table = 'share_tokens'
		indexes = [
			models.Index(fields=['token']),
			models.Index(fields=['event', 'used']),
		]

	def __str__(self) -> str:  # pragma: no cover - trivial
		return f"ShareToken({self.scope}) for {self.event.title}"

	def is_valid(self) -> bool:
		"""Return True if token is not used and not expired."""
		if self.used:
			return False
		if self.expires_at and timezone.now() > self.expires_at:
			return False
		return True
