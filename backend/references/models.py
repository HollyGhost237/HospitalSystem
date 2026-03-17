from django.db import models
from patients.models import Patient
from hospitals.models import Hospital
from services.models import Service
from users.models import User
from django.conf import settings

class Reference(models.Model):
    # --- Informations de Base ---
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    # On utilise 'service' pour correspondre à ce que React envoie
    service = models.ForeignKey('services.Service', on_delete=models.CASCADE)
    
    hospital_source = models.ForeignKey('hospitals.Hospital', related_name='references_envoyees', on_delete=models.CASCADE)
    hospital_destination = models.ForeignKey('hospitals.Hospital', related_name='references_recues', on_delete=models.CASCADE)
    
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='references_creees'
    )

    # --- Section RÉFÉRENCE ---
    date_reference = models.DateTimeField(auto_now_add=True) 
    motif_consultation = models.TextField()
    trouvailles_cliniques = models.TextField()
    diagnostic = models.TextField()
    examens_faits = models.TextField(blank=True) 
    traitements_recus = models.TextField(blank=True)
    raisons_reference = models.TextField()
    
    URGENCE_CHOICES = [
        ('TRES_URGENT', 'Très Urgent'),
        ('MOYENNE', 'Moyenne urgence'),
        ('FAIBLE', 'Faible urgence'),
    ]
    niveau_urgence = models.CharField(max_length=20, choices=URGENCE_CHOICES, default='FAIBLE')

    # --- Section CONTRE-RÉFÉRENCE ---
    date_reception = models.DateTimeField(null=True, blank=True) 
    trouvailles_reception = models.TextField(null=True, blank=True) 
    soins_administres = models.TextField(null=True, blank=True) 
    evolution_favorable = models.BooleanField(default=None, null=True) 
    besoin_suivi = models.BooleanField(default=False) 
    date_rendez_vous = models.DateField(null=True, blank=True) 
    date_sortie = models.DateTimeField(null=True, blank=True) 
    commentaires_destinataire = models.TextField(null=True, blank=True) 

    class Meta:
        db_table = 'references_reference' 

# Cette classe DOIT être au même niveau 
class ReferenceHistory(models.Model):
    reference = models.ForeignKey(Reference, on_delete=models.CASCADE)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=50)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History for Reference {self.reference.id}"