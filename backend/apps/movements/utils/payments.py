
import math
from apps.tariffs.models import Tariff
from datetime import datetime, timedelta
from django.utils import timezone


class PaymentCalculator:
    def __init__(self, tariff:Tariff, t0:datetime ) -> None:
        self.t1 = timezone.now()
        self.t1 = self.t1.replace(microsecond=0)
        # Asegurar que t0 tenga timezone
        if timezone.is_naive(t0):
            t0 = timezone.make_aware(t0)
        parking_data = self.calc_parking_time(t0, self.t1)
        self.days = parking_data["days"]
        self.hours = parking_data["hours"]
        self.minutes = parking_data["minutes"]
        self.parking_time_msg = parking_data["message"]
        self.tariff = tariff
        self.total_payment = 0.0
        self.results = []
        #Tiempo total en horas
        self.t = (24 * self.days) + self.hours + (self.minutes/60.0)
        self.t0 = t0
        #*Valor total a pagar
        print(tariff.tariffType)
        if tariff.tariffType == Tariff.TariffType.SENCILLA:
            self.sencilla()
        elif tariff.tariffType == Tariff.TariffType.POR_SEGMENTOS:
            self.total_payment, _ = self.segmento()
        # elif tariff.tariffType == 'Por horario':
        #     self.total_payment = self.por_horario()
        elif tariff.tariffType == Tariff.TariffType.APARTIR_DE_N_HORAS:
            self.total_payment = self.apartir_de_n_horas()
            
    def calc_parking_time(self, t0:datetime, t1:datetime) -> dict:
        if timezone.is_naive(t0):
            t0 = timezone.make_aware(t0)
        if timezone.is_naive(t1):
            t1 = timezone.make_aware(t1)
        days = (t1 - t0).days
        minutes = (t1 - t0).seconds/60
        hours = minutes/60
        decimal, entera = math.modf(hours)
        minutes = decimal*60
        hours = int(entera)
        if days  < 1:   
            msg = f"{hours} Horas + {math.ceil(minutes)} Minutos"
            
        elif days == 1:
            msg = f"{days} Día + {hours} Horas + {math.ceil(minutes)} Minutos"
        else:
            msg = f"{days} Días + {hours} Horas + {math.ceil(minutes)} Minutos"

        return {"days": days, "hours": hours, "minutes": minutes, "message": msg} 
    
    def sencilla(self):
        if self.t < self.tariff.startTimeCharge/60:   # Dentro del período de gracia
            self.total_payment = 0
        elif self.t <= 1:                              # Primera hora (incluso si acaba de ingresar)
            self.total_payment = self.tariff.priceHour
        elif self.t >= (math.floor(self.t) + (self.tariff.startTimeAdditional/60)):
            self.total_payment = self.tariff.priceHour + self.tariff.priceHourAdditional*(math.ceil(self.t)- 1)
        else:
            self.total_payment = self.tariff.priceHour + self.tariff.priceHourAdditional*(math.floor(self.t)- 1)

        if self.tariff.maxPrice == 0:
            pass
        elif self.total_payment > self.tariff.maxPrice:
            self.total_payment = self.tariff.maxPrice
        self.results.append((self.t, self.total_payment))
        
    
    #*-------- X HORARIO --------
    def por_horario(self):
        # Definir el rango nocturno
        #todo hora e fin dinamicos
        HORA_INICIO_NOCTURNA = 18
        HORA_FIN_NOCTURNA = 8  
        TARIFA_INICIAL = self.tarifa.valor_x_hora
        TARIFA_NOCTURNA = self.tarifa.valor_nocturno
        hora_entrada = self.t0
        hora_salida = self.t1
        costo_total = 0
        tiempo_actual = hora_entrada
    
        while tiempo_actual < hora_salida:
            # Verificar si el tiempo actual está en la tarifa nocturna
            if (tiempo_actual.hour >= HORA_INICIO_NOCTURNA or tiempo_actual.hour < HORA_FIN_NOCTURNA):
                # Calcular el fin del periodo nocturno o el fin del estacionamiento, lo que ocurra primero
                if tiempo_actual.hour >= HORA_INICIO_NOCTURNA:
                    fin_periodo_nocturno = tiempo_actual.replace(hour=HORA_FIN_NOCTURNA, minute=0, second=0,
                                                             microsecond=0) + timedelta(days=1)
                else:
                    fin_periodo_nocturno = tiempo_actual.replace(hour=HORA_FIN_NOCTURNA, minute=0, second=0, microsecond=0)

                if fin_periodo_nocturno > hora_salida:
                    fin_periodo_nocturno = hora_salida

                costo_total += TARIFA_NOCTURNA
                tiempo_actual = fin_periodo_nocturno
            else:
                # Calcular el fin del periodo diurno o el fin del estacionamiento, lo que ocurra primero
                if tiempo_actual.hour < HORA_INICIO_NOCTURNA:
                    fin_periodo_diurno = tiempo_actual.replace(hour=HORA_INICIO_NOCTURNA, minute=0, second=0, microsecond=0)
                else:
                    fin_periodo_diurno = tiempo_actual + timedelta(hours=1)

                if fin_periodo_diurno > hora_salida:
                    fin_periodo_diurno = hora_salida

                horas_diurnas = math.ceil((fin_periodo_diurno - tiempo_actual).total_seconds() / 3600)
                # print(horas_diurnas)
                if horas_diurnas <= 1:
                    costo_total += TARIFA_INICIAL
                else:
                    costo_total += self.calcular_tarifa_normal(horas_diurnas)
                tiempo_actual = fin_periodo_diurno

        return costo_total
        
    # Calcular la tarifa de día normal
    def calcular_tarifa_normal(self, horas):
        TARIFA_INICIAL = self.tarifa.valor_x_hora
        TARIFA_HORA_ADICIONAL = self.tarifa.valor_hora_adicional
        return TARIFA_INICIAL + (horas - 1) * TARIFA_HORA_ADICIONAL
    #*------------------------------------------
    def segmento(self):
        ciclo = 24
        total = 0
        segmentos_completos = math.ceil( self.t / self.tarifa.segmento)
        total = self.tarifa.valor_x_hora * segmentos_completos
        return total, ''
    
    def apartir_de_n_horas(self):
        n = self.tarifa.segmento;
        total = 0;
        if self.t <= n :
            total += 0;
        else:
            self.t = self.t - n
            total += self.sencilla()[0]
        
        return total