from rest_framework import serializers
from .models import Vehicle


class CustomerBasicSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    documentType = serializers.CharField()
    nDoc = serializers.IntegerField()
    phone = serializers.CharField(allow_null=True)


class VehicleSerializer(serializers.ModelSerializer):
    customerData = CustomerBasicSerializer(source='customer', read_only=True)

    class Meta:
        model = Vehicle
        fields = ['id', 'plate', 'brand', 'color', 'vehicleType', 'isActive',
                  'description', 'customer', 'customerData', 'createdAt', 'updatedAt']
