from django.conf import settings



class NequiConfig:
    def __init__(self):
        self.accessKey    = settings.NEQUI_ACCESS_KEY
        self.secretKey    = settings.NEQUI_SECRET_KEY
        self.apiKey       = settings.NEQUI_API_KEY
        self.auth_grant_type   = 'client_credentials'
        if settings.NEQUI_SANDBOX:
            print("NEQUI EN MODO SANDBOX")
            self.api_base_path       = 'https://api.sandbox.nequi.com'
            self.auth_uri          = 'https://oauth.sandbox.nequi.com/oauth2/token'
        else:
            print("NEQUI EN MODO PRODUCCION")
            self.api_base_path       = 'https://api.nequi.com'
            self.auth_uri          = 'https://oauth.nequi.com/oauth2/token'
        
        self.backend_api  = f"{self.api_base_path}/payments/v2"