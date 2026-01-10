from django.urls import path

from .views import (
    MyCoachProfileView,
    CoachRequestCreateView,
    MyCoachRequestView,
    CoachRequestResubmitView,
    PendingCoachRequestListView,
    CoachRequestApproveView,
    CoachRequestDeclineView,
)

app_name = "coaches"

urlpatterns = [
    # Coach profile (for the currently logged-in coach)
    path("me/profile/", MyCoachProfileView.as_view(), name="my-coach-profile"),
    # Coach request lifecycle (user)
    path("requests/", CoachRequestCreateView.as_view(), name="coach-request-create"),
    path("requests/me/", MyCoachRequestView.as_view(), name="coach-request-me"),
    path(
        "requests/<int:pk>/resubmit/",
        CoachRequestResubmitView.as_view(),
        name="coach-request-resubmit",
    ),
    # Admin moderation
    path(
        "admin/requests/pending/",
        PendingCoachRequestListView.as_view(),
        name="coach-request-pending-list",
    ),
    path(
        "admin/requests/<int:pk>/approve/",
        CoachRequestApproveView.as_view(),
        name="coach-request-approve",
    ),
    path(
        "admin/requests/<int:pk>/decline/",
        CoachRequestDeclineView.as_view(),
        name="coach-request-decline",
    ),
]
