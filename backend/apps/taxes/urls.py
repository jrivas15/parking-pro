from django.urls import path, include
from rest_framework import routers
from .api import TaxViewSet

router = routers.DefaultRouter()
router.register('', TaxViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
