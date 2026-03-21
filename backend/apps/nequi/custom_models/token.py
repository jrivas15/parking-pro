import asyncio
from .nequi_config import NequiConfig
from base64 import b64encode
import requests
from datetime import datetime, timedelta

class Token :
    def __init__(self, nequi_config:NequiConfig):
        self.expires_at = None
        self.type = None
        self.token = None
        self.nequi_config = nequi_config

    def auth(self): 
        try:
            authorization_b64 =  b64encode(f'{self.nequi_config.accessKey}:{self.nequi_config.secretKey}'.encode('utf-8'))
            authorization  =  f'Basic {authorization_b64.decode("utf-8")}'
            headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Authorization': authorization
                };
            endpoint = f'{self.nequi_config.auth_uri}?grant_type={self.nequi_config.auth_grant_type}'
            response = requests.post(endpoint, headers=headers)
            if response.status_code == 200: 
                data_response = response.json()
                print('Autenticación NEQUI exitosa') 
                # print('Respuesta del servidor:', data_response) 
                self.token = data_response["access_token"]
                now = datetime.now()
                self.expires_at = now + timedelta(seconds=int(data_response["expires_in"]))
                self.type = data_response["token_type"]
                return True
            else: 
                print('Error en la solicitud:', response.status_code) 
                print('Detalles:', response.text)
                return False
        except Exception as e:
            print(f'ERROR AUTH NEQUI EXCEPTION: {e}')
            return False

    def is_valid_token(self):
        if not self.expires_at:
            return False
        return  datetime.now() < self.expires_at
    
    def get(self,full=True):
        if not self.is_valid_token(): #No es valido o expiró
            print('renovando token nequi...')
            ok = self.auth() #Intento reautenticar
            if not ok:
                return False
            else:
                if full:
                    return f'{self.type} {self.token}'
                else:
                    return self.token 
        else: # Es valido
            if full:
                return f'{self.type} {self.token}'
            else:
                return self.token