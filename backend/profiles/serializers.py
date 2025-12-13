from rest_framework import serializers
from .models import UserProfile, UserHealthData

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('user', 'last_active')

class UserHealthDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHealthData
        fields = '__all__'
        read_only_fields = ('user',)