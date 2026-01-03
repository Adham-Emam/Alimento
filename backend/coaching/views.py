from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db import transaction

from .models import CoachRequest, CoachProfile
from .serializers import (
    CoachRequestUpdateSerializer,
    CoachRequestCreateSerializer,
    CoachProfileSerializer,
)

# Create your views here.


class CoachRequestApproveView(generics.UpdateAPIView):
    from .models import CoachRequest, CoachProfile
    from .serializers import CoachRequestUpdateSerializer

    queryset = CoachRequest.objects.filter(status=CoachRequest.Status.PENDING)
    serializer_class = CoachRequestUpdateSerializer
    permission_classes = [IsAdminUser]

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        coach_request = self.get_object()
        coach_request.status = CoachRequest.Status.APPROVED
        coach_request.reviewed_by = request.user
        coach_request.reviewed_at = timezone.now()
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
