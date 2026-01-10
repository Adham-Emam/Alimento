from django.db.models import Q
from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

# Create your models here.


class CoachProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="coach_profile"
    )

    title = models.CharField(max_length=100)
    bio = models.TextField()
    experience_years = models.PositiveIntegerField()
    certifications = models.JSONField(blank=True, default=list)

    specialization = models.JSONField(default=list, blank=True)

    languages = models.JSONField(default=list, blank=True)

    monthly_rate = models.DecimalField(max_digits=8, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)


class CoachRequest(models.Model):

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        DECLINED = "declined", "Declined"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="coach_requests",
    )

    title = models.CharField(max_length=100)
    bio = models.TextField()
    experience_years = models.PositiveIntegerField()
    certifications = models.JSONField(default=list)
    specialization = models.JSONField(default=list, blank=True)
    languages = models.JSONField(default=list, blank=True)
    monthly_rate = models.DecimalField(max_digits=8, decimal_places=2)

    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.PENDING
    )

    decline_reason = models.TextField(blank=True, null=True)

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="reviewed_coach_requests",
    )

    reviewed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user"],
                condition=models.Q(status="pending"),
                name="unique_pending_coach_request_per_user",
            )
        ]
