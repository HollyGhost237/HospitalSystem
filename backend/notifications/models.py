from django.db import models
from users.models import User


class Notification(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    message = models.TextField()

    type = models.CharField(max_length=50)

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)