from django.urls import path, include
from rest_framework import routers
from .api import PaymentMethodViewSet

router = routers.DefaultRouter()
router.register('', PaymentMethodViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
