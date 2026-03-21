from rest_framework import serializers
from .models import EInvoice


class EInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EInvoice
        fields = '__all__'
