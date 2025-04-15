from django.urls import path
from .views import weather_logs

urlpatterns = [
    path('logs/', weather_logs),
]
