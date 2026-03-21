from django.urls import path, include
from rest_framework import routers
from .api import VehicleViewSet

router = routers.DefaultRouter()
router.register('', VehicleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
