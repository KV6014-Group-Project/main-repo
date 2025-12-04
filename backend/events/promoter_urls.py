"""
URL configuration for promoter endpoints in events app.
"""
from django.urls import path
from . import promoter_views

app_name = 'promoter_events'

urlpatterns = [
    path('events/', promoter_views.promoter_events, name='promoter-events'),
    path('events/<uuid:event_id>/', promoter_views.promoter_event_detail, name='promoter-event-detail'),
    path('accept/', promoter_views.promoter_accept, name='promoter-accept'),
    path('events/<uuid:event_id>/share/participant/', promoter_views.promoter_share_participant, name='promoter-share-participant'),
    path('events/<uuid:event_id>/stats/', promoter_views.promoter_event_stats, name='promoter-event-stats'),
]

