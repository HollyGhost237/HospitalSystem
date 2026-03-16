from django.db import models
from patients.models import Patient
from hospitals.models import Hospital
from services.models import Service
from users.models import User


class Reference(models.Model):
    # --- Informations de Base ---
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    hopital_referent = models.ForeignKey('hospitals.Hospital', related_name='sortantes', on_delete=models.CASCADE)
    hopital_destinataire = models.ForeignKey('hospitals.Hospital', related_name='entrantes', on_delete=models.CASCADE)
    service_id = models.ForeignKey('services.Service', on_delete=models.CASCADE)
    
    # --- Section RÉFÉRENCE (Source: PDF [cite: 7, 8, 11, 14, 26, 27]) ---
    date_reference = models.DateTimeField(auto_now_add=True) 
    motif_consultation = models.TextField()
    trouvailles_cliniques = models.TextField()
    diagnostic = models.TextField()
    examens_faits = models.TextField(blank=True) # Para-cliniques
    traitements_reçus = models.TextField(blank=True) # Médicaments et dosages
    raisons_reference = models.TextField()
    
    URGENCE_CHOICES = [
        ('TRES_URGENT', 'Très Urgent'),
        ('MOYENNE', 'Moyenne urgence'),
        ('FAIBLE', 'Faible urgence'),
    ]
    niveau_urgence = models.CharField(max_length=20, choices=URGENCE_CHOICES, default='FAIBLE')

    # --- Section CONTRE-RÉFÉRENCE (Source: PDF [cite: 31, 32, 45, 46]) ---
    date_reception = models.DateTimeField(null=True, blank=True) 
    trouvailles_reception = models.TextField(null=True, blank=True) 
    soins_administres = models.TextField(null=True, blank=True) 
    evolution_favorable = models.BooleanField(default=None, null=True) 
    besoin_suivi = models.BooleanField(default=False) 
    date_rendez_vous = models.DateField(null=True, blank=True) 
    date_sortie = models.DateTimeField(null=True, blank=True) 
    commentaires_destinataire = models.TextField(null=True, blank=True) 

    class Meta:
        db_table = 'references_table'
    
class ReferenceHistory(models.Model):

    reference = models.ForeignKey(
        Reference,
        on_delete=models.CASCADE
    )

    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    status = models.CharField(max_length=50)

    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History for Reference {self.reference.id}"