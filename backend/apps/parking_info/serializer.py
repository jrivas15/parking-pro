from rest_framework import serializers
from .models import ParkingInfo


class ParkingInfoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ParkingInfo
        fields = '__all__'
        read_only_fields = ['id']
