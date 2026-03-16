from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__' # Inclut tous les champs du modèle
        # Ou listez les champs explicitement : fields = ['id', 'nomPatient', 'prenomPatient', ...]