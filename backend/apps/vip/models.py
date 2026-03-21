from django.db import models


class Vip(models.Model):
    caducate = models.DateField()
    isActive = models.IntegerField()
    card = models.CharField(max_length=100, blank=True, null=True)
    note = models.CharField(max_length=120, blank=True, null=True)
    vehicle = models.ForeignKey('vehicles.Vehicle', on_delete=models.CASCADE, related_name='vips')
    class Meta:
        db_table = 'vip'