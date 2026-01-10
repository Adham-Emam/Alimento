from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.filters import SearchFilter


from .models import Product
from .serializers import ProductSerializer

# Create your views here.


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter]
    search_fields = [
        "product_type",
        "price",
    ]


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
