from django.urls import path, include
from rest_framework import routers
from .api import CustomerViewSet

router = routers.DefaultRouter()
router.register('', CustomerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
