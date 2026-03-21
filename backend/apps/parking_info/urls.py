from django.urls import path, include
from rest_framework import routers

from apps.users.api import UserViewSet
from .api import ParkingInfoViewSet

router = routers.DefaultRouter()
router.register('', ParkingInfoViewSet, basename='parking-info')

urlpatterns = [
     path('', include(router.urls))
]