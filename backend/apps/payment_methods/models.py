from django.db import models


class PaymentMethod(models.Model):
    name = models.CharField(max_length=50)
    codeEI = models.CharField(max_length=10, null=True)
    isActive = models.BooleanField(default=True)


    class Meta:
        db_table = 'payment_methods'
        verbose_name = 'PaymentMethod'
        verbose_name_plural = 'PaymentMethods'

    def __str__(self):
        return self.name
