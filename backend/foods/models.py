from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal
from django.conf import settings
from django.utils.text import slugify


User = get_user_model()


class FoodItem(models.Model):
    class PriceUnit(models.TextChoices):
        G = "g", "Gram"
        ML = "ml", "Milliliter"
        SERVING = "serving", "Serving"
        PIECE = "piece", "Piece"

    off_code = models.CharField(
        max_length=32, unique=True, db_index=True, null=True, blank=True
    )
    name = models.CharField(max_length=255, db_index=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal("0.00"))

    price_quantity = models.FloatField(default=100)
    price_unit = models.CharField(
        max_length=10, choices=PriceUnit.choices, default=PriceUnit.G
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def price_per_gram_protein(self):

        nut = getattr(self, "nutrition", None)
        if not nut or not nut.protein or nut.protein <= 0:
            return None

        price_amount = Decimal(str(self.price or 0))
        if price_amount <= 0:
            return None
        qty = Decimal(str(self.price_quantity or 0))
        if qty <= 0:
            return None

        if self.price_unit == self.PriceUnit.G:
            grams = qty
        elif self.price_unit == self.PriceUnit.ML:
            grams = qty
        else:
            return None
        protein_100g = Decimal(str(nut.protein))
        protein_in_priced_qty = (protein_100g * grams) / Decimal("100")
        if protein_in_priced_qty <= 0:
            return None
        return price_amount / protein_in_priced_qty

    def __str__(self):
        return self.name


class ServingSize(models.Model):
    """
    Serving size information for a food item
    """

    food = models.ForeignKey(
        FoodItem, on_delete=models.CASCADE, related_name="serving_size"
    )
    description = models.CharField(max_length=255)
    quantity = models.FloatField(help_text="Serving quantity")
    unit = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.food.name} ({self.description})"


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

    food_item = models.OneToOneField(
        FoodItem, on_delete=models.CASCADE, related_name="nutrition", primary_key=True
    )

    nutrition_basis = models.CharField(max_length=20, default="per_100g")

    # Macronutrients (grams)
    calories = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    protein_type = models.CharField(
        max_length=50, choices=PROTEIN_TYPE_CHOICES, default="other"
    )
    carbohydrates = models.FloatField(default=0)
    fats = models.FloatField(default=0)

    # Micronutrients
    fiber = models.FloatField(default=0)
    sugar = models.FloatField(default=0)
    sodium = models.FloatField(default=0)
    iron = models.FloatField(default=0)
    calcium = models.FloatField(default=0)
    potassium = models.FloatField(default=0)
    zinc = models.FloatField(default=0)
    magnesium = models.FloatField(default=0)
    vitamin_a = models.FloatField(default=0)
    vitamin_c = models.FloatField(default=0)

    def __str__(self):
        return f"Nutrition Profile for {self.food_item.name}"


class Recipe(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(null=True, blank=True)
    is_public = models.BooleanField(default=False)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")
    ingredients = models.ManyToManyField(
        FoodItem, through="RecipeIngredient", related_name="recipes"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class RecipeInstruction(models.Model):
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="instructions"
    )
    step_number = models.PositiveIntegerField()
    text = models.TextField()

    class Meta:
        ordering = ["step_number"]
        unique_together = ("recipe", "step_number")

    def __str__(self):
        return f"{self.recipe.name} - Step {self.step_number}"

    def save(self, *args, **kwargs):
        if not self.step_number:
            self.step_number = (
                RecipeInstruction.objects.filter(recipe=self.recipe).count() + 1
            )
        super().save(*args, **kwargs)


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.FloatField()
    unit = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.food_item.name} in {self.recipe.name}"


class Meal(models.Model):

    MEAL_TYPE_CHOICES = (
        ("breakfast", "Breakfast"),
        ("lunch", "Lunch"),
        ("dinner", "Dinner"),
        ("snack", "Snack"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="meals")
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)

    ingredients = models.ManyToManyField(FoodItem, through="MealIngredient", blank=True)
    recipes = models.ManyToManyField(Recipe, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.meal_type.title()} meal for {self.user}"


class MealIngredient(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.FloatField()
    unit = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.food_item.name}"
