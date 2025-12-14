from django.db import models
from django.conf import settings

# Create your models here.


class Food(models.Model):
    SOURCE_CHOICES = [
        ("user", "User"),
        ("admin", "Admin"),
        ("usda", "USDA"),
        ("openfoodfacts", "Open Food Facts"),
    ]
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255, blank=True, null=True)
    barcode = models.CharField(max_length=255, unique=True, null=True, blank=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, default="user")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="foods",
    )
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class NutritionProfile(models.Model):
    """
    Nutrition profile associated with a food item
    """

    PROTEIN_TYPE_CHOICES = [
        ("vegan", "Vegan"),
        ("dairy", "Dairy"),
        ("meat", "Meat"),
        ("other", "Other"),
    ]
    food = models.OneToOneField(
        Food, on_delete=models.CASCADE, related_name="nutrition"
    )

    # Macronutrients
    calories = models.FloatField()
    protein = models.FloatField()
    protein_type = models.CharField(
        max_length=50, choices=PROTEIN_TYPE_CHOICES, default="other"
    )
    carbohydrates = models.FloatField()
    fats = models.FloatField()
    # Micronutrients
    fiber = models.FloatField(null=True, blank=True)
    sugar = models.FloatField(null=True, blank=True)
    sodium = models.FloatField(null=True, blank=True)
    iron = models.FloatField(null=True, blank=True)
    calcium = models.FloatField(null=True, blank=True)
    potassium = models.FloatField(null=True, blank=True)
    vitamins = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Nutrition Profile for {self.food.name}"


class ServingSize(models.Model):
    """
    Serving size information for a food item
    """

    food = models.ForeignKey(
        Food, on_delete=models.CASCADE, related_name="serving_sizes"
    )
    description = models.CharField(max_length=255)
    quantity = models.FloatField()
    unit = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.food.name} ({self.description})"


class FoodPrice(models.Model):
    """
    Price information for a food item
    """

    food = models.ForeignKey(Food, on_delete=models.CASCADE, related_name="prices")
    price = models.FloatField()
    currency = models.CharField(max_length=10, default="EGP")
    store = models.CharField(max_length=255, blank=True, null=True)
    date_recorded = models.DateTimeField(auto_now_add=True)
    quantity = models.FloatField(null=True, blank=True)
    unit = models.CharField(max_length=50, blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="food_prices",
    )

    def price_per_unit(self):
        if self.quantity and self.quantity > 0:
            return self.price / self.quantity
        return None

    def __str__(self):
        return f"{self.food.name} - {self.price} {self.currency}"
