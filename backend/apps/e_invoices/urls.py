from django.urls import path, include
from rest_framework import routers
from .api import EInvoiceViewSet, EInvoiceAPIConfigViewSet

router = routers.DefaultRouter()
router.register('api-config', EInvoiceAPIConfigViewSet, basename='einvoice-api-config')
router.register('', EInvoiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
