from rest_framework import serializers
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

    class Meta:
        model = Recipe
        fields = [
            "id",
            "name",
            "description",
            "is_public",
            "ingredients",
            "created_at",
        ]


class RecipeCreateUpdateSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True)

    class Meta:
        model = Recipe
        fields = ["name", "description", "ingredients"]

    def create(self, validated_data):
        ingredients_data = validated_data.pop("ingredients")
        user = self.context["request"].user
        recipe = Recipe.objects.create(user=user, **validated_data)

        for item in ingredients_data:
            RecipeIngredient.objects.create(recipe=recipe, **item)

        return recipe


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

    class Meta:
        model = Meal
        fields = [
            "id",
            "meal_type",
            "ingredients",
            "recipes",
            "created_at",
        ]


class MealCreateUpdateSerializer(serializers.ModelSerializer):
    ingredients = MealIngredientSerializer(many=True, required=False)
    recipes = serializers.PrimaryKeyRelatedField(
        queryset=Recipe.objects.all(),
        many=True,
        required=False,
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
        ingredients_data = validated_data.pop("ingredients", [])
        recipes = validated_data.pop("recipes", [])

        meal = Meal.objects.create(user=user, **validated_data)
        meal.recipes.set(recipes)

        for item in ingredients_data:
            MealIngredient.objects.create(meal=meal, **item)

        return meal
