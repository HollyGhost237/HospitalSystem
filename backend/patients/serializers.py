from rest_framework import serializers
from .models import Patient
from datetime import date

class PatientSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()
    nom_complet = serializers.SerializerMethodField()
    
    class Meta:
        model = Patient
        fields = [
            'id', 'first_name', 'last_name', 'nom_complet',
            'date_of_birth', 'age', 'gender', 'phone',
            'address', 'created_at'
        ]
        read_only_fields = ['created_at']
    
    def get_age(self, obj):
        """Calculer l'âge à partir de la date de naissance"""
        if obj.date_of_birth:
            today = date.today()
            return today.year - obj.date_of_birth.year - ((today.month, today.day) < (obj.date_of_birth.month, obj.date_of_birth.day))
        return None
    
    def get_nom_complet(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    
    def validate_phone(self, value):
        if value and not value.replace('+', '').replace('-', '').replace(' ', '').replace('(', '').replace(')', '').isdigit():
            raise serializers.ValidationError("Le téléphone doit contenir uniquement des chiffres et caractères de séparation valides.")
        return value