from django.db import models

# Create your models here.

class WeatherLog(models.Model):
    city = models.CharField(max_length=100)
    temperature = models.FloatField()
    unit = models.CharField(max_length=10, default='Celsius')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.city} - {self.temperature}°{self.unit}"
