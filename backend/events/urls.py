"""
URL configuration for events app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'events'

router = DefaultRouter()
router.register(r'', views.EventViewSet, basename='event')

urlpatterns = [
    path('', include(router.urls)),
]
