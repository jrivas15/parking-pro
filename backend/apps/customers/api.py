from rest_framework import viewsets, permissions
from .models import Customer
from .serializer import CustomerSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CustomerSerializer
