from django.db import models


class SalesReport(models.Model):
    createdAt = models.DateField(auto_now_add=True)
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    note = models.CharField(max_length=255, null=True)
    expenses = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    tax_value = models.DecimalField(max_digits=11, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"Sales Report for {self.createdAt}"