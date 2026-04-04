from rest_framework import serializers
from .models import Expense
from apps.payment_methods.serializer import PaymentMethodSerializer
from apps.payment_methods.models import PaymentMethod


class ExpenseSerializer(serializers.ModelSerializer):
    paymentMethod = PaymentMethodSerializer(read_only=True)
    paymentMethodId = serializers.PrimaryKeyRelatedField(
        source='paymentMethod',
        queryset=PaymentMethod.objects.all(),
        write_only=True
    )

    class Meta:
        model = Expense
        fields = ['id', 'description', 'value', 'expenseType', 'paymentMethod', 'paymentMethodId', 'saleReport']
