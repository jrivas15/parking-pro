from rest_framework import viewsets
from .models import Expense
from .serializer import ExpenseSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.select_related('paymentMethod').filter(saleReport__isnull=True)
    serializer_class = ExpenseSerializer
