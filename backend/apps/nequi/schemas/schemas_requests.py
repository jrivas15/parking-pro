from datetime import datetime, timezone
from ..utils.utilis import generar_id_alfanumerico
from django.conf import settings
# from apps.parking_settings.models import DatosParqueadero

DatosParqueadero = {}

if settings.NEQUI_SANDBOX:
  code = 'NIT_1'
else:
  code = f'NIT_{DatosParqueadero.objects.first().nit}'


def get_format_date() -> str:
    # Obtener la fecha y hora actuales en UTC 
    fecha_actual = datetime.now(timezone.utc) 
    # Convertir la fecha a formato ISO 8601 con milisegundos y 'Z' al final 
    fecha_iso = fecha_actual.isoformat(timespec='milliseconds').replace('+00:00', 'Z') 
    return fecha_iso

def generate_qr(message_ID:str, client_id:str, value:str):
   
      
    return {
        "RequestMessage": {
          "RequestHeader": {
            "Channel": "PQR03-C001",
            "RequestDate": get_format_date(),
            "MessageID": message_ID,
            "ClientID": client_id,
            "Destination": {
              "ServiceName": "PaymentsService",
              "ServiceOperation": "generateCodeQR",
              "ServiceRegion": "C001",
              "ServiceVersion": "1.2.0"
            }
          },
        "RequestBody": {
          "any": {
            "generateCodeQRRQ": {
              "code": code,
              "value": f"{value}",
              "reference1": "Parking",
              "reference2": "reference2",
              "reference3": "reference3"
                    }
                }
            }
            }
        }

def status_payment(message_ID:str, client_id:str, codeQR:str):
    return {
    "RequestMessage": {
    "RequestHeader": {
      "Channel": "PQR03-C001",
      "RequestDate": get_format_date(),
      "MessageID": message_ID,
      "ClientID": client_id,
      "Destination": {
        "ServiceName": "PaymentsService",
        "ServiceOperation": "getStatusPayment",
        "ServiceRegion": "C001",
        "ServiceVersion": "1.0.0"
      }
    },
    "RequestBody": {
      "any": {
        "getStatusPaymentRQ": {
          "codeQR": codeQR
            }
          }
        }
      }
    }


def refund_payment(client_id:str, codeQR:str, phone:str, value:float):
    return {
  "RequestMessage": {
    "RequestHeader": {
      "Channel": "PQR03-C001",
      "RequestDate": get_format_date(),
      "MessageID": generar_id_alfanumerico(),
      "ClientID": client_id,
      "Destination": {
        "ServiceName": "reverseServices",
        "ServiceOperation": "reverseTransaction",
        "ServiceRegion": "C001",
        "ServiceVersion": "1.0.0"
      }
    },
    "RequestBody": {
      "any": {
        "reversionRQ": {
          "qrValue": codeQR,
          "phoneNumber": phone,
          "value": str(value),
          "code": code
        }
      }
    }
  }
}