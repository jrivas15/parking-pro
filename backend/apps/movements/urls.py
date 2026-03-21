from django.urls import path, include
from rest_framework import routers
from .api import MovementViewSet

router = routers.DefaultRouter()
router.register('', MovementViewSet)

urlpatterns = [
    path('', include(router.urls)),
]