from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.pagination import CursorPagination
from rest_framework.filters import SearchFilter
from rest_framework.exceptions import ValidationError
from rest_framework import status
from django.utils import timezone
from django.db import transaction
from django.shortcuts import get_object_or_404

from .services.coach_request_service import approve_coach_request, decline_coach_request
from .models import CoachRequest, CoachProfile
from .serializers import (
    CoachRequestSerializer,
    CoachRequestUpdateSerializer,
    CoachRequestCreateSerializer,
    CoachProfileSerializer,
)


class CoachCursorPagination(CursorPagination):
    page_size = 30
    ordering = "-created_at"
    page_size_query_param = "page_size"
    max_page_size = 100


class CoachListView(generics.ListAPIView):
    serializer_class = CoachProfileSerializer
    pagination_class = CoachCursorPagination
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter]
    search_fields = [
        "user__first_name",
        "user__last_name",
        "title",
    ]

    def get_queryset(self):
        return CoachProfile.objects.all()


class MyCoachProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CoachProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(CoachProfile, user=self.request.user)


class CoachRequestCreateView(generics.CreateAPIView):
    serializer_class = CoachRequestCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class CoachRequestApproveView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAdminUser]

    def update(self, request, *args, **kwargs):
        try:
            approve_coach_request(
                coach_request_id=kwargs["pk"],
                reviewer=request.user,
            )
        except ValidationError as e:
            return Response(
                {"detail": str(e.detail)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"detail": "Coach request approved and coach profile created."},
            status=status.HTTP_200_OK,
        )


class CoachRequestResubmitView(generics.UpdateAPIView):
    serializer_class = CoachRequestUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CoachRequest.objects.filter(
            user=self.request.user,
            status=CoachRequest.Status.DECLINED,
        )


class CoachRequestDeclineView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAdminUser]

    def update(self, request, *args, **kwargs):
        try:
            decline_coach_request(
                coach_request_id=kwargs["pk"],
                reviewer=request.user,
                reason=request.data.get("decline_reason"),
            )
        except ValidationError as e:
            return Response(
                {"detail": str(e.detail)}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"detail": "Declined."}, status=status.HTTP_200_OK)


class MyCoachRequestView(generics.RetrieveAPIView):
    serializer_class = CoachRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(CoachRequest.objects.filter(user=self.request.user))


class DeleteMyCoachRequestView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(CoachRequest.objects.filter(user=self.request.user))


class PendingCoachRequestListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = CoachRequestCreateSerializer

    def get_queryset(self):
        return CoachRequest.objects.filter(status=CoachRequest.Status.PENDING).order_by(
            "created_at"
        )


class CoachRequestListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = CoachRequestSerializer

    def get_queryset(self):
        return CoachRequest.objects.filter(status=CoachRequest.Status.PENDING).order_by(
            "created_at"
        )
