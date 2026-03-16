from django.db import models
from hospitals.models import Hospital

class Service(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    
    # C'est ICI que l'on définit la relation unique
    # related_name='services_list' permet d'accéder aux services depuis un hôpital
    hospitals = models.ManyToManyField(
        'hospitals.Hospital', 
        through='HospitalService', 
        related_name='services_list' 
    )

    def __str__(self):
        return self.name

class HospitalService(models.Model):
    hospital = models.ForeignKey('hospitals.Hospital', on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)

    class Meta:
        db_table = 'hospital_services'
        managed = True
        unique_together = ('hospital', 'service')