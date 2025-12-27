from rest_framework import serializers
from django.db import transaction
from django.db.models import Q
from .models import (
    FoodItem,
    ServingSize,
    NutritionProfile,
    Recipe,
    RecipeIngredient,
    Meal,
    MealIngredient,
)


class ServingSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServingSize
        fields = ["description", "quantity", "unit"]


class NutritionProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = NutritionProfile
        exclude = ("food_item",)


class FoodItemSerializer(serializers.ModelSerializer):
    serving_size = ServingSizeSerializer(many=True, read_only=True)
    nutrition = NutritionProfileSerializer(read_only=True)

    class Meta:
        model = FoodItem
        fields = ["id", "name", "price", "serving_size", "nutrition", "created_at"]


class RecipeIngredientSerializer(serializers.ModelSerializer):
    food_item = FoodItemSerializer(read_only=True)
    food_item_id = serializers.PrimaryKeyRelatedField(
        queryset=FoodItem.objects.all(), source="food_item", write_only=True
    )

    class Meta:
        model = RecipeIngredient
        fields = [
            "id",
            "food_item",
            "food_item_id",
            "quantity",
            "unit",
        ]


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(
        source="recipeingredient_set",
        many=True,
        read_only=True,
    )

    calories = serializers.SerializerMethodField()
    protein_g = serializers.SerializerMethodField()
    carbs_g = serializers.SerializerMethodField()
    fats_g = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = [
            "id",
            "name",
            "description",
            "is_public",
            "ingredients",
            "calories",
            "protein_g",
            "carbs_g",
            "fats_g",
            "created_at",
        ]

    def _calculate_recipe_nutrition(self, obj):
        """Calculate total nutrition for all ingredients in the recipe."""
        totals = {
            "calories": 0,
            "protein_g": 0,
            "carbs_g": 0,
            "fats_g": 0,
        }

        for recipe_ingredient in obj.recipeingredient_set.select_related(
            "food_item__nutrition"
        ).all():
            nutrition = getattr(recipe_ingredient.food_item, "nutrition", None)
            if nutrition:
                # Get the base serving size for the food item
                serving = recipe_ingredient.food_item.serving_size.first()
                if serving and serving.quantity > 0:
                    # Calculate ratio based on quantity used vs serving size
                    ratio = recipe_ingredient.quantity / serving.quantity
                else:
                    # Default to 1:1 ratio if no serving size defined
                    ratio = recipe_ingredient.quantity

                totals["calories"] += nutrition.calories * ratio
                totals["protein_g"] += nutrition.protein * ratio
                totals["carbs_g"] += nutrition.carbohydrates * ratio
                totals["fats_g"] += nutrition.fats * ratio

        return totals

    def get_calories(self, obj):
        return round(self._calculate_recipe_nutrition(obj)["calories"], 1)

    def get_protein_g(self, obj):
        return round(self._calculate_recipe_nutrition(obj)["protein_g"], 1)

    def get_carbs_g(self, obj):
        return round(self._calculate_recipe_nutrition(obj)["carbs_g"], 1)

    def get_fats_g(self, obj):
        return round(self._calculate_recipe_nutrition(obj)["fats_g"], 1)


class RecipeCreateUpdateSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(
        source="recipeingredient_set", many=True, required=False
    )

    class Meta:
        model = Recipe
        fields = ["name", "description", "is_public", "ingredients"]

    def create(self, validated_data):
        ingredients_data = validated_data.pop("recipeingredient_set", [])
        user = self.context["request"].user

        recipe = Recipe.objects.create(user=user, **validated_data)

        for item in ingredients_data:
            RecipeIngredient.objects.create(recipe=recipe, **item)

        return recipe

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop("recipeingredient_set", None)

        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if ingredients_data is not None:
                RecipeIngredient.objects.filter(recipe=instance).delete()
                for item in ingredients_data:
                    RecipeIngredient.objects.create(recipe=instance, **item)

        return instance


class MealIngredientSerializer(serializers.ModelSerializer):
    food_item = FoodItemSerializer(read_only=True)
    food_item_id = serializers.PrimaryKeyRelatedField(
        queryset=FoodItem.objects.all(),
        source="food_item",
        write_only=True,
    )

    class Meta:
        model = MealIngredient
        fields = ["id", "food_item", "food_item_id", "quantity", "unit"]


class MealSerializer(serializers.ModelSerializer):
    ingredients = MealIngredientSerializer(
        source="mealingredient_set",
        many=True,
        read_only=True,
    )
    recipes = RecipeSerializer(many=True, read_only=True)

    calories = serializers.SerializerMethodField()
    protein_g = serializers.SerializerMethodField()
    carbs_g = serializers.SerializerMethodField()
    fats_g = serializers.SerializerMethodField()

    class Meta:
        model = Meal
        fields = [
            "id",
            "meal_type",
            "ingredients",
            "recipes",
            "calories",
            "protein_g",
            "carbs_g",
            "fats_g",
            "created_at",
        ]

    def _calculate_nutrition_totals(self, obj):
        """
        Calculate total nutrition from both direct ingredients and recipes.
        Returns dict with calories, protein_g, carbs_g, fats_g.
        """
        cache_key = f"_nutrition_cache_{obj.id}"

        if not hasattr(self, cache_key):
            totals = {
                "calories": 0,
                "protein_g": 0,
                "carbs_g": 0,
                "fats_g": 0,
            }

            # Calculate from direct meal ingredients
            for meal_ingredient in obj.mealingredient_set.select_related(
                "food_item__nutrition"
            ).all():
                nutrition = getattr(meal_ingredient.food_item, "nutrition", None)
                if nutrition:
                    serving = meal_ingredient.food_item.serving_size.first()
                    ratio = (
                        meal_ingredient.quantity / serving.quantity
                        if serving and serving.quantity > 0
                        else meal_ingredient.quantity
                    )

                    totals["calories"] += nutrition.calories * ratio
                    totals["protein_g"] += nutrition.protein * ratio
                    totals["carbs_g"] += nutrition.carbohydrates * ratio
                    totals["fats_g"] += nutrition.fats * ratio

            # Calculate from recipes
            for recipe in obj.recipes.prefetch_related(
                "recipeingredient_set__food_item__nutrition",
                "recipeingredient_set__food_item__serving_size",
            ).all():
                for recipe_ingredient in recipe.recipeingredient_set.all():
                    nutrition = getattr(recipe_ingredient.food_item, "nutrition", None)
                    if nutrition:
                        serving = recipe_ingredient.food_item.serving_size.first()
                        ratio = (
                            recipe_ingredient.quantity / serving.quantity
                            if serving and serving.quantity > 0
                            else recipe_ingredient.quantity
                        )

                        totals["calories"] += nutrition.calories * ratio
                        totals["protein_g"] += nutrition.protein * ratio
                        totals["carbs_g"] += nutrition.carbohydrates * ratio
                        totals["fats_g"] += nutrition.fats * ratio

            setattr(self, cache_key, totals)

        return getattr(self, cache_key)

    def get_calories(self, obj):
        return round(self._get_cached_nutrition(obj)["calories"], 1)

    def get_protein_g(self, obj):
        return round(self._get_cached_nutrition(obj)["protein_g"], 1)

    def get_carbs_g(self, obj):
        return round(self._get_cached_nutrition(obj)["carbs_g"], 1)

    def get_fats_g(self, obj):
        return round(self._get_cached_nutrition(obj)["fats_g"], 1)


class MealCreateUpdateSerializer(serializers.ModelSerializer):
    ingredients = MealIngredientSerializer(
        source="mealingredient_set", many=True, required=False
    )
    recipes = serializers.PrimaryKeyRelatedField(
        queryset=Recipe.objects.filter(is_public=True),
        many=True,
        required=False,
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            self.fields["recipes"].queryset = Recipe.objects.filter(
                Q(is_public=True) | Q(user=request.user)
            )

    class Meta:
        model = Meal
        fields = [
            "meal_type",
            "ingredients",
            "recipes",
        ]

    def create(self, validated_data):
        user = self.context["request"].user
        ingredients_data = validated_data.pop("mealingredient_set", [])
        recipes = validated_data.pop("recipes", [])

        meal = Meal.objects.create(user=user, **validated_data)
        meal.recipes.set(recipes)

        for item in ingredients_data:
            MealIngredient.objects.create(meal=meal, **item)

        return meal

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop("mealingredient_set", None)
        recipes = validated_data.pop("recipes", None)

        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if recipes is not None:
                instance.recipes.set(recipes)

            if ingredients_data is not None:
                MealIngredient.objects.filter(meal=instance).delete()
                for item in ingredients_data:
                    MealIngredient.objects.create(meal=instance, **item)

        return instance
