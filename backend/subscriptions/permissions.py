from rest_framework.permissions import BasePermission
from .services import has_active_pro, has_active_coach


class IsProUser(BasePermission):
    message = "This feature requires a Pro subscription."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return has_active_pro(request.user)


class IsCoachUser(BasePermission):
    message = "This feature requires a Coach subscription."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return has_active_coach(request.user)
