from django.urls import path
from .views import weather_logs, register

urlpatterns = [
    path('logs/', weather_logs),
    path('register/', register),
]
