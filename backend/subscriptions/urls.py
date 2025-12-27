from django.urls import path
from .views import (
    MySubscriptionView,
    StripeCheckoutView,
    DemoActivateProView,
)

urlpatterns = [
    path("me/", MySubscriptionView.as_view()),
    path("checkout/", StripeCheckoutView.as_view()),
    path("demo-activate/", DemoActivateProView.as_view()),
]
