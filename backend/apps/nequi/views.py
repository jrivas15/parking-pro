from django.http import HttpRequest, HttpResponse, JsonResponse
from .custom_models.nequi_config import NequiConfig
from .custom_models.token import Token
import json
import requests 
from .schemas import schemas_requests
from .models import NequiTxn
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from .utils.utilis import generar_id_alfanumerico
from django.conf import settings


is_nequi_active = settings.NEQUI_ACTIVE

if is_nequi_active:
    nequi_config = NequiConfig()
    token = Token(nequi_config)
    token.auth()
else:
    nequi_config = None
    token = None

# nequi_config = None
# token = None

status_payment={'33': 'PENDIENTE', '35': 'REALIZADO'}

def status_nequi_service(request:HttpRequest):
    global token
    if request.method != 'GET':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    if token.is_valid_token(): 
        return JsonResponse({'status': 'OK'}, status=200)
    else:
        try:
            token = Token(nequi_config)
            token.auth()
            if token.is_valid_token():
                return JsonResponse({'status': 'OK'}, status=200)
            else:
                return JsonResponse({'status': 'SERVICE UNAVAILABLE'}, status=503)
        except Exception as e:
            return JsonResponse({'status': 'SERVICE UNAVAILABLE', 'error': f'{e}'}, status=503)


@csrf_exempt
def get_code_qr(request:HttpRequest):
    rest_endpoint = f"/payments/v2/-services-paymentservice-generatecodeqr"
    nequi_txn = None
    try:
        authorization = token.get()
        # print(authorization)
        headers = {
            'Content-Type'  : 'application/json',
            'Accept'        : 'application/json',
            'Authorization' : authorization,
            'x-api-key'     : nequi_config.apiKey,
        }
        url = f'{nequi_config.api_base_path}{rest_endpoint}'
        data = json.loads(request.body)
        recibo = data['recibo']
        user = data['user']
        client_id = data['clientID']
        value = data['value']
        nequi_txn = NequiTxn.objects.create(recibo = recibo, user=user, client_id=client_id, value=value, status='WAITING')            
        message_ID = generar_id_alfanumerico()
        # print(data)
        request_body = schemas_requests.generate_qr(message_ID, client_id, value)
        print(request_body)
        response =  requests.post(url, headers=headers, json=request_body)
        if response.status_code == 200: 
            print('Solicitud exitosa') 
            print('Respuesta del servidor:', response.json()) 
            qr = response.json()['ResponseMessage']['ResponseBody']['any']['generateCodeQRRS']['qrValue']
            nequi_txn.code_qr = qr
            print(qr)
            return JsonResponse({'QR': qr, "id": nequi_txn.id })
        else: 
            print('Error en la solicitud:', response.status_code)
            print('Detalles:', response.text)
            nequi_txn.status = 'FAILED'
            return JsonResponse({'QR': 'None'}, status=400)
    except Exception as e:
        if nequi_txn:
            nequi_txn.status = 'FAILED'
            print('Error get qr: ', e)
        return JsonResponse({"Error": f"{e}"}, status=500)
    finally:
        if nequi_txn:
            nequi_txn.end_time = timezone.now()
            nequi_txn.save()

def get_status_payment(request):
    txn_id = request.GET.get("id", None)
    if txn_id is None:
        return JsonResponse({'error': 'Parámetro requerido "required" no proporcionado'}, status=400)
    rest_endpoint = f"/payments/v2/-services-paymentservice-getstatuspayment"
    nequi_txn = None
    try:
        authorization = token.get()
        headers = {
        'Content-Type'  : 'application/json',
        'Accept'        : 'application/json',
        'Authorization' : authorization,
        'x-api-key'     : nequi_config.apiKey,
        }
        nequi_txn = NequiTxn.objects.get(id=txn_id)
        message_ID = generar_id_alfanumerico()
        request_body = schemas_requests.status_payment(message_ID, nequi_txn.client_id, nequi_txn.code_qr)
        print(request_body)
        url = f'{nequi_config.api_base_path}{rest_endpoint}'
        response =  requests.post(url, headers=headers, json=request_body)
        if response.status_code == 200: 
            print('Solicitud exitosa') 
            print('Respuesta del servidor:', response.json()) 
            response_json = response.json()
            status_txn = response_json['ResponseMessage']['ResponseHeader']['Status']['StatusDesc']
            if status_txn =='SUCCESS':
                status = response_json['ResponseMessage']['ResponseBody']['any']['getStatusPaymentRS']['status']
                value = response_json['ResponseMessage']['ResponseBody']['any']['getStatusPaymentRS']['value']
                if status_payment[status] == 'REALIZADO':
                    nequi_txn.status = status_txn
                return JsonResponse({'statusCode': status,'status': status_payment[status], 'value': value})
            else:
                nequi_txn.msg_desc = status_txn
                if status_txn == "La transacción esta cancelada":
                    nequi_txn.status = 'FAILED'
                return JsonResponse({"statusTxn": status_txn})    
        else: 
            print('Error en la solicitud:', response.status_code)
            print('Detalles:', response.text)
            return JsonResponse({'error': response.text}, status=400)
    except Exception as e:
        print(f'Getting status NEQUI EXCEPTION: {e} ')
        return JsonResponse({'error': f'{e}'}, status=500)
    finally:
        if nequi_txn:
            nequi_txn.save()

@csrf_exempt
def reverse_payment(request:HttpRequest):

    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    url = f"payments/v2/-services-reverseservices-reversetransaction"
    nequi_txn = None
    try:
       
        authorization = token.get()
        headers = {
        'Content-Type'  : 'application/json',
        'Accept'        : 'application/json',
        'Authorization' : authorization,
        'x-api-key'     : nequi_config.apiKey,
        }
        data = json.loads(request.body)
        txn_id = data['id']
        phone = data['phone']
        nequi_txn = NequiTxn.objects.get(id=txn_id)
        request_body = schemas_requests.refund_payment(generar_id_alfanumerico(), nequi_txn.code_qr, phone, nequi_txn.value)
        print(request_body)
        url = f'{nequi_config.api_base_path}/{url}'
        response =  requests.post(url, headers=headers, json=request_body)
        if response.status_code == 200: 
            print('Solicitud exitosa') 
            print('Respuesta del servidor:', response.json()) 
            response_json = response.json()
            status_txn = response_json['ResponseMessage']['ResponseHeader']['Status']['StatusDesc']
            if status_txn =='SUCCESS':
                nequi_txn.status = 'REVERSED'
                nequi_txn.msg_desc = 'Transacción reversada exitosamente'
                return JsonResponse({'status': 'REVERSED', 'message': 'Transacción reversada exitosamente'})
            else:
                nequi_txn.msg_desc = status_txn
                return JsonResponse({"statusTxn": status_txn})
        else: 
            return JsonResponse({'error': response.text}, status=400)
    except Exception as e:
        print(f'REFUNDING NEQUI EXCEPTION: {e} ')
        return JsonResponse({'error': f'{e}'}, status=500)
    finally:
        if nequi_txn:
            nequi_txn.end_time = timezone.now()
            nequi_txn.save()

