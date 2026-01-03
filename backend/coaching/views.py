from rest_framework import generics, permissions
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import CoachRequest, CoachProfile
from .serializers import (
    CoachRequestUpdateSerializer,
    CoachRequestCreateSerializer,
    CoachProfileSerializer,
)

# Create your views here.


class MyCoachProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CoachProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(CoachProfile, user=self.request.user)


class CoachRequestCreateView(generics.CreateAPIView):
    serializer_class = CoachRequestCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class CoachRequestApproveView(generics.UpdateAPIView):
    serializer_class = CoachRequestUpdateSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return CoachRequest.objects.filter(status=CoachRequest.Status.PENDING)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        coach_request = self.get_queryset().select_for_update().get(pk=kwargs["pk"])

        if hasattr(coach_request.user, "coach_profile"):
            return Response(
                {"detail": "User already has a coach profile."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        coach_request.status = CoachRequest.Status.APPROVED
        coach_request.reviewed_by = request.user
        coach_request.reviewed_at = timezone.now()
        coach_request.decline_reason = None
        coach_request.save()

        CoachProfile.objects.create(
            user=coach_request.user,
            title=coach_request.title,
            bio=coach_request.bio,
            experience_years=coach_request.experience_years,
            certifications=coach_request.certifications,
            specialization=coach_request.specialization,
            languages=coach_request.languages,
            monthly_rate=coach_request.monthly_rate,
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
    permission_classes = [IsAdminUser]
    serializer_class = CoachRequestUpdateSerializer

    def get_queryset(self):
        return CoachRequest.objects.filter(status=CoachRequest.Status.PENDING)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        reason = (request.data.get("decline_reason") or "").strip()
        if not reason:
            return Response(
                {"decline_reason": "This field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        coach_request = self.get_queryset().select_for_update().get(pk=kwargs["pk"])

        coach_request.status = CoachRequest.Status.DECLINED
        coach_request.decline_reason = reason
        coach_request.reviewed_by = request.user
        coach_request.reviewed_at = timezone.now()
        coach_request.save()

        return Response({"detail": "Declined."}, status=status.HTTP_200_OK)


class MyCoachRequestView(generics.RetrieveAPIView):
    serializer_class = CoachRequestCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(
            CoachRequest.objects.filter(user=self.request.user).order_by("-created_at")
        )


class PendingCoachRequestListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = CoachRequestCreateSerializer

    def get_queryset(self):
        return CoachRequest.objects.filter(status=CoachRequest.Status.PENDING).order_by(
            "created_at"
        )
