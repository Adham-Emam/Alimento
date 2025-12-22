from django.db import models
from django.conf import settings
from django.utils import timezone


class UserProfile(models.Model):

    class Sex(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"

    class MeasurementUnits(models.TextChoices):
        METRIC = "metric", "Metric (m/kg)"
        IMPERIAL = "imperial", "Imperial (ft/lb)"

    class ActivityLevel(models.TextChoices):
        SEDENTRAY = "sedentary", "Sedentary"
        LIGHT = "light", "Light"
        MODERATE = "moderate", "Moderate"
        ACTIVE = "active", "Active"

    class Goal(models.TextChoices):
        MAINTENANCE = "maintenance", "Maintenance"
        CUTTING = "cutting", "Cutting"
        BULKING = "bulking", "Bulking"
        RECOMP = "recomp", "Recomp"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    profile_image = models.ImageField(
        upload_to="profile_images/",  # files will be saved in MEDIA_ROOT/profile_images/
        null=True,
        blank=True,
    )
    display_name = models.CharField(max_length=150, null=True, blank=True)
    preferred_currency = models.CharField(max_length=3, default="EGP")
    birth_date = models.DateField(null=True, blank=True)

    sex = models.CharField(max_length=10, choices=Sex.choices, null=True, blank=True)

    height_cm = models.PositiveIntegerField(null=True, blank=True)
    weight_kg = models.FloatField(null=True, blank=True)

    measurement_units = models.CharField(
        max_length=10,
        choices=MeasurementUnits.choices,
        default=MeasurementUnits.METRIC,
    )

    activity_level = models.CharField(
        max_length=15,
        choices=ActivityLevel.choices,
        default=ActivityLevel.SEDENTRAY,
    )

    goal = models.CharField(
        max_length=15,
        choices=Goal.choices,
        null=True,
        blank=True,
    )

    last_active = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.email} Profile"


class UserHealthData(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="health_data",
        db_index=True,
    )

    dietary_preferences = models.JSONField(default=list, blank=True)
    allergies = models.JSONField(default=list, blank=True)
    medical_conditions = models.JSONField(default=list, blank=True)

    target_macros = models.JSONField(
        default=dict,
        blank=True,
        help_text="Example: { 'calories': 2000, 'protein_g': 150, 'carbs_g': 200, 'fats_g': 70 }",
    )

    def __str__(self):
        return f"{self.user.email} Health Data"
