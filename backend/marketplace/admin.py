from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "product_type", "price", "is_active", "created_at")
    list_filter = ("product_type", "is_active", "created_at")
    search_fields = ("title", "description", "advisory_text")
    ordering = ("-created_at",)

    fieldsets = (
        (
            None,
            {"fields": ("title", "description", "product_type", "price", "is_active")},
        ),
        (
            "Links / Advisory",
            {"fields": ("affiliate_link", "advisory_text", "contraindications")},
        ),
        (
            "Nutrition (optional)",
            {"fields": ("calories", "protein", "fat", "carbohydrates")},
        ),
        ("Timestamps", {"fields": ("created_at",)}),
    )

    readonly_fields = ("created_at",)
