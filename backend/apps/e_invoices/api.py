from rest_framework import permissions, viewsets
from .serializer import EInvoiceSerializer
from .models import EInvoice


class EInvoiceViewSet(viewsets.ModelViewSet):
    queryset = EInvoice.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EInvoiceSerializer
