from django.db import models

# Create your models here.
class Mensualidades(models.Model):
    placa = models.CharField(primary_key=True, max_length=15)
    propietario = models.CharField(max_length=80)
    direccion = models.CharField(max_length=45, blank=True, null=True)
    telefono = models.CharField(max_length=45, blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=0)
    fecha_inicio = models.DateField()
    fecha_venc = models.DateField()
    observacion = models.CharField(max_length=100, blank=True, null=True)
    mora = models.IntegerField(blank=True, null=True)
    activo = models.IntegerField()
    cod_tarjeta = models.CharField(max_length=45, blank=True, null=True)
    correo_e = models.CharField(max_length=45, blank=True, null=True)
    placas_adicionales = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        db_table = 'mensualidades'

# class PagosMens(models.Model):
#     recibo = models.AutoField(primary_key=True)
#     placa = models.CharField(max_length=15)
#     fecha = models.DateField(blank=True, null=True)
#     hora = models.TimeField(blank=True, null=True)
#     facturado_por = models.CharField(max_length=45)
#     medio_pago = models.CharField(max_length=60)
#     descuento = models.DecimalField(max_digits=10, decimal_places=2)
#     valor_base = models.DecimalField(max_digits=12, decimal_places=2)
#     valor_iva = models.DecimalField(max_digits=11, decimal_places=2)
#     total = models.DecimalField(max_digits=12, decimal_places=2)
#     concepto = models.CharField(max_length=100)
#     estado_pago = models.CharField(max_length=20)
#     fecha_desde = models.DateField(blank=True, null=True)
#     fecha_vencimiento = models.DateField()

#     class Meta:
#         managed = False
#         db_table = 'pagos_mens'