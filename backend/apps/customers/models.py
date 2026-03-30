from django.db import models


class Customer(models.Model):
    name = models.CharField(max_length=255)
    personType = models.CharField(max_length=50)
    documentType = models.CharField(max_length=50)
    nDoc = models.IntegerField()
    phone = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    postalCode = models.CharField(max_length=20, null=True, blank=True)
    location = models.ForeignKey('municipios.Municipio', on_delete=models.SET_NULL, null=True, related_name='customers')
    email = models.CharField(max_length=255, null=True, blank=True)
    taxID = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'customers'
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'

    def __str__(self):
        return self.name

