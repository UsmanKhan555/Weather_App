from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import WeatherLog
from .serializers import WeatherLogSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def weather_logs(request):
    user = request.user  # Get the authenticated user
    if request.method == 'GET':
        logs = WeatherLog.objects.order_by('-timestamp')[:10]  # latest 10 logs
        serializer = WeatherLogSerializer(logs, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        data = request.data.copy()
        data['user'] = user.id
        # Ensure the user is set to the authenticated user
        serializer = WeatherLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'User created successfully'}, status=201)