from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model

from subscriptions.models import UserSubscription
from profiles.models import UserProfile, UserHealthData
from foods.models import FoodItem, NutritionProfile
from ai_services.services import DailyProAIService, ProfileValidationError, AIServiceError

User = get_user_model()


class DailyProMealTests(TestCase):

    def setUp(self):
        # ---- User ----
        self.user = User.objects.create_user(
            email="test@mail.com",
            password="password123"
        )

        # ---- Subscription ----
        UserSubscription.objects.create(
            user=self.user,
            is_pro=True,
            current_period_end=timezone.now() + timezone.timedelta(days=30)
        )

        # ---- Profile ----
        UserProfile.objects.create(
            user=self.user,
            sex="male",
            height_cm=175,
            weight_kg=80,
            goal="maintain",
            activity_level="moderate",
            preferred_currency="EGP",
        )

        # ---- Health ----
        UserHealthData.objects.create(
            user=self.user,
            target_macros={
                "calories": 2000,
                "protein_g": 150,
                "carbs_g": 200,
                "fats_g": 65,
            },
            allergies=[],
            dietary_preferences=[],
            medical_conditions=[],
        )

        # ---- Food ----
        food = FoodItem.objects.create(
            name="Chicken Breast",
            price=50
        )
        NutritionProfile.objects.create(
            food_item=food,
            calories=165,
            protein=31,
            carbohydrates=0,
            fats=3.6,
            protein_type="meat"
        )

    def test_generate_plan_success(self):
        result, meals = DailyProAIService.generate_today_plan(self.user)

        self.assertIn("date", result)
        self.assertIn("meals", result)
        self.assertEqual(len(meals), 4)

    def test_prevent_duplicate_plan_same_day(self):
        DailyProAIService.generate_today_plan(self.user)

        with self.assertRaises(AIServiceError):
            DailyProAIService.generate_today_plan(self.user)

    def test_missing_profile_data(self):
        self.user.userprofile.height_cm = None
        self.user.userprofile.save()

        with self.assertRaises(ProfileValidationError):
            DailyProAIService.generate_today_plan(self.user)
