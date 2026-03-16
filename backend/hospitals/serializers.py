from rest_framework import serializers
from .models import Hospital
from services.models import Service # Assure-toi d'importer ton modèle Service

class HospitalSerializer(serializers.ModelSerializer):
    # 'services' reste le nom utilisé par ton frontend React
    services = serializers.PrimaryKeyRelatedField(
        source='services_list', # <--- On pointe vers le related_name du modèle Service
        many=True, 
        queryset=Service.objects.all(),
        required=False
    )

    class Meta:
        model = Hospital
        fields = [
            'id', 'name', 'address', 'phone', 
            'latitude', 'longitude', 'type', 
            'services', # Ce champ gère maintenant la table hospital_services via services_list
            'created_at'
        ]