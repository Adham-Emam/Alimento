from django.db import models

# Create your models here.


class Product(models.Model):
    class ProductType(models.TextChoices):
        SUPPLEMENT = "SUPPLEMENT", "Supplement"
        HERB = "HERB", "Herb"
        SNACK = "SNACK", "Snack"

    title = models.CharField(max_length=100)
    description = models.TextField()
    product_type = models.CharField(max_length=20, choices=ProductType.choices)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    affiliate_link = models.URLField(blank=True, null=True)
    advisory_text = models.TextField(blank=True, null=True)
    contraindications = models.TextField(blank=True, null=True)

    # Nutritional info
    calories = models.IntegerField(null=True, blank=True)
    protein = models.FloatField(null=True, blank=True)
    fat = models.FloatField(null=True, blank=True)
    carbohydrates = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
