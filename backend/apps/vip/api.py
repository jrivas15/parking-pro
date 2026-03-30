from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import date

from .models import Vip
from .serializer import VipSerializer


class VipViewSet(viewsets.ModelViewSet):
    queryset = Vip.objects.select_related('vehicle__customer').order_by('-id')
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VipSerializer

    @action(detail=False, methods=['get'])
    def active(self, request):
        today = date.today()
        qs = (
            Vip.objects
            .select_related('vehicle__customer')
            .filter(isActive=True, caducate__gte=today)
            .order_by('caducate')
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_plate(self, request):
        plate = request.query_params.get('plate')
        if not plate:
            return Response({'error': 'plate parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        qs = (
            Vip.objects
            .select_related('vehicle__customer')
            .filter(vehicle__plate__iexact=plate)
            .order_by('-caducate')
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
