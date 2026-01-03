from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

class UserSubscription(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="subscription",
    )
    is_pro = models.BooleanField(default=False)
    current_period_end = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} | Pro={self.is_pro}"
