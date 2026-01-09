from django.urls import path
from .views import (
    FoodItemListView,
    FoodItemDetailView,
    FoodItemCreateView,
    RecipeListView,
    RecipeDetailView,
    RecipeCreateView,
    RecipeUpdateView,
    RecipeSelectableView,
    MealListView,
    MealDetailView,
    MealCreateView,
    MealUpdateView,
)

urlpatterns = [
    # Food items
    path("", FoodItemListView.as_view(), name="food-list"),
    path("<int:pk>/", FoodItemDetailView.as_view(), name="food-detail"),
    path("create/", FoodItemCreateView.as_view(), name="food-create"),
    # Recipes
    path("recipes/", RecipeListView.as_view(), name="recipe-list"),
    path("recipes/create/", RecipeCreateView.as_view(), name="recipe-create"),
    path(
        "recipes/selectable/",
        RecipeSelectableView.as_view(),
        name="recipe-selectable",
    ),
    path("recipes/<str:slug>/", RecipeDetailView.as_view(), name="recipe-detail"),
    path("recipes/<str:slug>/edit/", RecipeUpdateView.as_view(), name="recipe-update"),
    # Meals
    path("meals/", MealListView.as_view(), name="meal-list"),
    path("meals/create/", MealCreateView.as_view(), name="meal-create"),
    path("meals/<str:slug>/", MealDetailView.as_view(), name="meal-detail"),
    path("meals/<str:slug>/edit/", MealUpdateView.as_view(), name="meal-update"),
]
