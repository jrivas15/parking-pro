from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MaxValueValidator, MinValueValidator



class Tariff(models.Model):
    class TariffType(models.TextChoices):
        SENCILLA = '1', 'Sencilla'
        POR_SEGMENTOS = '2', 'Por segmento'
        APARTIR_DE_N_HORAS = '3', 'Apartir de n horas'
        # POR_HORARIO = 'Por horario', 'Por horario'

    name = models.CharField(max_length=100)
    tariffType = models.CharField(max_length=2, choices=TariffType.choices, default=TariffType.SENCILLA)
    vehicleType = models.CharField(max_length=2)
    priceHour = models.DecimalField(max_digits=10, decimal_places=2)
    priceHourAdditional = models.DecimalField(max_digits=10, decimal_places=2)
    maxPrice = models.DecimalField(max_digits=10, decimal_places=2)
    segment = models.IntegerField()
    startTimeCharge = models.IntegerField()
    startTimeAdditional = models.IntegerField()
    enableDays = ArrayField(
        base_field=models.IntegerField(
            validators=[MinValueValidator(1), MaxValueValidator(7)]
        ),
        blank=True,
        default=list,
        help_text="Días de la semana: 1=Lunes, 2=Martes, ..., 7=Domingo"
    )
    enable = models.BooleanField(default=True)