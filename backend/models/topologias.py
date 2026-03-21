# Placa colombiana -> V (AAA123)
# Placa colombiana -> M (AAA12A)
# Placa colombiana -> CM (123AAA)
# Placa Camiones   -> CA (R12345)
# BICI             -> BICI001

def topologias_placa(placa: str):    
     if _topologia_carro(placa) or 'IDCAR' in placa:
          return 'V'
     elif _topologia_moto(placa) or  'MOTO' in placa or _topologia_moto2(placa):
          return 'M'
     elif _topologia_carro_moto(placa):
          return 'CM'
     elif _topologia_carro(placa, n_letras=1): # CAMION
          return 'CA'
     elif _topologia_carro(placa, n_letras=2):#Consulado
          # return 'CO'
          return 'V'
     elif _topologia_bici(placa, n_letras=4, max_length=7): # BICICLETA
          return 'B'     
     #elif _topologia_carro(placa, n_letras=3, max_length=7):# VEHICULO ECUATORIANO
     #     return 'EC'
     else:
          return False


def _topologia_bici(placa='BICI123',n_letras=3, max_length = 6):
     letras = placa[0:n_letras]
     numeros = placa[n_letras:]
     if letras.isalpha() and len(placa)==max_length and letras == 'BICI':
         pass
     else:
         return False
     #Evaluar numeros
     if numeros.isdigit():
         return True
     else:
         return False
     
def _topologia_carro(placa='ABC123',n_letras=3, max_length = 6):
    letras = placa[0:n_letras]
    numeros = placa[n_letras:]
    if letras.isalpha() and len(placa)==max_length:
         pass
    else:
         return False
    #Evaluar numeros
    if numeros.isdigit():
         return True
    else:
         return False

def _topologia_moto(placa='ABC12A'):
    letras = placa[0:3]
    numeros = placa[3:5]
    letra_final = placa[5:6]
    if letras.isalpha() and len(placa)==6:
         pass
    else:
         return False
    #Evaluar numeros
    if numeros.isdigit():
         pass
    else:
         return False
    #Evaluar letra final
    if letra_final.isalpha():
         return True
    else:
         return False

def _topologia_moto2(placa='ABC12A'):
    letras = placa[0:3]
    numeros = placa[3:5]

    if letras.isalpha() and len(placa)==5:
         pass
    else:
         return False
    #Evaluar numeros
    if numeros.isdigit():
         return True
    else:
         return False
    
def _topologia_carro_moto(placa='111AAA'):
     #tiene 3 letras y 3 numeros
    numeros = placa[0:3]
    letras = placa[3:]
    if numeros.isdigit() and len(placa)==6:
         pass
    else:
         return False
    
    if letras.isalpha():
         return True
    else:
         return False