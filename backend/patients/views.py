from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Patient
from .serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['gender']
    search_fields = ['first_name', 'last_name', 'phone']
    ordering_fields = ['first_name', 'last_name', 'created_at']
    
    @action(detail=True, methods=['get'])
    def references(self, request, pk=None):
        patient = self.get_object()
        references = patient.reference_set.all()
        from references.serializers import ReferenceSerializer
        serializer = ReferenceSerializer(references, many=True)
        return Response(serializer.data)
