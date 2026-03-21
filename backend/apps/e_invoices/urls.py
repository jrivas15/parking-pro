from django.urls import path, include
from rest_framework import routers
from .api import EInvoiceViewSet

router = routers.DefaultRouter()
router.register('', EInvoiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
