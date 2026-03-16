from django.db import models
from django.contrib.auth import get_user_model
from patients.models import Patient
from hospitals.models import Hospital
from references.models import Reference

User = get_user_model()

class MLTrainingData(models.Model):
    """
    Collecte les données pour entraîner le futur modèle ML
    """
    # Relations
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    reference = models.ForeignKey(Reference, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    # Features (caractéristiques)
    features = models.JSONField(help_text="Toutes les caractéristiques de la décision")
    
    # Labels (ce qui s'est passé)
    score_calcule = models.FloatField()
    choix_final = models.BooleanField(null=True, blank=True)  # True = choisi, False = pas choisi
    reference_completee = models.BooleanField(null=True, blank=True)  # La référence a réussi ?
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Donnée d'entraînement ML"
        verbose_name_plural = "Données d'entraînement ML"
    
    def __str__(self):
        return f"Donnée ML {self.id} - {self.created_at}"