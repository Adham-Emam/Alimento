from django.contrib import admin
from .models import UserProfile, UserHealthData, MealLog


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "display_name",
        "preferred_currency",
        "sex",
        "activity_level",
        "goal",
        "last_active",
    )
    search_fields = ("user__email", "display_name")
    list_filter = ("sex", "activity_level", "goal", "preferred_currency")
    ordering = ("id",)
    readonly_fields = ("last_active",)


@admin.register(UserHealthData)
class UserHealthDataAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "dietary_preferences",
        "allergies",
        "medical_conditions",
    )
    search_fields = ("user__email",)
    ordering = ("id",)


@admin.register(MealLog)
class MealLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "meal",
        "consumed_at",
    )
    search_fields = ("user__email",)
    ordering = ("id",)
