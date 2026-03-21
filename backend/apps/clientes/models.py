from django.db import models

class Clientes(models.Model):
    razon_social = models.CharField(max_length=100)
    tipo_persona = models.CharField(max_length=12)
    tipo_doc = models.CharField(max_length=45)
    n_doc = models.CharField(max_length=45)
    dv = models.CharField(max_length=1, blank=True, null=True)
    telefono = models.CharField(max_length=45, blank=True, null=True)
    direccion = models.CharField(max_length=60, blank=True, null=True)
    cod_postal = models.CharField(max_length=45, blank=True, null=True)
    depto = models.CharField(max_length=80, blank=True, null=True)
    cod_depto = models.CharField(max_length=20, blank=True, null=True)
    municipio = models.CharField(max_length=80, blank=True, null=True)
    cod_municipio = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=150, blank=True, null=True)
    tributo = models.CharField(max_length=60)
    responsabilidades = models.CharField(max_length=45)
    placa = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        db_table = 'clientes'