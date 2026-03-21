from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Vehicle
from .serializer import VehicleSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all().order_by('-id')
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VehicleSerializer

    @action(detail=False, methods=['get'])
    def by_plate(self, request):
        """Returns a vehicle by exact plate."""
        plate = request.query_params.get('plate')
        if not plate:
            return Response({'error': 'plate parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            vehicle = Vehicle.objects.get(plate__iexact=plate)
        except Vehicle.DoesNotExist:
            return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(vehicle)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Returns all active vehicles."""
        qs = Vehicle.objects.filter(isActive=True).order_by('plate')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
