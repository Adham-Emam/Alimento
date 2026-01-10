import json
from datetime import date
from django.db.models import Q
from django.conf import settings
from django.core.cache import cache
from django.utils import timezone

from openai import OpenAI

from foods.models import FoodItem, Recipe, Meal
from foods.serializers import FoodItemSerializer, RecipeSerializer, MealSerializer
from profiles.models import MealLog


# ==============================
# CONFIG
# ==============================
FREE_DAILY_LIMIT = 2
PRO_DAILY_LIMIT = 30
CACHE_TTL = 60 * 60 * 24  # 24 hours
MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"]

client = OpenAI(api_key=settings.OPENAI_API_KEY)


# ==============================
# LIMITS
# ==============================
def _usage_cache_key(user):
    return f"ai:daily:{user.id}:{timezone.now().date()}"


def can_generate(user):
    used = cache.get(_usage_cache_key(user), 0)
    limit = (
        PRO_DAILY_LIMIT
        if getattr(getattr(user, "subscription", None), "is_pro", False)
        else FREE_DAILY_LIMIT
    )
    return used < limit


def increase_usage(user):
    key = _usage_cache_key(user)
    cache.set(key, cache.get(key, 0) + 1, CACHE_TTL)


# ==============================
# AI CORE
# ==============================
def generate_daily_plan(user, day):
    """
    Returns:
    {
      date,
      meals: {
        breakfast: {...},
        lunch: {...},
        dinner: {...},
        snack: {...}
      }
    }
    """

    if day is None:
        day = date.today()

    profile = user.userprofile
    health = user.health_data

    # 1 Load food items and recipes

    recipes_qs = Recipe.objects.filter(Q(user=user) | Q(is_public=True))

    if recipes_qs.count() < 4:
        raise ValueError("Not enough public recipes to generate a plan")

    # 2 Send serialized recipes to AI (source of truth)
    recipes_data = RecipeSerializer(recipes_qs, many=True).data

    # 3 PROMPTS (AI ONLY RETURNS IDS)
    system_prompt = """
You are a meal-planning assistant.
- You will be given a user profile and health data.
- You will be given a list of recipes.
- You will be asked to generate a one day meal plan.
- Return JSON with exactly one recipe ID per meal type:
breakfast, lunch, dinner, snack.
"""

    user_prompt = f"""
User profile:
- Sex: {profile.sex}
- Height: {profile.height_cm} cm
- Weight: {profile.weight_kg} kg
- Activity level: {profile.activity_level}
- Goal: {profile.goal}

Target macros:
{json.dumps(health.target_macros)}

Dietary preferences:
{json.dumps(health.dietary_preferences)}

Allergies:
{json.dumps(health.allergies)}

Medical conditions:
{json.dumps(health.medical_conditions)}

Available recipes (USE ONLY THESE IDS):
{json.dumps([{"id": r["id"], "calories": r["calories"], "protein_g": r["protein_g"]} for r in recipes_data])}

Return JSON EXACTLY like:
{{
  "breakfast": 1,
  "lunch": 2,
  "dinner": 3,
  "snack": 4
}}
"""

    # 4 OPENAI CALL (THIS IS WHERE OPENAI IS USED)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.2,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
    )

    ai_result = json.loads(response.choices[0].message.content)

    # 5 BUILD RESPONSE FROM DATABASE (NOT AI)
    meals_response = {}

    for meal_type in MEAL_TYPES:
        rid = ai_result.get(meal_type, None)

        if not rid:
            continue

        recipe = Recipe.objects.filter(
            Q(id=rid) & (Q(is_public=True) | Q(user=user))
        ).first()

        if not recipe:
            continue

        meal, _ = Meal.objects.get_or_create(
            user=user,
            name=recipe.name,
            meal_type=meal_type,
        )

        meal.recipes.set([recipe])

        MealLog.objects.get_or_create(
            user=user,
            meal=meal,
            consumed_at=day,
        )

        meals_response[meal_type] = MealSerializer(meal).data

    increase_usage(user)

    return {
        "date": str(date.today()),
        "meals": meals_response,
    }
