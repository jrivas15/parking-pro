from django.db import models


class Vip(models.Model):
    vehicle = models.ForeignKey('vehicles.Vehicle', on_delete=models.CASCADE, related_name='vips')
    card = models.CharField(max_length=100, blank=True, null=True)
    isActive = models.BooleanField(default=True)
    note = models.CharField(max_length=120, blank=True, null=True)

    class Meta:
        db_table = 'vip'
        verbose_name = 'VIP'
        verbose_name_plural = 'VIPs'

    def __str__(self):
        return f'VIP {self.id} - {self.vehicle.plate}'
