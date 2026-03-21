from django.urls import path
from .api import (
    DailySalesReport,
    SalesReportByRange,
    SalesReportByUser,
    SalesReportByPaymentMethod,
)

urlpatterns = [
    path('daily/', DailySalesReport.as_view(), name='daily-sales-report'),
    path('range/', SalesReportByRange.as_view(), name='sales-report-by-range'),
    path('by-user/', SalesReportByUser.as_view(), name='sales-report-by-user'),
    path('by-payment-method/', SalesReportByPaymentMethod.as_view(), name='sales-report-by-payment-method'),
]
