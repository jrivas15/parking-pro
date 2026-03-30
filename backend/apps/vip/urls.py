from django.urls import path, include
from rest_framework import routers
from .api import VipViewSet

router = routers.DefaultRouter()
router.register('', VipViewSet, basename='vip')

urlpatterns = [
    path('', include(router.urls)),
]
