from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from apps.sales.models import Sale


class DailySalesReport(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        date = request.query_params.get('date')
        if date:
            from datetime import datetime
            target_date = datetime.strptime(date, '%Y-%m-%d').date()
        else:
            target_date = timezone.now().date()

        sales = Sale.objects.filter(
            movement__exitTime__date=target_date
        )

        report = sales.aggregate(
            total_sales=Count('id'),
            total_income=Sum('total'),
            total_tax=Sum('taxValue'),
            total_subtotal=Sum('subtotal'),
            total_discount=Sum('discount'),
        )

        # Reemplazar None por 0
        for key in report:
            if report[key] is None:
                report[key] = 0

        report['date'] = target_date

        return Response(report)


class SalesReportByRange(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response({'error': 'start_date and end_date are required'}, status=400)

        from datetime import datetime
        start = datetime.strptime(start_date, '%Y-%m-%d').date()
        end = datetime.strptime(end_date, '%Y-%m-%d').date()

        sales = Sale.objects.filter(
            movement__exitTime__date__gte=start,
            movement__exitTime__date__lte=end
        )

        report = sales.aggregate(
            total_sales=Count('id'),
            total_income=Sum('total'),
            total_tax=Sum('taxValue'),
            total_subtotal=Sum('subtotal'),
            total_discount=Sum('discount'),
        )

        for key in report:
            if report[key] is None:
                report[key] = 0

        report['start_date'] = start
        report['end_date'] = end

        return Response(report)


class SalesReportByUser(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        date = request.query_params.get('date')
        if date:
            from datetime import datetime
            target_date = datetime.strptime(date, '%Y-%m-%d').date()
        else:
            target_date = timezone.now().date()

        report = Sale.objects.filter(
            movement__exitTime__date=target_date
        ).values(
            'user__id', 'user__username'
        ).annotate(
            total_sales=Count('id'),
            total_income=Sum('total'),
        ).order_by('-total_income')

        return Response(list(report))


class SalesReportByPaymentMethod(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        date = request.query_params.get('date')
        if date:
            from datetime import datetime
            target_date = datetime.strptime(date, '%Y-%m-%d').date()
        else:
            target_date = timezone.now().date()

        report = Sale.objects.filter(
            movement__exitTime__date=target_date
        ).values(
            'paymentMethod__id', 'paymentMethod__name'
        ).annotate(
            total_sales=Count('id'),
            total_income=Sum('total'),
        ).order_by('-total_income')

        return Response(list(report))
