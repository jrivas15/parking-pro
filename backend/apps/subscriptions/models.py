from django.db import models
from apps.users.models import User
from apps.payment_methods.models import PaymentMethod
from apps.sales.models import Sale

class Subscription(models.Model):
    STATE_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
    ]


    vehicles = models.ManyToManyField('vehicles.Vehicle', related_name='subscriptions')
    card = models.CharField(max_length=20, null=True)
    startDate = models.DateField()
    endDate = models.DateField(null=True, blank=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    isActive = models.BooleanField(default=True)
    note = models.CharField(max_length=255, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    state = models.CharField(max_length=20, choices=STATE_CHOICES, default='pending')

    class Meta:
        db_table = 'subscriptions'
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'

    def __str__(self):
        plates = ', '.join(v.plate for v in self.vehicles.all())
        return f'Subscription {self.id} - [{plates}] ({self.startDate} → {self.endDate})'


class SubscriptionPayment(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='payments')
    period = models.CharField(max_length=80, blank=True, default='')
    startDate = models.DateField()
    endDate = models.DateField()
    sale = models.ForeignKey(Sale, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='subscription_payments')
    note = models.CharField(max_length=255, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'subscription_payments'
        verbose_name = 'Subscription Payment'
        verbose_name_plural = 'Subscription Payments'

    def __str__(self):
        return f'Payment {self.id} - Subscription {self.subscription_id} - {self.period}'
