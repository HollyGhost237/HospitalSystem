from rest_framework import viewsets
from .models import Service, HospitalService
from .serializers import ServiceSerializer, HospitalServiceSerializer

# Create your views here.
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class HospitalServiceViewSet(viewsets.ModelViewSet):
    queryset = HospitalService.objects.all()
    serializer_class = HospitalServiceSerializer

