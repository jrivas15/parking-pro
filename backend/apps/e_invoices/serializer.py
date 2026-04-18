from rest_framework import serializers
from .models import EInvoice, EInvoiceAPIConfig


class EInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EInvoice
        fields = '__all__'


class EInvoiceAPIConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = EInvoiceAPIConfig
        fields = ['id', 'endpoint', 'api_key']
