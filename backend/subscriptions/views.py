import stripe
from datetime import timedelta
from django.conf import settings
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import UserSubscriptionSerializer
from .services import get_subscription, activate_pro, activate_coach


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
        plan = request.query_params.get("plan")
        if (
            not settings.STRIPE_SECRET_KEY
            or not settings.STRIPE_PRO_PRICE_ID
            or not settings.STRIPE_COACH_PRICE_ID
        ):
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
                        "price": (
                            settings.STRIPE_PRO_PRICE_ID
                            if plan == "pro"
                            else settings.STRIPE_COACH_PRICE_ID
                        ),
                        "quantity": 1,
                    }
                ],
                customer_email=request.user.email,
                success_url=f"{settings.FRONTEND_URL}/payment/success",
                cancel_url=f"{settings.FRONTEND_URL}/payment/cancel?plan={plan}",
            )
            if session.status == "complete":
                if plan == "coach":
                    self.activate_coach_user()
                elif plan == "pro":
                    self.activate_pro_user()
        except stripe.error.StripeError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"checkout_url": session.url})

    def activate_pro_user(self):
        period_end = timezone.now() + timedelta(days=30)
        activate_pro(self.request.user, period_end)
        return Response({"detail": "Pro activated"})

    def activate_coach_user(self):
        period_end = timezone.now() + timedelta(days=30)
        activate_coach(self.request.user, period_end)
        return Response({"detail": "Coach activated"})


class DemoActivateProView(APIView):
    """
    ⚠️ DEMO ONLY
    Activates Pro after successful Stripe redirect.
    REMOVE when webhook is added.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan = request.query_params.get("plan")
        period_end = timezone.now() + timedelta(days=30)
        if plan == "coach":
            activate_coach(request.user, period_end)
            return Response({"detail": "Coach activated (demo mode)"})
        else:
            activate_pro(request.user, period_end)
            return Response({"detail": "Pro activated (demo mode)"})
