from django.urls import path
from .views import GenerateDailyPlanAPIView

urlpatterns = [
    path("generate/daily-plan/", GenerateDailyPlanAPIView.as_view()),
]
