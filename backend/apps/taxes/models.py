from django.db import models


class Tax(models.Model):
    name = models.CharField(max_length=100)
    percent = models.DecimalField(max_digits=5, decimal_places=2)
    isActive = models.BooleanField(default=True)
    codeEI = models.CharField(max_length=10, null=True)
    
    class Meta:
        db_table = 'taxes'
        verbose_name = 'Tax'
        verbose_name_plural = 'Taxes'

    def __str__(self):
        return f'{self.name} ({self.percent}%)'
