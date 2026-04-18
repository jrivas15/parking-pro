from django.db import models


class EInvoiceAPIConfig(models.Model):
    endpoint = models.URLField(default="http://localhost:8001/api/v1")
    api_key = models.CharField(max_length=256, blank=True, default="")

    class Meta:
        db_table = 'e_invoice_api_config'
        verbose_name = "E-Invoice API Config"


class EInvoice(models.Model):
    documentType = models.CharField(max_length=50)
    issueDate = models.DateTimeField(auto_now_add=True)
    state = models.CharField(max_length=50)
    track_id = models.CharField(max_length=255, null=True, blank=True)
    status_msg = models.CharField(max_length=255, null=True, blank=True)
    errors = models.TextField(null=True, blank=True)
    saleID = models.ForeignKey('sales.Sale', on_delete=models.SET_NULL, null=True, related_name='e_invoices')

    class Meta:
        db_table = 'e_invoices'
        verbose_name = 'EInvoice'
        verbose_name_plural = 'EInvoices'

    def __str__(self):
        return f'{self.documentType} - {self.track_id}'
