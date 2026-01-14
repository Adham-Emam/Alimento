from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import CoachProfile, CoachRequest
from decimal import Decimal

User = get_user_model()


class CoachProfileModelTests(TestCase):
    """Test cases for CoachProfile model"""

    def setUp(self):
        self.user = User.objects.create_user(
            email='coach@example.com',
            password='testpass123'
        )

    def test_create_coach_profile(self):
        """Test creating a coach profile"""
        coach_profile = CoachProfile.objects.create(
            user=self.user,
            title='Certified Fitness Coach',
            bio='Experienced fitness coach',
            experience_years=5,
            specialization=['Weight Loss', 'Muscle Building'],
            languages=['English', 'Spanish'],
            monthly_rate=Decimal('99.99'),
            certifications=['NASM-CPT', 'ACE']
        )
        self.assertEqual(coach_profile.user, self.user)
        self.assertEqual(coach_profile.title, 'Certified Fitness Coach')
        self.assertEqual(coach_profile.experience_years, 5)
        self.assertEqual(coach_profile.monthly_rate, Decimal('99.99'))

    def test_coach_profile_one_per_user(self):
        """Test only one coach profile per user"""
        CoachProfile.objects.create(
            user=self.user,
            title='Coach',
            bio='Test bio',
            experience_years=3,
            monthly_rate=Decimal('50.00')
        )
        with self.assertRaises(Exception):
            CoachProfile.objects.create(
                user=self.user,
                title='Another Coach',
                bio='Another bio',
                experience_years=5,
                monthly_rate=Decimal('100.00')
            )

    def test_coach_profile_json_fields(self):
        """Test JSON fields work correctly"""
        coach_profile = CoachProfile.objects.create(
            user=self.user,
            title='Test Coach',
            bio='Bio',
            experience_years=2,
            monthly_rate=Decimal('75.00'),
            certifications=['Cert1', 'Cert2'],
            specialization=['Nutrition', 'Fitness'],
            languages=['English', 'French']
        )
        self.assertEqual(len(coach_profile.certifications), 2)
        self.assertEqual(len(coach_profile.specialization), 2)
        self.assertEqual(len(coach_profile.languages), 2)


class CoachRequestModelTests(TestCase):
    """Test cases for CoachRequest model"""

    def setUp(self):
        self.user = User.objects.create_user(
            email='applicant@example.com',
            password='testpass123'
        )

    def test_create_coach_request(self):
        """Test creating a coach request"""
        request = CoachRequest.objects.create(
            user=self.user,
            title='Fitness Coach',
            bio='I want to become a coach',
            experience_years=3,
            monthly_rate=Decimal('80.00'),
            certifications=['NASM-CPT'],
            specialization=['Weight Loss'],
            languages=['English']
        )
        self.assertEqual(request.user, self.user)
        self.assertEqual(request.status, 'pending')
        self.assertEqual(request.title, 'Fitness Coach')

    def test_coach_request_default_status(self):
        """Test default status is pending"""
        request = CoachRequest.objects.create(
            user=self.user,
            title='Coach',
            bio='Bio',
            experience_years=2,
            monthly_rate=Decimal('50.00')
        )
        self.assertEqual(request.status, 'pending')

    def test_coach_request_status_choices(self):
        """Test coach request status can be changed"""
        request = CoachRequest.objects.create(
            user=self.user,
            title='Coach',
            bio='Bio',
            experience_years=2,
            monthly_rate=Decimal('50.00')
        )
        request.status = 'approved'
        request.save()
        self.assertEqual(request.status, 'approved')

    def test_unique_pending_request_per_user(self):
        """Test user cannot have multiple pending requests"""
        CoachRequest.objects.create(
            user=self.user,
            title='Coach',
            bio='Bio',
            experience_years=2,
            monthly_rate=Decimal('50.00'),
            status='pending'
        )
        with self.assertRaises(Exception):
            CoachRequest.objects.create(
                user=self.user,
                title='Another Coach',
                bio='Another bio',
                experience_years=3,
                monthly_rate=Decimal('60.00'),
                status='pending'
            )

    def test_multiple_declined_requests_allowed(self):
        """Test user can have multiple declined requests"""
        CoachRequest.objects.create(
            user=self.user,
            title='Coach 1',
            bio='Bio 1',
            experience_years=2,
            monthly_rate=Decimal('50.00'),
            status='declined'
        )
        # Should not raise exception
        request2 = CoachRequest.objects.create(
            user=self.user,
            title='Coach 2',
            bio='Bio 2',
            experience_years=3,
            monthly_rate=Decimal('60.00'),
            status='declined'
        )
        self.assertEqual(request2.status, 'declined')


class CoachingAPITests(APITestCase):
    """Test cases for Coaching API endpoints"""

    def setUp(self):
        self.client_api = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.coach_user = User.objects.create_user(
            email='coach@example.com',
            password='testpass123'
        )
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123'
        )
        self.coach_profile = CoachProfile.objects.create(
            user=self.coach_user,
            title='Professional Coach',
            bio='Expert in nutrition',
            experience_years=5,
            monthly_rate=Decimal('100.00')
        )

    def test_create_coach_request(self):
        """Test creating a coach request"""
        self.client_api.force_authenticate(user=self.user)
        data = {
            'title': 'Nutrition Coach',
            'bio': 'I am experienced in nutrition',
            'experience_years': 3,
            'certifications': ['ACE', 'NASM'],
            'specialization': ['weight_loss'],
            'languages': ['English'],
            'monthly_rate': 100.00
        }
        response = self.client_api.post('/api/coaches/requests/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_own_coach_profile(self):
        """Test getting own coach profile"""
        self.client_api.force_authenticate(user=self.coach_user)
        response = self.client_api.get('/api/coaches/me/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Professional Coach')

    def test_get_coach_profile_without_profile(self):
        """Test getting coach profile when user doesn't have one"""
        self.client_api.force_authenticate(user=self.user)
        response = self.client_api.get('/api/coaches/me/profile/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_my_coach_request(self):
        """Test getting own coach request"""
        self.client_api.force_authenticate(user=self.user)
        CoachRequest.objects.create(
            user=self.user,
            title='Test Coach',
            bio='Test bio',
            experience_years=2,
            monthly_rate=Decimal('50.00')
        )
        response = self.client_api.get('/api/coaches/requests/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_list_pending_requests(self):
        """Test admin can list pending coach requests"""
        self.client_api.force_authenticate(user=self.admin_user)
        CoachRequest.objects.create(
            user=self.user,
            title='Test Coach',
            bio='Test',
            experience_years=2,
            monthly_rate=Decimal('50.00'),
            status=CoachRequest.Status.PENDING
        )
        response = self.client_api.get('/api/coaches/admin/requests/pending/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_approve_request(self):
        """Test admin can approve coach request"""
        self.client_api.force_authenticate(user=self.admin_user)
        request = CoachRequest.objects.create(
            user=self.user,
            title='Test Coach',
            bio='Test bio',
            experience_years=2,
            monthly_rate=Decimal('50.00'),
            status=CoachRequest.Status.PENDING
        )
        response = self.client_api.patch(f'/api/coaches/admin/requests/{request.id}/approve/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        request.refresh_from_db()
        self.assertEqual(request.status, CoachRequest.Status.APPROVED)

    def test_admin_decline_request(self):
        """Test admin can decline coach request"""
        self.client_api.force_authenticate(user=self.admin_user)
        request = CoachRequest.objects.create(
            user=self.user,
            title='Test Coach',
            bio='Test bio',
            experience_years=2,
            monthly_rate=Decimal('50.00'),
            status=CoachRequest.Status.PENDING
        )
        response = self.client_api.patch(
            f'/api/coaches/admin/requests/{request.id}/decline/',
            {'decline_reason': 'Insufficient experience'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_admin_cannot_approve(self):
        """Test non-admin cannot approve coach requests"""
        self.client_api.force_authenticate(user=self.user)
        request = CoachRequest.objects.create(
            user=self.user,
            title='Test',
            bio='Test',
            experience_years=2,
            monthly_rate=Decimal('50.00')
        )
        response = self.client_api.patch(f'/api/coaches/admin/requests/{request.id}/approve/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


