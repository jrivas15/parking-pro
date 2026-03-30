from rest_framework import serializers
from .models import Subscription, SubscriptionPayment


class SubscriptionVehicleSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    plate = serializers.CharField()
    vehicleType = serializers.CharField()


class SubscriptionSerializer(serializers.ModelSerializer):
    vehicles_data = SubscriptionVehicleSerializer(source='vehicles', many=True, read_only=True)
    vehicles = serializers.PrimaryKeyRelatedField(
        queryset=__import__('apps.vehicles.models', fromlist=['Vehicle']).Vehicle.objects.all(),
        many=True,
    )
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = [
            'id', 'vehicles', 'vehicles_data', 'customer_name',
            'card', 'startDate', 'endDate', 'total',
            'isActive', 'note', 'state', 'createdAt', 'updatedAt',
        ]

    def get_customer_name(self, obj):
        vehicle = obj.vehicles.select_related('customer').first()
        if vehicle and vehicle.customer:
            return vehicle.customer.name
        return None

    def validate_vehicles(self, vehicles):
        instance_id = self.instance.id if self.instance else None
        conflicting = []
        for vehicle in vehicles:
            qs = vehicle.subscriptions.all()
            if instance_id:
                qs = qs.exclude(id=instance_id)
            if qs.exists():
                conflicting.append(vehicle.plate)
        if conflicting:
            raise serializers.ValidationError(
                f"Los siguientes vehículos ya tienen una suscripción activa: {', '.join(conflicting)}"
            )
        return vehicles


class SubscriptionPaymentSerializer(serializers.ModelSerializer):
    subscription_id = serializers.PrimaryKeyRelatedField(
        queryset=Subscription.objects.all(), source='subscription'
    )

    class Meta:
        model = SubscriptionPayment
        fields = '__all__'


class SubscriptionPaymentDetailSerializer(serializers.ModelSerializer):
    isPaid = serializers.SerializerMethodField()
    paymentMethod = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = SubscriptionPayment
        fields = ['id', 'subscription', 'period', 'startDate', 'endDate', 'note', 'createdAt', 'isPaid', 'paymentMethod', 'total']

    def get_isPaid(self, obj):
        return obj.sale_id is not None

    def get_paymentMethod(self, obj):
        if obj.sale and obj.sale.paymentMethod:
            return {'id': obj.sale.paymentMethod.id, 'name': obj.sale.paymentMethod.name}
        return None

    def get_total(self, obj):
        return str(obj.sale.total) if obj.sale else None
