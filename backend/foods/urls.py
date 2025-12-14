from django.urls import path
from .views import (
    FoodItemListView,
    FoodItemDetailView,
    RecipeListView,
    RecipeDetailView,
    RecipeCreateView,
    RecipeUpdateView,
    MealListView,
    MealDetailView,
    MealCreateView,
    MealUpdateView,
)

urlpatterns = [
    # Food items
    path("", FoodItemListView.as_view(), name="food-list"),
    path("<int:pk>/", FoodItemDetailView.as_view(), name="food-detail"),
    # Recipes
    path("recipes/", RecipeListView.as_view(), name="recipe-list"),
    path("recipes/<int:pk>/", RecipeDetailView.as_view(), name="recipe-detail"),
    path("recipes/create/", RecipeCreateView.as_view(), name="recipe-create"),
    path("recipes/<int:pk>/edit/", RecipeUpdateView.as_view(), name="recipe-update"),
    # Meals
    path("meals/", MealListView.as_view(), name="meal-list"),
    path("meals/<int:pk>/", MealDetailView.as_view(), name="meal-detail"),
    path("meals/create/", MealCreateView.as_view(), name="meal-create"),
    path("meals/<int:pk>/edit/", MealUpdateView.as_view(), name="meal-update"),
]
