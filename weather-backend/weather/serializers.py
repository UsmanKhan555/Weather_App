from rest_framework import serializers
from .models import WeatherLog

class WeatherLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherLog
        fields = '__all__'
