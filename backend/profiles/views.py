from rest_framework import viewsets, permissions, generics
from .models import MealLog, UserProfile, UserHealthData
from .serializers import (
    MealLogSerializer,
    UserProfileSerializer,
    UserHealthDataSerializer,
)
from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework.exceptions import ValidationError


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


class UserMealLogCreateView(generics.CreateAPIView):
    serializer_class = MealLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserMealLogListView(generics.ListAPIView):
    serializer_class = MealLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = (
            MealLog.objects.filter(user=self.request.user)
            .select_related("meal__user")
            .prefetch_related(
                "meal__mealingredient_set__food_item__nutrition",
                "meal__recipes__recipeingredient_set__food_item__nutrition",
            )
            .order_by("-consumed_at")
        )
        interval = self.request.query_params.get("interval", None)
        date_str = self.request.query_params.get("date", None)
        if not interval:
            return queryset

        if interval:

            if date_str:
                try:
                    reference_date = datetime.fromisoformat(date_str).date()
                except ValueError:
                    raise ValidationError(
                        {"date": "Invalid date format. Use YYYY-MM-DD"}
                    )
            else:
                reference_date = timezone.now().date()

            if interval == "day":
                start = datetime.combine(reference_date, datetime.min.time())
                end = datetime.combine(reference_date, datetime.max.time())
            elif interval == "week":
                days_since_sat = (reference_date.weekday() + 2) % 7
                start_date = reference_date - timedelta(days=days_since_sat)
                start = datetime.combine(start_date, datetime.min.time())
                end = start + timedelta(days=7)
            elif interval == "month":
                start = datetime.combine(
                    reference_date.replace(day=1), datetime.min.time()
                )
                if reference_date.month == 12:
                    next_month = reference_date.replace(
                        year=reference_date.year + 1, month=1, day=1
                    )
                else:
                    next_month = reference_date.replace(
                        month=reference_date.month + 1, day=1
                    )
                end = datetime.combine(next_month, datetime.min.time())
            else:
                raise ValidationError(
                    {"interval": "Invalid interval. Use 'day', 'week', or 'month'"}
                )
        queryset = queryset.filter(consumed_at__gte=start, consumed_at__lt=end)
        return queryset


class UserMealLogDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = MealLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            MealLog.objects.filter(user=self.request.user)
            .select_related("meal__user")
            .prefetch_related(
                "meal__mealingredient_set__food_item__nutrition",
                "meal__recipes__recipeingredient_set__food_item__nutrition",
            )
        )
