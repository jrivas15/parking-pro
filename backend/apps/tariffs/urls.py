from django.urls import path, include
from rest_framework import routers
from .api import TariffViewSet

router = routers.DefaultRouter()
router.register('', TariffViewSet, 'tariffs')

urlpatterns = [
    path('', include(router.urls)),
]