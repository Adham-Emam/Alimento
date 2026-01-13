from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import UserSubscription
from datetime import datetime, timedelta

User = get_user_model()


class UserSubscriptionModelTests(TestCase):
    """Test cases for UserSubscription model"""

    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    def test_create_user_subscription(self):
        """Test creating a user subscription"""
        subscription = UserSubscription.objects.create(
            user=self.user,
            is_pro=True,
            is_coach=False,
            current_period_end=datetime.now() + timedelta(days=30)
        )
        self.assertEqual(subscription.user, self.user)
        self.assertTrue(subscription.is_pro)
        self.assertFalse(subscription.is_coach)

    def test_subscription_one_per_user(self):
        """Test only one subscription per user"""
        UserSubscription.objects.create(user=self.user)
        with self.assertRaises(Exception):
            UserSubscription.objects.create(user=self.user)

    def test_subscription_default_values(self):
        """Test subscription default values"""
        subscription = UserSubscription.objects.create(user=self.user)
        self.assertFalse(subscription.is_pro)
        self.assertFalse(subscription.is_coach)

    def test_subscription_str(self):
        """Test subscription string representation"""
        subscription = UserSubscription.objects.create(
            user=self.user,
            is_pro=True
        )
        self.assertIn(str(self.user), str(subscription))
        self.assertIn('Pro=True', str(subscription))

    def test_pro_subscription(self):
        """Test setting pro subscription"""
        subscription = UserSubscription.objects.create(
            user=self.user,
            is_pro=True,
            current_period_end=datetime.now() + timedelta(days=30)
        )
        self.assertTrue(subscription.is_pro)
        self.assertIsNotNone(subscription.current_period_end)

    def test_coach_subscription(self):
        """Test setting coach subscription"""
        subscription = UserSubscription.objects.create(
            user=self.user,
            is_coach=True
        )
        self.assertTrue(subscription.is_coach)

    def test_both_subscriptions(self):
        """Test user can be both pro and coach"""
        subscription = UserSubscription.objects.create(
            user=self.user,
            is_pro=True,
            is_coach=True
        )
        self.assertTrue(subscription.is_pro)
        self.assertTrue(subscription.is_coach)


class SubscriptionAPITests(APITestCase):
    """Test cases for Subscription API endpoints"""

    def setUp(self):
        self.client_api = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.subscription = UserSubscription.objects.create(
            user=self.user,
            is_pro=False
        )

    def test_get_user_subscription(self):
        """Test authenticated user can get their subscription"""
        self.client_api.force_authenticate(user=self.user)
        response = self.client_api.get('/api/subscriptions/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['is_pro'])

    def test_get_subscription_unauthenticated(self):
        """Test unauthenticated access is denied"""
        response = self.client_api.get('/api/subscriptions/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_subscription_with_pro(self):
        """Test subscription returns pro status"""
        self.subscription.is_pro = True
        self.subscription.save()
        self.client_api.force_authenticate(user=self.user)
        response = self.client_api.get('/api/subscriptions/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_pro'])

    def test_subscription_expiry_check(self):
        """Test subscription expiry"""
        expired_subscription = UserSubscription.objects.create(
            user=User.objects.create_user(
                email='expired@example.com',
                password='testpass123'
            ),
            is_pro=True,
            current_period_end=datetime.now() - timedelta(days=1)
        )
        # Check if period has ended
        self.assertLess(expired_subscription.current_period_end, datetime.now())

    def test_demo_activate_pro(self):
        """Test demo pro activation endpoint"""
        self.client_api.force_authenticate(user=self.user)
        response = self.client_api.post('/api/subscriptions/demo-activate/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


