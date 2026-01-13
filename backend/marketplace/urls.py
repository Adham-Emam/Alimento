from django.urls import path
from .views import ProductListView, ProductDetailView

app_name = "marketplace"

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<str:slug>/", ProductDetailView.as_view(), name="product-detail"),
]
