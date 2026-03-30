from django.urls import path, include
from rest_framework import routers
from .api import SubscriptionViewSet, SubscriptionPaymentViewSet

router = routers.DefaultRouter()
router.register('payments', SubscriptionPaymentViewSet, basename='subscription-payments')
router.register('', SubscriptionViewSet, basename='subscriptions')

urlpatterns = [
    path('', include(router.urls)),
]
