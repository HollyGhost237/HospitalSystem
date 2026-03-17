from datetime import date
from rest_framework import serializers
from .models import Reference, ReferenceHistory

class ReferenceHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.username', read_only=True)

    class Meta:
        model = ReferenceHistory
        fields = [
            'id', 'reference', 'status', 'comment',
            'changed_by', 'changed_by_name', 'created_at'
        ]
        read_only_fields = ['created_at']

class ReferenceSerializer(serializers.ModelSerializer):
    # --- Champs calculés ou liés en lecture seule ---
    patient_name = serializers.SerializerMethodField()
    patient_age = serializers.SerializerMethodField()
    patient_gender = serializers.CharField(source='patient.gender', read_only=True)
    
    hospital_destination_name = serializers.ReadOnlyField(source='hopital_destinataire.name')
    service_name = serializers.CharField(source='service.name', read_only=True)
    history = ReferenceHistorySerializer(source='referencehistory_set', many=True, read_only=True)

    # --- Mapping des champs envoyés par React (Source -> Modèle) ---
    # React envoie 'hospital_destination', le modèle utilise 'hopital_destinataire'
    hospital_destination = serializers.PrimaryKeyRelatedField(
        source='hopital_destinataire', 
        queryset=Reference._meta.get_field('hopital_destinataire').remote_field.model.objects.all()
    )
    
    # Si React envoie 'hospital_source' (ou pour l'affichage)
    hospital_source_name = serializers.CharField(source='hopital_referent.name', read_only=True)

    class Meta:
        model = Reference
        fields = '__all__'
        read_only_fields = ['date_reference', 'id']

    def get_patient_name(self, obj):
        if not obj.patient:
            return None
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_patient_age(self, obj):
        if not obj.patient or not obj.patient.date_of_birth:
            return None
        today = date.today()
        dob = obj.patient.date_of_birth
        return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))