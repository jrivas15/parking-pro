from rest_framework import permissions, viewsets
from .serializer import PaymentMethodSerializer
from .models import PaymentMethod


class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaymentMethodSerializer

    def perform_update(self, serializer):
        print("Updating PaymentMethod with data:", serializer.validated_data)
        return super().perform_update(serializer)
