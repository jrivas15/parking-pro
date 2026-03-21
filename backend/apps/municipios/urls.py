from django.urls import path, include
from rest_framework import routers
from .api import MunicipioViewSet

router = routers.DefaultRouter()
router.register('', MunicipioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
