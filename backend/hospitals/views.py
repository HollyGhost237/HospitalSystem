# backend/hospitals/views.py

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from geopy.distance import distance
from .models import Hospital
from .serializers import HospitalSerializer
from services.models import Service

class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'address', 'phone']
    ordering_fields = ['name', 'created_at']
    
    @action(detail=False, methods=['get'])
    def a_proximite(self, request):
        """Retourne les hôpitaux à proximité d'une position"""
        lat = request.query_params.get('latitude')
        lon = request.query_params.get('longitude')
        rayon = request.query_params.get('rayon', 50)  # Rayon en km
        
        if not lat or not lon:
            return Response(
                {"error": "Latitude et longitude requis"}, 
                status=400
            )
        
        try:
            lat, lon, rayon = float(lat), float(lon), float(rayon)
            point_origine = (lat, lon)
            
            hopitaux_proches = []
            for hopital in self.get_queryset():
                if hopital.latitude and hopital.longitude:
                    point_hopital = (hopital.latitude, hopital.longitude)
                    dist = distance(point_origine, point_hopital).km
                    if dist <= rayon:
                        hopital_data = HospitalSerializer(hopital).data
                        hopital_data['distance_km'] = round(dist, 2)
                        hopitaux_proches.append(hopital_data)
            
            # Trier par distance
            hopitaux_proches.sort(key=lambda x: x['distance_km'])
            
            return Response(hopitaux_proches)
            
        except ValueError:
            return Response({"error": "Coordonnées invalides"}, status=400)
    
    @action(detail=True, methods=['get'])
    def services_disponibles(self, request, pk=None):
        hopital = self.get_object()
        services = Service.objects.filter(hospitals=hopital)
        data = []
        for service in services:
            data.append({
                'id': service.id,
                'name': service.name,
                'description': service.description
            })
        return Response(data)
