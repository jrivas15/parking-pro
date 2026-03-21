from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction

from .models import Subscription
from .serializer import SubscriptionSerializer


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all().order_by('-id')
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubscriptionSerializer

    # @action(detail=False, methods=['get'])
    # def active(self, request):
    #     """Returns all subscriptions whose endDate is today or in the future."""
    #     today = timezone.localdate()
    #     qs = Subscription.objects.filter(isActive=True, endDate__gte=today).order_by('endDate')
    #     serializer = self.get_serializer(qs, many=True)
    #     return Response(serializer.data)

    # @action(detail=False, methods=['get'])
    # def by_plate(self, request):
    #     """Returns active subscriptions for a given plate."""
    #     plate = request.query_params.get('plate')
    #     if not plate:
    #         return Response({'error': 'plate parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    #     today = timezone.localdate()
    #     qs = Subscription.objects.filter(
    #         plate__iexact=plate, isActive=True, endDate__gte=today
    #     ).order_by('-endDate')
    #     serializer = self.get_serializer(qs, many=True)
    #     return Response(serializer.data)

    # @action(detail=False, methods=['post'])
    # def create_subscription(self, request):
    #     """Creates a new subscription inside a transaction."""
    #     with transaction.atomic():
    #         try:
    #             serializer = self.get_serializer(data=request.data)
    #             serializer.is_valid(raise_exception=True)
    #             serializer.save(user=request.user)
    #             return Response(serializer.data, status=status.HTTP_201_CREATED)
    #         except Exception as e:
    #             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
