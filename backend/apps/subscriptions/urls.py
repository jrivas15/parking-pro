from django.urls import path, include
from rest_framework import routers
from .api import SubscriptionViewSet

router = routers.DefaultRouter()
router.register('', SubscriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
