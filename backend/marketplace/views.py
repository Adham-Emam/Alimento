from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter
from rest_framework.pagination import CursorPagination

from .models import Product
from .serializers import ProductSerializer


class ProductCursorPagination(CursorPagination):
    page_size = 30
    ordering = "-created_at"
    page_size_query_param = "page_size"
    max_page_size = 100


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    pagination_class = ProductCursorPagination
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter]
    search_fields = [
        "title",
        "product_type",
    ]


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
