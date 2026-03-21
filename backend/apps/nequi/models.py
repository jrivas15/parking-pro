from django.db import models

# Create your models here.
class NequiTxn(models.Model):
    id = models.AutoField(primary_key=True)
    recibo = models.PositiveIntegerField()
    init_time = models.DateTimeField(auto_now_add=True) 
    end_time = models.DateTimeField(null=True)
    user = models.CharField(max_length=100, null=False)
    client_id = models.CharField(max_length=100)
    value = models.FloatField(null=False)
    status = models.CharField(max_length=50, null=False, choices=[('WAITING','WAITING'),('SUCCESS','SUCCESS'),('FAILED','FAILED')])
    code_qr = models.CharField(max_length=100, default='', null = False)
    msg_desc = models.CharField(max_length=200, null=True)

    class Meta:
        db_table = 'nequi_txn'        