"""
URL configuration for parking project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include("apps.users.urls")),
    path('nequi/', include('apps.nequi.urls')),
    path('tariffs/', include('apps.tariffs.urls')),
    path('parking-info/', include('apps.parking_info.urls')),
    path('movements/', include('apps.movements.urls')),
    path('sales/', include('apps.sales.urls')),
    path('customers/', include('apps.customers.urls')),
    path('e-invoices/', include('apps.e_invoices.urls')),
    path('payment-methods/', include('apps.payment_methods.urls')),
    path('sales-reports/', include('apps.sales_reports.urls')),
    path('taxes/', include('apps.taxes.urls')),
    path('subscriptions/', include('apps.subscriptions.urls')),
    path('vehicles/', include('apps.vehicles.urls')),
    path('municipios/', include('apps.municipios.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
