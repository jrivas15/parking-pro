from django.db.models import Q
from ..models import Mensualidades, PagosMens
from datetime import datetime, timedelta

def is_mensualidad(placa:str) -> dict:
    #* VERIFICAR SI LA PLACA TIENE UNA MENSUALIDAD ACTIVA
    try:
        mensualidad = Mensualidades.objects.get(Q(placa = placa) | Q(cod_tarjeta = placa) | Q(placas_adicionales__icontains=placa))
        if not mensualidad:
            return {"is_mens": False, "mora": False, "canPass": False}
        #* Validar si esta al dia
        mora = mensualidad.mora
        activo = mensualidad.activo
        if mora == 0 and activo == 1:  #* al dia
            return {"is_mens": True, "mora": False, "canPass": True}
        else: #* Revisar fecha de vencimiento   
            ultimo_pago = PagosMens.objects.filter(placa=placa).order_by('-recibo').first()
            # print(ultimo_pago.fecha_desde)
            if ultimo_pago:
                fecha_vencimiento = ultimo_pago.fecha_desde + timedelta(days=5)  #* Agregar 5 dias para considerar el día del vencimiento como válido
                fecha_actual = datetime.now().date()
                if fecha_actual <= fecha_vencimiento:
                    return {"is_mens": True, "mora": True, "canPass": True}

            return {"is_mens": True, "mora": True, "canPass": False}
    except:
        return {"is_mens": False, "mora": False, "canPass": False}
      