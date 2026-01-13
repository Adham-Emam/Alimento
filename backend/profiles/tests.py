from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import UserProfile, UserHealthData, MealLog
from foods.models import Meal, Recipe, FoodItem
from datetime import date
from decimal import Decimal

User = get_user_model()


class UserProfileModelTests(TestCase):
    """Test cases for UserProfile model"""

    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    def test_create_user_profile(self):
        """Test creating a user profile"""
        profile = UserProfile.objects.create(
            user=self.user,
            display_name='Test User',
            sex='male',
            height_cm=175,
            weight_kg=75.0,
            birth_date=date(1990, 1, 1),
            preferred_currency='USD',
            activity_level='moderate',
            goal='maintenance'
        )
        self.assertEqual(profile.display_name, 'Test User')
        self.assertEqual(profile.height_cm, 175)
        self.assertEqual(profile.weight_kg, 75.0)
        self.assertEqual(profile.sex, 'male')

    def test_profile_one_per_user(self):
        """Test only one profile per user"""
        UserProfile.objects.create(user=self.user, display_name='First')
        with self.assertRaises(Exception):
            UserProfile.objects.create(user=self.user, display_name='Second')

    def test_profile_default_values(self):
        """Test default values for profile"""
        profile = UserProfile.objects.create(user=self.user)
        self.assertEqual(profile.preferred_currency, 'EGP')
        self.assertEqual(profile.measurement_units, 'metric')
        self.assertEqual(profile.activity_level, 'sedentary')

    def test_profile_str(self):
        """Test profile string representation"""
        profile = UserProfile.objects.create(user=self.user)
        self.assertEqual(str(profile), f'{self.user.email} Profile')


class UserHealthDataModelTests(TestCase):
    """Test cases for UserHealthData model"""

    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    def test_create_health_data(self):
        """Test creating user health data"""
        health_data = UserHealthData.objects.create(
            user=self.user,
            dietary_preferences=['vegan', 'gluten-free'],
            allergies=['peanuts', 'shellfish'],
            medical_conditions=['diabetes'],
            target_macros={'calories': 2000, 'protein_g': 150}
        )
        self.assertEqual(len(health_data.dietary_preferences), 2)
        self.assertEqual(len(health_data.allergies), 2)
        self.assertEqual(health_data.target_macros['calories'], 2000)

    def test_health_data_one_per_user(self):
        """Test only one health data per user"""
        UserHealthData.objects.create(user=self.user)
        with self.assertRaises(Exception):
            UserHealthData.objects.create(user=self.user)

    def test_health_data_default_json_fields(self):
        """Test default empty lists for JSON fields"""
        health_data = UserHealthData.objects.create(user=self.user)
        self.assertEqual(health_data.dietary_preferences, [])
        self.assertEqual(health_data.allergies, [])
        self.assertEqual(health_data.medical_conditions, [])


class MealLogModelTests(TestCase):
    """Test cases for MealLog model"""

    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.food_item = FoodItem.objects.create(
            name='Test Food',
            user=self.user
        )
        self.recipe = Recipe.objects.create(
            user=self.user,
            name='Test Recipe',
            servings=1
        )
        self.meal = Meal.objects.create(
            user=self.user,
            name='Breakfast'
        )

    def test_create_meal_log(self):
        """Test creating a meal log entry"""
        log = MealLog.objects.create(
            user=self.user,
            meal=self.meal,
            consumed_at=date.today()
        )
        self.assertEqual(log.user, self.user)
        self.assertEqual(log.meal, self.meal)

    def test_multiple_logs_per_user(self):
        """Test user can have multiple meal logs"""
        log1 = MealLog.objects.create(
            user=self.user,
            meal=self.meal,
            consumed_at=date.today()
        )
        log2 = MealLog.objects.create(
            user=self.user,
            meal=self.meal,
            consumed_at=date.today()
        )
        self.assertEqual(MealLog.objects.filter(user=self.user).count(), 2)


class UserProfileAPITests(APITestCase):
    """Test cases for UserProfile API endpoints"""

    def setUp(self):
        self.client_api = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.profile = UserProfile.objects.create(
            user=self.user,
            display_name='Test User'
        )

    def test_list_own_profile_authenticated(self):
        """Test authenticated user can list their profile"""
        self.client_api.force_authenticate(user=self.user)
        response = self.client_api.get('/api/profiles/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_profile_authenticated(self):
        """Test authenticated user can update their profile"""
        self.client_api.force_authenticate(user=self.user)
        response = self.client_api.patch(
            f'/api/profiles/profile/{self.profile.id}/',
            {'display_name': 'Updated Name'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.display_name, 'Updated Name')

    def test_profile_unauthenticated(self):
        """Test unauthenticated access to profile is denied"""
        response = self.client_api.get('/api/profiles/profile/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserHealthDataAPITests(APITestCase):
    """Test cases for UserHealthData API endpoints"""

    def setUp(self):
        self.client_api = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    def test_create_health_data(self):
        """Test creating health data"""
        self.client_api.force_authenticate(user=self.user)
        data = {
            'dietary_preferences': ['vegan'],
            'allergies': ['peanuts'],
            'medical_conditions': [],
            'target_macros': {'calories': 2000}
        }
        response = self.client_api.post('/api/profiles/health-data/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_health_data_authenticated(self):
        """Test authenticated user can list their health data"""
        self.client_api.force_authenticate(user=self.user)
        UserHealthData.objects.create(user=self.user)
        response = self.client_api.get('/api/profiles/health-data/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class MealLogAPITests(APITestCase):
    """Test cases for MealLog API endpoints"""

    def setUp(self):
        self.client_api = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        from foods.models import Meal
        self.meal = Meal.objects.create(user=self.user, name='Test Meal')

    def test_create_meal_log(self):
        """Test creating a meal log"""
        self.client_api.force_authenticate(user=self.user)
        data = {
            'meal': self.meal.id,
            'consumed_at': date.today().isoformat()
        }
        response = self.client_api.post('/api/profiles/logs/create/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_meal_logs(self):
        """Test listing meal logs"""
        self.client_api.force_authenticate(user=self.user)
        MealLog.objects.create(user=self.user, meal=self.meal, consumed_at=date.today())
        response = self.client_api.get('/api/profiles/logs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_meal_logs_by_day(self):
        """Test filtering meal logs by day interval"""
        self.client_api.force_authenticate(user=self.user)
        MealLog.objects.create(user=self.user, meal=self.meal, consumed_at=date.today())
        response = self.client_api.get('/api/profiles/logs/?interval=day')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_meal_log_unauthenticated(self):
        """Test unauthenticated access is denied"""
        response = self.client_api.get('/api/profiles/logs/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


