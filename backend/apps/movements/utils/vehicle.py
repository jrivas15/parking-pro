from django.db.models import Q
from apps.vip.models import Vip
class Vehicle():
    def __init__(self, placa:str, card:str | None=None) -> None:
        self.plate = placa
        #*ESTABLECER TIPO DE VEHICULO
        self.type_v = self.get_type_vehicle()
        # #*ESTABLECER ESPECIALIADA VIP NORMAL MENS OTRO
        self.motivo = ''
        self.speciality = self.set_especialidad()
        if self.speciality != None and self.type_v != None:
          self.is_valid_vehicle = True
        else:
          self.is_valid_vehicle = False

    def set_especialidad(self): # DETERMINAR SI ES VIP O MENSUALIDAD o vetado
        param1 = Q(placa = self.plate )
        param2 = Q(tarjeta = self.plate )
        reg_vip = Vip.objects.filter(param1 | param2).count()
        # print(reg_vip)
        if reg_vip > 0:
            return 'VIP'

        # mensualidad = is_mensualidad(self.placa)
        # if mensualidad["is_mens"]:
        #     if self.tipo_v == 'V':
        #         self.tipo_v = 'MC'
        #     elif self.tipo_v == 'M':
        #         self.tipo_v = 'MM'

        #     return 'MENS'
        # elif is_vetada(self.placa):
        #     info = leer_vetadas_by_placa(self.placa)
        #     self.motivo = info[3]
        #     return 'VETADA'
        else:
            return 'NORMAL'

    def get_type_vehicle(self):    
        if self.is_car() or 'IDCAR' in self.plate:
             return 'C'
        elif self.is_motorbike() or  'MOTO' in self.plate or self.is_motorbike():
             return 'M'
        elif self.is_carro_moto():
             return 'C'
        # elif _topologia_carro(placa, n_letras=1): # CAMION
        #      return 'CA'
        # elif _topologia_carro(placa, n_letras=2):#Consulado
        #      # return 'CO'
        #      return 'V'
        elif self.is_bike(): # BICICLETA
             return 'B'     
        # elif _topologia_carro(placa, n_letras=3, max_length=7):# VEHICULO ECUATORIANO
        #     return 'EC'
        else:
             return None


    def is_bike(self):
        if self.plate in ['BIKE', 'BICI']:
            return True
        else:            
            return False   
     
    def is_car(self, n_chars=3, max_length = 6):
        chars = self.plate[0:n_chars]
        numbers = self.plate[n_chars:]
        if chars.isalpha() and len(self.plate)==max_length:
             pass
        else:
             return False
        #Evaluar numeros
        if numbers.isdigit():
             return True
        else:
             return False

    def is_motorbike(self):
        plate_length = len(self.plate)
        chars = self.plate[0:3]
        numbers = self.plate[3:5]
        final_char= self.plate[5:6]
        if not chars.isalpha() and plate_length==6:
             return False
        #Evaluar numeros
        if not numbers.isdigit():
             return False
        #Evaluar letra final
        if plate_length == 5:
            return True
        elif plate_length == 6 and final_char.isalpha():
             return True
        else:
             return False

    def is_carro_moto(self):
         #tiene 3 letras y 3 numeros
        numbers = self.plate[0:3]
        chars = self.plate[3:]
        if numbers.isdigit() and len(self.plate)==6:
             pass
        else:
             return False

        if chars.isalpha():
             return True
        else:
             return False
