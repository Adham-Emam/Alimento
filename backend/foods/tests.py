from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import FoodItem, Recipe, Meal, RecipeIngredient, MealIngredient

User = get_user_model()


class FoodItemTests(APITestCase):
    def setUp(self):
        self.food = FoodItem.objects.create(name="Apple", price=2.5)

    def test_food_list(self):
        url = reverse("food-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["name"], "Apple")

    def test_food_detail(self):
        url = reverse("food-detail", args=[self.food.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Apple")


class RecipeTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="testuser@example.com", password="pass1234"
        )
        self.food = FoodItem.objects.create(name="Banana", price=1.5)
        self.recipe = Recipe.objects.create(
            name="Banana Smoothie", user=self.user  # <-- required
        )
        RecipeIngredient.objects.create(
            recipe=self.recipe,
            food_item=self.food,
            quantity=100,  # or whatever value
            unit="grams",
        )

    def test_recipe_list(self):
        url = reverse("recipe-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["name"], "Banana Smoothie")

    def test_recipe_detail(self):
        url = reverse("recipe-detail", args=[self.recipe.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Banana Smoothie")


class MealTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="mealuser@example.com", password="pass123"
        )
        self.food = FoodItem.objects.create(name="Egg", price=0.5)
        self.meal = Meal.objects.create(user=self.user, meal_type="breakfast")
        MealIngredient.objects.create(
            meal=self.meal, food_item=self.food, quantity=2, unit="pieces"
        )

        # Generate JWT token for the user
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

        # Add token to client's Authorization header
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    def test_meal_list_authenticated(self):
        url = reverse("meal-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["meal_type"], "breakfast")

    def test_meal_detail_authenticated(self):
        url = reverse("meal-detail", args=[self.meal.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["meal_type"], "breakfast")

    def test_meal_create(self):
        url = reverse("meal-create")
        payload = {"meal_type": "lunch", "recipes": [], "ingredients": []}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Meal.objects.filter(user=self.user).count(), 2)
