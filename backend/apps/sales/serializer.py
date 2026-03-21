from rest_framework import serializers
from .models import Sale
from apps.movements.serializer import MovementSerializer
from apps.payment_methods.serializer import PaymentMethodSerializer


class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'


class SaleWithMovementSerializer(serializers.ModelSerializer):
    movement = MovementSerializer(read_only=True)
    paymentMethod = PaymentMethodSerializer(read_only=True)
    paymentMethod1 = PaymentMethodSerializer(read_only=True)
    paymentMethod2 = PaymentMethodSerializer(read_only=True)

    class Meta:
        model = Sale
        fields = '__all__'
