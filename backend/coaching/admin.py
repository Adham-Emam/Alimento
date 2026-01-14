from django.contrib import admin, messages
from django.urls import path
from django.shortcuts import redirect, render
from django.core.exceptions import ValidationError

from .models import (
    CoachProfile,
    CoachRequest,
    PendingCoachRequest,
)
from .services.coach_request_service import (
    approve_coach_request,
    decline_coach_request,
)

from .forms import DeclineCoachRequestForm


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
    search_fields = ("user__email", "user__first_name", "user__last_name", "title")
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

    actions = ["approve_requests", "decline_requests"]

    def approve_requests(self, request, queryset):
        pending = queryset.filter(status=CoachRequest.Status.PENDING)
        count = 0

        for obj in pending:
            try:
                approve_coach_request(
                    coach_request_id=obj.id,
                    reviewer=request.user,
                )
                count += 1
            except ValidationError as e:
                self.message_user(
                    request,
                    f"Request {obj.id}: {e}",
                    level=messages.ERROR,
                )

        self.message_user(
            request,
            f"{count} coach request(s) approved.",
            level=messages.SUCCESS,
        )

    approve_requests.short_description = "Approve selected coach requests"

    def decline_requests(self, request, queryset):
        for obj in queryset.filter(status=CoachRequest.Status.PENDING):
            try:
                decline_coach_request(
                    coach_request_id=obj.id,
                    reviewer=request.user,
                    reason="Declined by admin",
                )
            except ValidationError as e:
                self.message_user(
                    request,
                    f"Request {obj.id}: {e}",
                    level=messages.ERROR,
                )

        self.message_user(
            request,
            "Selected coach requests declined.",
            level=messages.SUCCESS,
        )


@admin.register(PendingCoachRequest)
class PendingCoachRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "monthly_rate", "created_at")
    ordering = ("created_at",)

    readonly_fields = (
        "user",
        "title",
        "bio",
        "experience_years",
        "certifications",
        "specialization",
        "languages",
        "monthly_rate",
        "created_at",
    )

    fieldsets = (
        ("Applicant", {"fields": ("user", "created_at")}),
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
        ("Actions", {"fields": ()}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).filter(status=CoachRequest.Status.PENDING)

    # 🔹 Inject buttons into change form
    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        extra_context = extra_context or {}
        extra_context["show_approve"] = True
        extra_context["show_decline"] = True
        return super().changeform_view(request, object_id, form_url, extra_context)

    # 🔹 Custom admin URLs
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:object_id>/approve/",
                self.admin_site.admin_view(self.approve_view),
                name="coachrequest_approve",
            ),
            path(
                "<int:object_id>/decline/",
                self.admin_site.admin_view(self.decline_view),
                name="coachrequest_decline",
            ),
        ]
        return custom_urls + urls

    def approve_view(self, request, object_id):
        try:
            approve_coach_request(
                coach_request_id=object_id,
                reviewer=request.user,
            )
            self.message_user(request, "Coach request approved.", messages.SUCCESS)
        except ValidationError as e:
            self.message_user(request, str(e), messages.ERROR)

        return redirect("..")

    def decline_view(self, request, object_id):
        if request.method == "POST":
            form = DeclineCoachRequestForm(request.POST)
            if form.is_valid():
                try:
                    decline_coach_request(
                        coach_request_id=object_id,
                        reviewer=request.user,
                        reason=form.cleaned_data["decline_reason"],
                    )
                    self.message_user(
                        request, "Coach request declined.", messages.SUCCESS
                    )
                    return redirect("..")
                except ValidationError as e:
                    self.message_user(request, str(e), messages.ERROR)
        else:
            form = DeclineCoachRequestForm()

        return render(
            request,
            "admin/coach_requests/decline.html",
            {
                "form": form,
                "title": "Decline Coach Request",
            },
        )
