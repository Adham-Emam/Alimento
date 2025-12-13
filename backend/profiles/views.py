from rest_framework import viewsets, permissions
from .models import UserProfile, UserHealthData
from .serializers import UserProfileSerializer, UserHealthDataSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserHealthDataViewSet(viewsets.ModelViewSet):
    serializer_class = UserHealthDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserHealthData.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    