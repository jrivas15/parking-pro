from django.urls import path, include
from rest_framework import routers
from .views import login_view, signup_view, me_view, logout_view
from .api import UserViewSet

router = routers.DefaultRouter()
router.register('', UserViewSet, basename='user')

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('signup/', signup_view, name='signup'),
    path('me/', me_view, name='me'),
    path('', include(router.urls)),
]