from rest_framework import viewsets
from .models import ParkingInfo
from .serializer import ParkingInfoSerializer

class ParkingInfoViewSet(viewsets.ModelViewSet):
    queryset = ParkingInfo.objects.all()
    serializer_class = ParkingInfoSerializer


    class Meta:
        db_table = 'parking_info'

    def __str__(self):
        return f"ParkingInfo {self.name}"