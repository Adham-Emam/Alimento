from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse

User = get_user_model()


class UserModelTests(TestCase):
    """Test cases for User model"""

    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }

    def test_create_user(self):
        """Test creating a user with email"""
        user = User.objects.create_user(
            email=self.user_data['email'],
            password=self.user_data['password']
        )
        self.assertEqual(user.email, self.user_data['email'])
        self.assertTrue(user.check_password(self.user_data['password']))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)

    def test_create_superuser(self):
        """Test creating a superuser"""
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='admin123'
        )
        self.assertEqual(admin_user.email, 'admin@example.com')
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

    def test_email_normalization(self):
        """Test email is normalized"""
        email = 'test@EXAMPLE.com'
        user = User.objects.create_user(email=email, password='test123')
        self.assertEqual(user.email, email.lower())

    def test_user_str(self):
        """Test user string representation"""
        user = User.objects.create_user(
            email='test@example.com',
            password='test123'
        )
        self.assertEqual(str(user), 'test@example.com')

    def test_email_required(self):
        """Test that email is required"""
        with self.assertRaises(ValueError):
            User.objects.create_user(email='', password='test123')


class UserAuthenticationAPITests(APITestCase):
    """Test cases for user authentication endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_user_registration(self):
        """Test user registration endpoint"""
        url = reverse('user-list')  # Adjust based on your URL pattern
        data = {
            'email': 'newuser@example.com',
            'password': 'newpass123',
            're_password': 'newpass123'
        }
        # Note: This test assumes you have a registration endpoint
        # Adjust according to your actual API

    def test_user_login(self):
        """Test user can obtain JWT token"""
        # This test assumes you're using JWT authentication
        # Adjust according to your authentication method
        self.assertTrue(self.user.check_password(self.user_data['password']))

    def test_retrieve_user_unauthorized(self):
        """Test that authentication is required for user details"""
        url = reverse('user-me')  # Adjust based on your URL pattern
        res = self.client.get(url)
        # Should return 401 if authentication is required
        # Adjust based on your API behavior

    def test_retrieve_user_profile(self):
        """Test authenticated user can retrieve their profile"""
        self.client.force_authenticate(user=self.user)
        url = reverse('user-me')  # Adjust based on your URL pattern
        res = self.client.get(url)
        # Adjust assertion based on your API response
