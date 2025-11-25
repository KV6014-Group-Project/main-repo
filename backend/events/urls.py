"""
URL configuration for events app.
"""
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

"""
"""
URL configuration for events app.
"""
from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    path('statuses/', views.list_statuses, name='list-statuses'),
    path('create/', views.create_event, name='create-event'),
    path('', views.list_public_events, name='list-public-events'),
    path('<uuid:event_id>/', views.view_event, name='view-event'),
    path('<uuid:event_id>/update/', views.update_event, name='update-event'),
    path('<uuid:event_id>/delete/', views.delete_event, name='delete-event')
]

