from django.db import models
from apps.customers.models import Customer


class Vehicle(models.Model):
    plate = models.CharField(max_length=15, unique=True)
    brand = models.CharField(max_length=50, null=True, blank=True)
    color = models.CharField(max_length=30, null=True, blank=True)
    vehicleType = models.CharField(max_length=6)
    customer = models.ForeignKey(
        Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name='vehicles'
    )
    isActive = models.BooleanField(default=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vehicles'
        verbose_name = 'Vehicle'
        verbose_name_plural = 'Vehicles'

    def __str__(self):
        return f'{self.plate} ({self.vehicleType})'
