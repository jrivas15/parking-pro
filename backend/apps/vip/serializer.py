from rest_framework import serializers
from .models import Vip


class VipSerializer(serializers.ModelSerializer):
    vehicle_plate = serializers.CharField(source='vehicle.plate', read_only=True)
    vehicle_type = serializers.CharField(source='vehicle.vehicleType', read_only=True)
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Vip
        fields = [
            'id', 'vehicle', 'vehicle_plate', 'vehicle_type', 'customer_name',
            'card', 'isActive', 'note',
        ]

    def get_customer_name(self, obj):
        try:
            return obj.vehicle.customer.name
        except Exception:
            return None
