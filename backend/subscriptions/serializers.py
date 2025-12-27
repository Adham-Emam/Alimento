from rest_framework import serializers
from .models import UserSubscription


class UserSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSubscription
        fields = ["is_pro", "current_period_end"]
