import stripe
from datetime import timedelta
from django.conf import settings
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import UserSubscriptionSerializer
from .services import get_subscription, activate_pro


# 🔑 Stripe configuration
stripe.api_key = settings.STRIPE_SECRET_KEY


class MySubscriptionView(APIView):
    """
    Returns the current user's subscription status
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sub = get_subscription(request.user)
        serializer = UserSubscriptionSerializer(sub)
        return Response(serializer.data)


class StripeCheckoutView(APIView):
    """
    Creates a Stripe Checkout session (real payment, test mode)
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not settings.STRIPE_SECRET_KEY or not settings.STRIPE_PRICE_ID:
            return Response(
                {"error": "Stripe is not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            session = stripe.checkout.Session.create(
                mode="subscription",
                payment_method_types=["card"],
                line_items=[
                    {
                        "price": settings.STRIPE_PRICE_ID,
                        "quantity": 1,
                    }
                ],
                customer_email=request.user.email,
                success_url="http://localhost:5500/success.html",
                cancel_url="http://localhost:5500/cancel.html",
            )
        except stripe.error.StripeError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"checkout_url": session.url})


class DemoActivateProView(APIView):
    """
    ⚠️ DEMO ONLY
    Activates Pro after successful Stripe redirect.
    REMOVE when webhook is added.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        period_end = timezone.now() + timedelta(days=30)
        activate_pro(request.user, period_end)
        return Response({"detail": "Pro activated (demo mode)"})
