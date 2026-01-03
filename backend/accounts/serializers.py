from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from profiles.serializers import UserProfileSerializer, UserHealthDataSerializer
from subscriptions.serializers import UserSubscriptionSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Read-only serializer for user profile exposure."""

    profile = UserProfileSerializer(source="userprofile", required=False)
    health_data = UserHealthDataSerializer(required=False)
    subscription = UserSubscriptionSerializer(source="subscription", read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "date_joined",
            "profile",
            "health_data",
        )
        read_only_fields = ("id", "email", "date_joined")

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("userprofile", None)
        health_data = validated_data.pop("health_data", None)

        # Update User fields
        instance = super().update(instance, validated_data)

        # Update profile if exists
        if profile_data:
            profile_serializer = UserProfileSerializer(
                instance.userprofile, data=profile_data, partial=True
            )
            if profile_serializer.is_valid(raise_exception=True):
                profile_serializer.save()

        # Update health_data if exists
        if health_data:
            health_serializer = UserHealthDataSerializer(
                instance.health_data, data=health_data, partial=True
            )
            if health_serializer.is_valid(raise_exception=True):
                health_serializer.save()

        return instance


class UserCreateSerializer(DjoserUserCreateSerializer):
    """
    Create user serializer used by Djoser register endpoint.
    - Normalizes email to lowercase & trims whitespace
    - Uses Django password validators
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=150)

    class Meta:
        model = User
        fields = ("id", "email", "password", "first_name", "last_name")

    def validate_email(self, value):
        """Normalize and validate email."""
        value = value.strip().lower()
        validate_email(value)
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def validate_password(self, value):
        """Validate password using Django's validators."""
        validate_password(value, user=User)
        return value

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        user = User.objects.create_user(
            email=email, password=password, **validated_data
        )
        return user
