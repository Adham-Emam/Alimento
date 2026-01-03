from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, UserHealthDataViewSet,UserMealLogCreateView,UserMealLogDetailView,UserMealLogListView

router = DefaultRouter()
router.register("profile", UserProfileViewSet, basename="profile")
router.register("health-data", UserHealthDataViewSet, basename="health-data")
router.register

urlpatterns = [
    path("", include(router.urls)),

    path("logs/", UserMealLogListView.as_view(), name="meal-log-list"),
    path("logs/create/", UserMealLogCreateView.as_view(), name="meal-log-create"),
    path("logs/<int:pk>/", UserMealLogDetailView.as_view(), name="meal-log-detail"),
]
