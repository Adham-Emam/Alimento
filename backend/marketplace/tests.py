from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Product
from decimal import Decimal

User = get_user_model()


class ProductModelTests(TestCase):
    """Test cases for Product model"""

    def test_create_product(self):
        """Test creating a product"""
        product = Product.objects.create(
            title='Whey Protein',
            description='High quality whey protein powder',
            product_type='SUPPLEMENT',
            price=Decimal('49.99'),
            calories=120,
            protein=25.0,
            fat=2.0,
            carbohydrates=3.0
        )
        self.assertEqual(product.title, 'Whey Protein')
        self.assertEqual(product.product_type, 'SUPPLEMENT')
        self.assertEqual(product.price, Decimal('49.99'))
        self.assertTrue(product.is_active)

    def test_product_types(self):
        """Test different product types"""
        supplement = Product.objects.create(
            title='Vitamin D',
            description='Vitamin D supplement',
            product_type='SUPPLEMENT',
            price=Decimal('19.99')
        )
        herb = Product.objects.create(
            title='Turmeric',
            description='Organic turmeric',
            product_type='HERB',
            price=Decimal('14.99')
        )
        snack = Product.objects.create(
            title='Protein Bar',
            description='High protein snack bar',
            product_type='SNACK',
            price=Decimal('2.99')
        )
        self.assertEqual(supplement.product_type, 'SUPPLEMENT')
        self.assertEqual(herb.product_type, 'HERB')
        self.assertEqual(snack.product_type, 'SNACK')

    def test_product_optional_fields(self):
        """Test product with optional fields"""
        product = Product.objects.create(
            title='Test Product',
            description='Test description',
            product_type='SUPPLEMENT',
            price=Decimal('29.99'),
            affiliate_link='https://example.com/product',
            advisory_text='Consult your doctor',
            contraindications='Not for pregnant women'
        )
        self.assertIsNotNone(product.affiliate_link)
        self.assertIsNotNone(product.advisory_text)
        self.assertIsNotNone(product.contraindications)

    def test_product_nutritional_info(self):
        """Test product nutritional information"""
        product = Product.objects.create(
            title='Protein Powder',
            description='Test',
            product_type='SUPPLEMENT',
            price=Decimal('39.99'),
            calories=110,
            protein=24.0,
            fat=1.5,
            carbohydrates=2.0
        )
        self.assertEqual(product.calories, 110)
        self.assertEqual(product.protein, 24.0)

    def test_product_is_active_default(self):
        """Test product is active by default"""
        product = Product.objects.create(
            title='Test',
            description='Test',
            product_type='SUPPLEMENT',
            price=Decimal('19.99')
        )
        self.assertTrue(product.is_active)

    def test_product_str(self):
        """Test product string representation"""
        product = Product.objects.create(
            title='Test Product',
            description='Test',
            product_type='SUPPLEMENT',
            price=Decimal('29.99')
        )
        self.assertEqual(str(product), 'Test Product')


class MarketplaceAPITests(APITestCase):
    """Test cases for Marketplace API endpoints"""

    def setUp(self):
        self.client_api = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.product = Product.objects.create(
            title='Test Product',
            description='Test description',
            product_type='SUPPLEMENT',
            price=Decimal('29.99')
        )

    def test_list_products(self):
        """Test retrieving list of products"""
        response = self.client_api.get('/api/marketplace/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_product_detail(self):
        """Test retrieving product details"""
        response = self.client_api.get(f'/api/marketplace/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Product')

    def test_list_products_ordering(self):
        """Test products are ordered by created_at descending"""
        Product.objects.create(
            title='Newer Product',
            description='Test',
            product_type='HERB',
            price=Decimal('19.99')
        )
        response = self.client_api.get('/api/marketplace/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Most recent should be first
        self.assertEqual(response.data[0]['title'], 'Newer Product')

    def test_search_products_by_type(self):
        """Test searching products by product type"""
        Product.objects.create(
            title='Herb Product',
            description='Test',
            product_type='HERB',
            price=Decimal('14.99')
        )
        response = self.client_api.get('/api/marketplace/products/?search=HERB')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_product_not_found(self):
        """Test 404 for non-existent product"""
        response = self.client_api.get('/api/marketplace/products/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_products_public_access(self):
        """Test products are accessible without authentication"""
        # No authentication
        response = self.client_api.get('/api/marketplace/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


