from django.db import models
from apps.users.models import User
from apps.tariffs.models import Tariff

class Movement(models.Model):
    nTicket = models.BigAutoField(primary_key=True)
    plate = models.CharField(max_length=15)
    entryTime = models.DateTimeField(auto_now_add=True)
    exitTime = models.DateTimeField(null=True)
    vehicleType = models.CharField(max_length=6)
    card = models.CharField(max_length=20, null=True)
    speciality = models.CharField(max_length=20, null=True, blank=True, default="NORMAL")
    parkingTime = models.CharField(max_length=50, null=True)
    tariff = models.ForeignKey(Tariff, null=True, on_delete=models.SET_NULL)
    updatedAt = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'movements'
        verbose_name = 'Movement'
        verbose_name_plural = 'Movements'
        indexes =[
            models.Index(fields=['exitTime'], name='idx_exit_time'),
            models.Index(fields=['plate'], name='idx_plate_active', condition=models.Q(exitTime__isnull=True)),
        ]