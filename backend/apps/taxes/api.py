from rest_framework import permissions, viewsets
from .serializer import TaxSerializer
from .models import Tax


class TaxViewSet(viewsets.ModelViewSet):
    queryset = Tax.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaxSerializer
