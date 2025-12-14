from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class FoodItem(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ServingSize(models.Model):
    """
    Serving size information for a food item
    """

    food = models.OneToOneField(
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
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")
    ingredients = models.ManyToManyField(
        FoodItem, through="RecipeIngredient", related_name="recipes"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


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
