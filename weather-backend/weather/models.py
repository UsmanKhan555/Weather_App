from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class WeatherLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=100)
    temperature = models.FloatField()
    unit = models.CharField(max_length=10, default='C')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.city} - {self.temperature}°{self.unit}"
