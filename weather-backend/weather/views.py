from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import WeatherLog
from .serializers import WeatherLogSerializer

@api_view(['GET', 'POST'])
def weather_logs(request):
    if request.method == 'GET':
        logs = WeatherLog.objects.order_by('-timestamp')[:10]  # latest 10 logs
        serializer = WeatherLogSerializer(logs, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        serializer = WeatherLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
