from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, UserHealthDataViewSet

router = DefaultRouter()
router.register('profile', UserProfileViewSet, basename='profile')
router.register('health-data', UserHealthDataViewSet, basename='health-data')

urlpatterns = router.urls