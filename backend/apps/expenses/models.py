from django.db import models


EXPENSE_TYPE_CHOICES = [
    ('Compra', 'Compra'),
    ('Nómina', 'Nómina'),
    ('Pago', 'Pago'),
    ('Otro', 'Otro'),
]


class Expense(models.Model):
    description = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    expenseType = models.CharField(max_length=20, choices=EXPENSE_TYPE_CHOICES, null=True, blank=True)
    paymentMethod = models.ForeignKey(
        'payment_methods.PaymentMethod',
        on_delete=models.SET_NULL,
        null=True
    )
    saleReport = models.ForeignKey(
        'sales_reports.SalesReport',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'expenses'
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'

    def __str__(self):
        return f'{self.description} - {self.value}'
