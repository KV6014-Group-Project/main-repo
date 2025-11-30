from django.urls import path
from .views import RSVPView

urlpatterns = [
    path('rsvp/<str:token>/', RSVPView.as_view(), name='rsvp'),
]
