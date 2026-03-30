from django.db import models
from apps.users.models import User
from apps.movements.models import Movement
from apps.customers.models import Customer
from apps.payment_methods.models import PaymentMethod


class Sale(models.Model):
    movement = models.ForeignKey(Movement, on_delete=models.CASCADE, null=True, blank=True, related_name='sales')
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    taxPercent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    taxValue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amountPaid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paymentMethod = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, related_name='sales')
    paymentMethod1 = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, related_name='sales1')
    paymentMethod2 = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, related_name='sales2')
    item = models.CharField(max_length=255, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sales')
    additionalNote = models.CharField(max_length=255, null=True)
    paymentMethodValue1 = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    paymentMethodValue2 = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    customerID = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, related_name='sales')
    saleReport = models.ForeignKey('sales_reports.SalesReport', on_delete=models.SET_NULL, null=True, related_name='sales')
    
    class Meta:
        db_table = 'sales'
        verbose_name = 'Sale'
        verbose_name_plural = 'Sales'

    def __str__(self):
        if self.movement:
            return f'Sale {self.id} - Ticket {self.movement.nTicket} - Total {self.total}'
        return f'Sale {self.id} - {self.item} - Total {self.total}'
