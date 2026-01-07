from rest_framework import generics, permissions
from django.db.models import Q
from rest_framework.filters import SearchFilter
from rest_framework.pagination import CursorPagination

from .models import FoodItem, Recipe, Meal
from .serializers import (
    FoodItemSerializer,
    RecipeSerializer,
    RecipeCreateUpdateSerializer,
    MealSerializer,
    MealCreateUpdateSerializer,
)


# FoodItems Endpoints
class FoodItemCursorPagination(CursorPagination):
    page_size = 30
    ordering = "-id"
    page_size_query_param = "page_size"
    max_page_size = 100


class FoodItemListView(generics.ListAPIView):
    queryset = FoodItem.objects.prefetch_related("serving_size").select_related(
        "nutrition"
    )
    serializer_class = FoodItemSerializer
    pagination_class = FoodItemCursorPagination
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter]
    search_fields = ["name", "nutrition__protein_type"]


class FoodItemDetailView(generics.RetrieveAPIView):
    queryset = FoodItem.objects.prefetch_related("serving_size").select_related(
        "nutrition"
    )
    serializer_class = FoodItemSerializer
    permission_classes = [permissions.AllowAny]


class FoodItemCreateView(generics.CreateAPIView):
    serializer_class = FoodItemSerializer
    permission_classes = [permissions.IsAuthenticated]


# Recipe Endpoints


class RecipeListView(generics.ListAPIView):
    serializer_class = RecipeSerializer
    pagination_class = FoodItemCursorPagination
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        return Recipe.objects.prefetch_related(
            "recipeingredient_set__food_item"
        ).filter(user=self.request.user)


class RecipeDetailView(generics.RetrieveAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "slug"

    def get_queryset(self):
        return Recipe.objects.prefetch_related(
            "recipeingredient_set__food_item"
        ).filter(user=self.request.user)


class RecipeCreateView(generics.CreateAPIView):
    serializer_class = RecipeCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]


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
