from rest_framework import permissions, viewsets
from .serializer import TariffSerializer
from .models import Tariff


class TariffViewSet(viewsets.ModelViewSet):
    queryset = Tariff.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = TariffSerializer