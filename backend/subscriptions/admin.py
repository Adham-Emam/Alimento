from django.contrib import admin
from .models import UserSubscription


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user", "is_pro", "current_period_end")
    readonly_fields = ("created_at", "updated_at")
