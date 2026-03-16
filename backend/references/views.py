from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Reference, ReferenceHistory
from ml.models import MLTrainingData
from .serializers import ReferenceSerializer, ReferenceHistorySerializer
from .decision_engine import SimpleDecisionEngine


class ReferenceViewSet(viewsets.ModelViewSet):
    queryset = Reference.objects.all()
    serializer_class = ReferenceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def proposer_hopital(self, request):
        patient_id = request.data.get('patient_id')
        service_id = request.data.get('service_id')
        if not patient_id or not service_id:
            return Response({'error': 'patient_id et service_id requis'}, status=400)
        return self.proposer_hopitaux(request)

    @action(detail=False, methods=['post'])
    def proposer_hopitaux(self, request):
        patient_id = request.data.get('patient_id')
        service_id = request.data.get('service_id')

        if not patient_id or not service_id:
            return Response({'error': 'patient_id et service_id requis'}, status=400)

        try:
            from patients.models import Patient
            patient = Patient.objects.get(id=patient_id)

            hospital_source = request.user.hospital
            if not hospital_source or not hospital_source.latitude or not hospital_source.longitude:
                return Response({'error': "Hopital source non geolocalise"}, status=400)

            coords = (hospital_source.latitude, hospital_source.longitude)

            engine = SimpleDecisionEngine()
            propositions = engine.proposer_hopitaux(
                patient_coords=coords,
                service_id=service_id,
                patient=patient
            )

            resultats = []
            for prop in propositions:
                resultats.append({
                    'id': prop['hopital'].id,
                    'name': prop['hopital'].name,
                    'address': prop['hopital'].address,
                    'phone': prop['hopital'].phone,
                    'distance_km': prop['distance_km'],
                    'score': prop['score'],
                    'ml_data_id': prop['ml_data_id']
                })

            return Response({
                'propositions': resultats,
                'message': 'Choisissez un hopital et confirmez avec /choisir_hopital/'
            })

        except Patient.DoesNotExist:
            return Response({'error': 'Patient non trouve'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['post'])
    def choisir_hopital(self, request):
        ml_data_id = request.data.get('ml_data_id') or request.data.get('donnee_ml_id')
        reference_id = request.data.get('reference_id')

        if not ml_data_id:
            return Response({'error': 'ml_data_id requis'}, status=400)

        engine = SimpleDecisionEngine()
        engine.enregistrer_choix_final(ml_data_id, True)

        if reference_id:
            try:
                ref = Reference.objects.get(id=reference_id)
                ml_data = MLTrainingData.objects.get(id=ml_data_id)
                ml_data.reference = ref
                ml_data.save()
            except Exception:
                pass

        return Response({'message': 'Choix enregistre avec succes'})

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        reference = self.get_object()
        history = ReferenceHistory.objects.filter(reference=reference).order_by('-created_at')
        serializer = ReferenceHistorySerializer(history, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(
            doctor=self.request.user,
            hospital_source=self.request.user.hospital
        )
