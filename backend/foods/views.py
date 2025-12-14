from rest_framework import generics, permissions
from .models import FoodItem, Recipe, Meal
from .serializers import (
    FoodItemSerializer,
    RecipeSerializer,
    RecipeCreateUpdateSerializer,
    MealSerializer,
    MealCreateUpdateSerializer,
)


# FoodItems Endpoints


class FoodItemListView(generics.ListAPIView):
    queryset = FoodItem.objects.select_related("serving_size", "nutrition")
    serializer_class = FoodItemSerializer
    permission_classes = [permissions.AllowAny]


class FoodItemDetailView(generics.RetrieveAPIView):
    queryset = FoodItem.objects.select_related("serving_size", "nutrition")
    serializer_class = FoodItemSerializer
    permission_classes = [permissions.AllowAny]


# Recipe Endpoints


class RecipeListView(generics.ListAPIView):
    queryset = Recipe.objects.prefetch_related("recipeingredient_set__food_item")
    serializer_class = RecipeSerializer
    permission_classes = [permissions.AllowAny]


class RecipeDetailView(generics.RetrieveAPIView):
    queryset = Recipe.objects.prefetch_related("recipeingredient_set__food_item")
    serializer_class = RecipeSerializer
    permission_classes = [permissions.AllowAny]


class RecipeCreateView(generics.CreateAPIView):
    serializer_class = RecipeCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecipeUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RecipeCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)


# Meal Endpoints
class MealListView(generics.ListAPIView):
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Meal.objects.filter(user=self.request.user).prefetch_related(
            "recipes",
            "mealingredient_set__food_item",
        )


class MealDetailView(generics.RetrieveAPIView):
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Meal.objects.filter(user=self.request.user).prefetch_related(
            "recipes",
            "mealingredient_set__food_item",
        )


class MealCreateView(generics.CreateAPIView):
    serializer_class = MealCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]


class MealUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MealCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Meal.objects.filter(user=self.request.user)
