from django.test import TestCase
from django.utils import timezone
from datetime import timedelta

from rest_framework.test import APIClient

from users.models import User
from events.models import Event
from .models import ShareToken
from events.models import RSVP as EventRSVP
from unittest.mock import patch


class ShareTokenTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		# create organiser user
		self.user = User.objects.create_user(email='org@example.com', password='P@ssword1234', role='organiser')
		now = timezone.now()
		self.event = Event.objects.create(
			organiser=self.user,
			title='Test Event',
			description='desc',
			start_datetime=now + timedelta(days=1),
			end_datetime=now + timedelta(days=1, hours=2),
		)
		self.share = ShareToken.objects.create(event=self.event, expires_at=timezone.now() + timedelta(hours=1))

	def test_rsvp_single_use(self):
		url = f'/api/sharing/rsvp/{self.share.token}/'
		resp = self.client.post(url, {}, format='json')
		self.assertEqual(resp.status_code, 201)
		self.share.refresh_from_db()
		self.assertTrue(self.share.used)

		# reuse should be forbidden
		resp2 = self.client.post(url, {}, format='json')
		self.assertIn(resp2.status_code, (400, 403))

	def test_rsvp_expired(self):
		# expire token
		self.share.expires_at = timezone.now() - timedelta(hours=1)
		self.share.save()
		url = f'/api/sharing/rsvp/{self.share.token}/'
		resp = self.client.post(url, {}, format='json')
		self.assertIn(resp.status_code, (400, 403))

	def test_rsvp_country_allowed_and_flagging(self):
		# Configure event to enforce country restriction
		self.event.allowed_country_codes = ['GB']
		self.event.enforce_country_restriction = True
		self.event.save()

		url = f'/api/sharing/rsvp/{self.share.token}/'

		# Mock IP lookup to return 'GB'
		with patch('core.utils.ip_to_country_code', return_value='GB'):
			resp = self.client.post(url, {}, format='json')
			self.assertEqual(resp.status_code, 201)
			# check RSVP created and not suspicious
			rsvp = EventRSVP.objects.get(id=resp.data['rsvp_id'])
			self.assertFalse(rsvp.suspicious)

		# New token for negative test
		share2 = ShareToken.objects.create(event=self.event, expires_at=timezone.now() + timedelta(hours=1))
		url2 = f'/api/sharing/rsvp/{share2.token}/'
		with patch('core.utils.ip_to_country_code', return_value='US'):
			resp2 = self.client.post(url2, {}, format='json')
			self.assertEqual(resp2.status_code, 201)
			rsvp2 = EventRSVP.objects.get(id=resp2.data['rsvp_id'])
			# should be flagged as suspicious
			self.assertTrue(rsvp2.suspicious)
