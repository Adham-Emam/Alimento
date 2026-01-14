from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import ValidationError

from ..models import CoachRequest, CoachProfile


@transaction.atomic
def approve_coach_request(*, coach_request_id: int, reviewer):
    coach_request = CoachRequest.objects.select_for_update().get(
        id=coach_request_id, status=CoachRequest.Status.PENDING
    )

    if hasattr(coach_request.user, "coach_profile"):
        raise ValidationError("User already has a coach profile.")

    coach_request.status = CoachRequest.Status.APPROVED
    coach_request.reviewed_by = reviewer
    coach_request.reviewed_at = timezone.now()
    coach_request.decline_reason = None
    coach_request.save()

    CoachProfile.objects.get_or_create(
        user=coach_request.user,
        title=coach_request.title,
        bio=coach_request.bio,
        experience_years=coach_request.experience_years,
        certifications=coach_request.certifications,
        specialization=coach_request.specialization,
        languages=coach_request.languages,
        monthly_rate=coach_request.monthly_rate,
    )


@transaction.atomic
def decline_coach_request(*, coach_request_id: int, reviewer, reason: str):
    reason = (reason or "").strip()
    if not reason:
        raise ValidationError("Decline reason is required.")

    coach_request = CoachRequest.objects.select_for_update().get(
        id=coach_request_id, status=CoachRequest.Status.PENDING
    )

    coach_request.status = CoachRequest.Status.DECLINED
    coach_request.decline_reason = reason
    coach_request.reviewed_by = reviewer
    coach_request.reviewed_at = timezone.now()
    coach_request.save()
