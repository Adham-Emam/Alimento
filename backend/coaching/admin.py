from django.contrib import admin
from .models import CoachProfile, CoachRequest


@admin.register(CoachProfile)
class CoachProfileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "title",
        "experience_years",
        "monthly_rate",
        "created_at",
    )
    search_fields = ("user__email", "user__username", "title")
    list_filter = ("created_at",)
    ordering = ("-created_at",)


@admin.register(CoachRequest)
class CoachRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "status",
        "monthly_rate",
        "reviewed_by",
        "reviewed_at",
        "created_at",
    )
    search_fields = ("user__email", "user__username", "title")
    list_filter = ("status", "created_at", "reviewed_at")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "reviewed_at", "reviewed_by")

    fieldsets = (
        (None, {"fields": ("user", "status", "decline_reason")}),
        (
            "Submitted Data",
            {
                "fields": (
                    "title",
                    "bio",
                    "experience_years",
                    "certifications",
                    "specialization",
                    "languages",
                    "monthly_rate",
                )
            },
        ),
        ("Review", {"fields": ("reviewed_by", "reviewed_at", "created_at")}),
    )
