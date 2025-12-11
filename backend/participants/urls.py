"""
URL configuration for participants app.
"""
from django.urls import path
from . import views

app_name = 'participants'

urlpatterns = [
    path('sync/', views.sync, name='sync'),
    path('events/', views.events, name='events'),
    path('delete/', views.delete_device, name='delete_device'),
]

