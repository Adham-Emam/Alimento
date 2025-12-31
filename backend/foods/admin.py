from django.contrib import admin
from .models import (
    FoodItem,
    ServingSize,
    NutritionProfile,
    Recipe,
    RecipeIngredient,
    Meal,
    MealIngredient,
)


# Inline for ServingSize
class ServingSizeInline(admin.StackedInline):
    model = ServingSize
    extra = 0
    max_num = 1


# Inline for NutritionProfile
class NutritionProfileInline(admin.StackedInline):
    model = NutritionProfile
    extra = 0
    max_num = 1


@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "price",
        "created_at",
        "price_per_gram_protein",
        "price_quantity",
        "price_unit",
    )
    search_fields = ("name",)
    inlines = [ServingSizeInline, NutritionProfileInline]
    readonly_fields = ("price_per_gram_protein",)

    @admin.display(description="Price per Gram Protein")
    def price_per_gram_protein(self, obj):
        val = obj.price_per_gram_protein()
        return round(float(val), 4) if val is not None else None


# Inline for RecipeIngredient
class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name",)
    inlines = [RecipeIngredientInline]


# Inline for MealIngredient
class MealIngredientInline(admin.TabularInline):
    model = MealIngredient
    extra = 1


@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ("meal_type", "user", "created_at")
    list_filter = ("meal_type",)
    search_fields = ("user__username",)
    inlines = [MealIngredientInline]
    filter_horizontal = ("recipes",)
