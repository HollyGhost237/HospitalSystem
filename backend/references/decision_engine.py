from geopy.distance import distance
from hospitals.models import Hospital
from services.models import Service
from ml.models import MLTrainingData


class SimpleDecisionEngine:
    """
    Moteur de decision simple base sur des regles metier.
    """

    def __init__(self):
        self.poids = {
            'distance': 0.6,
            'expertise': 0.4
        }

    def proposer_hopitaux(self, patient_coords, service_id, patient=None, limit=5):
        """
        Retourne les meilleurs hopitaux pour un service donne
        """
        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return []

        hopitaux_avec_service = service.hospitals.all()

        resultats = []
        for hopital in hopitaux_avec_service:
            score, details = self._calculer_score(hopital, patient_coords)

            ml_data = MLTrainingData.objects.create(
                patient=patient,
                hospital=hopital,
                features={
                    'distance_km': details['distance_km'],
                    'hospital_type': hopital.type,
                    'service_id': service_id,
                    'patient_age': self._get_patient_age(patient),
                    'patient_gender': getattr(patient, 'gender', None)
                },
                score_calcule=score
            )

            resultats.append({
                'hopital': hopital,
                'score': score,
                'distance_km': details['distance_km'],
                'ml_data_id': ml_data.id
            })

        resultats.sort(key=lambda x: x['score'], reverse=True)
        return resultats[:limit]

    def _calculer_score(self, hopital, coords_patient):
        details = {}
        score_total = 0

        if hopital.latitude and hopital.longitude:
            coords_hopital = (hopital.latitude, hopital.longitude)
            dist_km = distance(coords_patient, coords_hopital).km
            details['distance_km'] = round(dist_km, 2)

            if dist_km < 5:
                score_distance = 1.0
            elif dist_km < 10:
                score_distance = 0.85
            elif dist_km < 20:
                score_distance = 0.7
            elif dist_km < 50:
                score_distance = 0.5
            else:
                score_distance = 0.3
        else:
            score_distance = 0.5
            details['distance_km'] = None

        score_total += self.poids['distance'] * score_distance

        # Expertise approximatee par le nombre de services proposes par l'hopital
        service_count = hopital.services_list.count()
        expertise = min(service_count / 10, 1.0) if service_count else 0.5
        score_total += self.poids['expertise'] * expertise

        return round(score_total * 100, 2), details

    def _get_patient_age(self, patient):
        if not patient or not getattr(patient, 'date_of_birth', None):
            return None
        from datetime import date
        today = date.today()
        dob = patient.date_of_birth
        return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

    def enregistrer_choix_final(self, ml_data_id, choisi):
        try:
            donnee = MLTrainingData.objects.get(id=ml_data_id)
            donnee.choix_final = choisi
            donnee.save()
            return True
        except MLTrainingData.DoesNotExist:
            return False
