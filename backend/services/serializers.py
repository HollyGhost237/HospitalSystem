from rest_framework import serializers
from .models import Service, HospitalService


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description']


class HospitalServiceSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)

    class Meta:
        model = HospitalService
        fields = [
            'id', 'hospital', 'hospital_name', 'service', 'service_name'
        ]
