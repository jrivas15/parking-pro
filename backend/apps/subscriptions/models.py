from django.db import models


class Subscription(models.Model):
    STATE_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
    ]


    vehicle = models.ForeignKey('vehicles.Vehicle', on_delete=models.CASCADE, related_name='subscriptions')
    card = models.CharField(max_length=20, null=True)
    startDate = models.DateField()
    endDate = models.DateField()
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    isActive = models.BooleanField(default=True)
    note = models.CharField(max_length=255, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    state = models.CharField(max_length=20, choices=STATE_CHOICES, default='active')

    class Meta:
        db_table = 'subscriptions'
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'
        

    def __str__(self):
        return f'Subscription {self.id} - {self.plate} ({self.startDate} → {self.endDate})'
