from .models import CoachProfile, CoachRequest
from rest_framework import serializers


class CoachRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoachRequest
        fields = [
            "title",
            "bio",
            "experience_years",
            "certifications",
            "specialization",
            "languages",
            "monthly_rate",
        ]

    def validate(self, attrs):
        user = self.context["request"].user

        if hasattr(user, "coach_profile"):
            raise serializers.ValidationError("You are already registered as a coach.")
        if CoachRequest.objects.filter(
            user=user, status=CoachRequest.Status.PENDING
        ).exists():
            raise serializers.ValidationError(
                "You already have a pending coach request."
            )
        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        coach_request = CoachRequest.objects.create(user=user, **validated_data)
        return coach_request


class CoachRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoachRequest
        fields = [
            "title",
            "bio",
            "experience_years",
            "certifications",
            "specialization",
            "languages",
            "monthly_rate",
        ]

    def update(self, instance, validated_data):
        if instance.status != CoachRequest.Status.DECLINED:
            raise serializers.ValidationError("Only declined requests can be updated.")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.status = CoachRequest.Status.PENDING
        instance.decline_reason = None
        instance.reviewed_by = None
        instance.reviewed_at = None
        instance.save()
        return instance


class CoachProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoachProfile
        fields = [
            "user",
            "title",
            "bio",
            "experience_years",
            "certifications",
            "specialization",
            "languages",
            "monthly_rate",
            "created_at",
        ]
        read_only_fields = ["user", "created_at"]