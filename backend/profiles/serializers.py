from rest_framework import serializers
from .models import UserProfile, UserHealthData, MealLog
from foods.serializers import MealSerializer
from foods.models import Meal


class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = "__all__"
        read_only_fields = ("user", "last_active")


class UserHealthDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHealthData
        fields = "__all__"
        read_only_fields = ("user",)


class MealLogSerializer(serializers.ModelSerializer):
    meal_id = serializers.PrimaryKeyRelatedField(
        queryset=Meal.objects.all(),
        source="meal",
        write_only=True,
    )
    meal = MealSerializer(read_only=True)

    class Meta:
        model = MealLog
        fields = ("id", "meal", "consumed_at", "meal_id")
        read_only_fields = ("user",)
