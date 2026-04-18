from rest_framework import permissions, viewsets, mixins
from rest_framework.response import Response
from .serializer import EInvoiceSerializer, EInvoiceAPIConfigSerializer
from .models import EInvoice, EInvoiceAPIConfig


class EInvoiceViewSet(viewsets.ModelViewSet):
    queryset = EInvoice.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EInvoiceSerializer


class EInvoiceAPIConfigViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EInvoiceAPIConfigSerializer

    def get_object(self):
        obj, _ = EInvoiceAPIConfig.objects.get_or_create(pk=1)
        return obj

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
