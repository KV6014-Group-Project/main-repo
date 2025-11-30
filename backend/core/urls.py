from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('public-key/', views.get_public_key, name='public-key'),
]