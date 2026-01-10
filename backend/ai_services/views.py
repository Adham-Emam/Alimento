from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ai_services.services import (
    generate_daily_plan,
    can_generate,
    increase_usage,
)


class GenerateDailyPlanAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if not can_generate(user):
            return Response(
                {"detail": "Daily AI generation limit reached"},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        date = request.query_params.get("date")
        data = generate_daily_plan(user, date)
        increase_usage(user)

        return Response(data, status=status.HTTP_200_OK)
