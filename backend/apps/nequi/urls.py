from django.urls import path
from .views import get_code_qr, get_status_payment, reverse_payment, status_nequi_service

urlpatterns = [
    path('qr/', get_code_qr, name='GET QR CODE' ),
    path('get-status-payment', get_status_payment, name='GET STATUS PAYMENT FROM QR' ),
    path('status-service/', status_nequi_service, name='GET STATUS NEQUI SERVICE' ),
    path('reverse-payment/', reverse_payment, name='REVERSE PAYMENT' ),
]