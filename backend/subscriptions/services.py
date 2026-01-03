from django.utils import timezone
from .models import UserSubscription


def get_subscription(user):
    return UserSubscription.objects.get(user=user)


def has_active_pro(user):
    try:
        sub = get_subscription(user)
    except UserSubscription.DoesNotExist:
        return False

    if not sub.is_pro:
        return False

    if not sub.current_period_end:
        return False

    return sub.current_period_end > timezone.now()


def has_active_coach(user):
    try:
        sub = get_subscription(user)
    except UserSubscription.DoesNotExist:
        return False

    if not sub.is_coach:
        return False

    if not sub.current_period_end:
        return False

    return sub.current_period_end > timezone.now()


def activate_pro(user, period_end):
    sub, _ = UserSubscription.objects.get_or_create(user=user)
    sub.is_pro = True
    sub.current_period_end = period_end
    sub.save()
    return sub


def activate_coach(user, period_end):
    sub, _ = UserSubscription.objects.get_or_create(user=user)
    sub.is_coach = True
    sub.current_period_end = period_end
    sub.save()
    return sub


def deactivate_pro(user):
    try:
        sub = get_subscription(user)
    except UserSubscription.DoesNotExist:
        return None

    sub.is_pro = False
    sub.current_period_end = None
    sub.save()
    return sub


def deactivate_coach(user):
    try:
        sub = get_subscription(user)
    except UserSubscription.DoesNotExist:
        return None

    sub.is_coach = False
    sub.current_period_end = None
    sub.save()
    return sub
