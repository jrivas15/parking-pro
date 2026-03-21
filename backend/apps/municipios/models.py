from django.db import models


class Municipio(models.Model):
    dptoCode = models.CharField(max_length=10, unique=True)
    dpto = models.CharField(max_length=100)
    municipioCode = models.CharField(max_length=10, unique=True)
    municipio = models.CharField(max_length=100)

    class Meta:
        db_table = 'municipios'
        verbose_name = 'Municipio'
        verbose_name_plural = 'Municipios'
        indexes = [
            models.Index(fields=['dpto'], name='idx_municipio_depto'),
            models.Index(fields=['municipio'], name='idx_municipio_municipio'),
        ]
