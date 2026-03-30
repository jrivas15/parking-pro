from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action

from apps.payment_methods.models import PaymentMethod
from apps.taxes.models import Tax
from apps.expenses.models import Expense
from .models import Sale
from .serializer import SaleSerializer, SaleWithMovementSerializer
from apps.sales_reports.models import SalesReport
from apps.movements.models import Movement
from apps.tariffs.models import Tariff
from apps.movements.utils.payments import PaymentCalculator
from django.db import transaction
from django.db.models import Sum, Count
from django.utils.dateparse import parse_datetime
from django.utils import timezone
from django.http import HttpRequest

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SaleSerializer

    @action(detail=False, methods=['get'])
    def open_sales(self, request):
        sales = Sale.objects.filter(saleReport__isnull=True).order_by('-id')

        # Filtros opcionales
        date_from = request.query_params.get('dateFrom')
        date_to = request.query_params.get('dateTo')
        user_id = request.query_params.get('userID')
        payment_method_id = request.query_params.get('paymentMethodID')
        tariff_id = request.query_params.get('tariffID')
        vehicle_type = request.query_params.get('vehicleType')

        if date_from:
            dt_from = parse_datetime(date_from)
            if dt_from and timezone.is_naive(dt_from):
                dt_from = timezone.make_aware(dt_from)
            if dt_from:
                sales = sales.filter(movement__exitTime__gte=dt_from)
        if date_to:
            dt_to = parse_datetime(date_to)
            if dt_to and timezone.is_naive(dt_to):
                dt_to = timezone.make_aware(dt_to)
            if dt_to:
                sales = sales.filter(movement__exitTime__lte=dt_to)
        if user_id:
            sales = sales.filter(user__id=user_id)
        if payment_method_id:
            sales = sales.filter(paymentMethod__id=payment_method_id)
        if tariff_id:
            # print("Filtering by tariff ID:", tariff_id)
            sales = sales.filter(movement__tariff__id=tariff_id)
        if vehicle_type:
            # print("Filtering by vehicle type:", vehicle_type)
            sales = sales.filter(movement__vehicleType=vehicle_type)

        stats = sales.aggregate(
            nSales=Count('id'),
            totalSales=Sum('total'),
            totalDiscount=Sum('discount'),
            totalTax=Sum('taxValue'),
            totalSubtotal=Sum('subtotal'),
        )
        # Reemplazar None por 0
        for key in stats:
            if stats[key] is None:
                stats[key] = 0

        # Sumatoria por método de pago
        by_payment_method = (
            sales.filter(paymentMethod__isnull=False)
            .values('paymentMethod__id', 'paymentMethod__name')
            .annotate(total=Sum('total'), nSales=Count('id'))
            .order_by('-total')
        )
        by_payment_method1 = (
            sales.filter(paymentMethod1__isnull=False)
            .values('paymentMethod1__id', 'paymentMethod1__name')
            .annotate(total=Sum('paymentMethodValue1'), nSales=Count('id'))
            .order_by('-total')
        )
        by_payment_method2 = (
            sales.filter(paymentMethod2__isnull=False)
            .values('paymentMethod2__id', 'paymentMethod2__name')
            .annotate(total=Sum('paymentMethodValue2'), nSales=Count('id'))
            .order_by('-total')
        )

        stats['byPaymentMethod'] = list(by_payment_method)
        stats['byPaymentMethod1'] = list(by_payment_method1)
        stats['byPaymentMethod2'] = list(by_payment_method2)

        open_expenses = Expense.objects.filter(saleReport__isnull=True)
        expenses_total = open_expenses.aggregate(total=Sum('value'))['total'] or 0
        stats['totalExpenses'] = expenses_total

        expenses_by_payment_method = list(
            open_expenses.filter(paymentMethod__isnull=False)
            .values('paymentMethod__id', 'paymentMethod__name')
            .annotate(total=Sum('value'))
        )
        stats['expensesByPaymentMethod'] = expenses_by_payment_method

        serializer = SaleWithMovementSerializer(sales, many=True)
        return Response({
            'stats': stats,
            'sales': serializer.data,
        })

    @action(detail=False, methods=['post'])
    def close_sales(self, request:HttpRequest):
        with transaction.atomic():
            try:
                sales = Sale.objects.filter(saleReport__isnull=True).order_by('-id')
                date_from = request.query_params.get('dateFrom')
                date_to = request.query_params.get('dateTo')
                user_id = request.query_params.get('userID')
                payment_method_id = request.query_params.get('paymentMethodID')
                tariff_id = request.query_params.get('tariffID')
                vehicle_type = request.query_params.get('vehicleType')
                note  = request.data.get('note', '')

                if date_from:
                    dt_from = parse_datetime(date_from)
                    if dt_from and timezone.is_naive(dt_from):
                        dt_from = timezone.make_aware(dt_from)
                    if dt_from:
                        sales = sales.filter(movement__exitTime__gte=dt_from)
                if date_to:
                    dt_to = parse_datetime(date_to)
                    if dt_to and timezone.is_naive(dt_to):
                        dt_to = timezone.make_aware(dt_to)
                    if dt_to:
                        sales = sales.filter(movement__exitTime__lte=dt_to)
                if user_id:
                    sales = sales.filter(user__id=user_id)
                if payment_method_id:
                    sales = sales.filter(paymentMethod__id=payment_method_id)
                if tariff_id:
                    sales = sales.filter(movement__tariff__id=tariff_id)
                if vehicle_type:
                    sales = sales.filter(movement__vehicleType=vehicle_type)

                if not sales.exists():
                    return Response({'error': 'No hay ventas abiertas para cerrar.'}, status=status.HTTP_400_BAD_REQUEST)

                # Agregar totales de las ventas filtradas
                stats = sales.aggregate(
                    totalSales=Sum('total'),
                    totalDiscount=Sum('discount'),
                    totalTax=Sum('taxValue'),
                    totalSubtotal=Sum('subtotal'),
                )
                for key in stats:
                    if stats[key] is None:
                        stats[key] = 0

                # Gastos abiertos sin reporte
                open_expenses = Expense.objects.filter(saleReport__isnull=True)
                total_expenses = open_expenses.aggregate(total=Sum('value'))['total'] or 0

                # Crear el SalesReport
                sale_report = SalesReport.objects.create(
                    user=request.user,
                    note=note,
                    expenses=total_expenses,
                    discount=stats['totalDiscount'],
                    subtotal=stats['totalSubtotal'],
                    tax_value=stats['totalTax'],
                    total=stats['totalSales'],
                )

                # Asociar gastos abiertos al nuevo reporte
                open_expenses.update(saleReport=sale_report)

                # Actualizar todas las sales filtradas con el nuevo SalesReport
                updated = sales.update(saleReport=sale_report)

                return Response({
                    'saleReportId': sale_report.id,
                    'salesClosed': updated,
                    'stats': stats,
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        with transaction.atomic():
            try:
                sale_data = request.data
                # print("Received checkout data:", sale_data)
                n_ticket = sale_data.get('nTicket')
                tariff = sale_data.get('tariff')
                payment_method1 = sale_data.get('paymentMethod1')
                payment_method2 = sale_data.get('paymentMethod2')
                #MOVEMENT
                movement = Movement.objects.get(nTicket=n_ticket, exitTime__isnull=True)
                #TARIFF
                tariff = Tariff.objects.get(pk=tariff)
                #Parment Method
                payment_method = PaymentMethod.objects.get(pk=sale_data.get('paymentMethod'))
                if payment_method1:
                    payment_method1 = PaymentMethod.objects.get(pk=payment_method1)
                if payment_method2:
                    payment_method2 = PaymentMethod.objects.get(pk=payment_method2)
                # Cerrar movimiento
                movement.exitTime = timezone.now()
                movement.parkingTime = PaymentCalculator(tariff, movement.entryTime).parking_time_msg
                movement.tariff = tariff
                movement.save()
                #GET TAXES
                tax = Tax.objects.filter(isActive=True).first()
                subtotal = 0
                total = sale_data.get('total')
                if tax.percent > 0 :
                    subtotal = total / (1 + tax.percent / 100)
                else:
                    subtotal = total


                sale_json = {
                    'movement': movement,
                    'discount': sale_data.get('discount'),
                    'taxPercent': tax.percent,
                    'subtotal': subtotal,
                    'taxValue': total - subtotal,
                    'total': sale_data.get('total'),
                    'amountPaid': sale_data.get('amountPaid'),
                    'paymentMethod': payment_method,
                    'paymentMethod1': payment_method1,
                    'paymentMethod2': payment_method2,
                    'item': 'PARKING',
                    'user': request.user,
                    'additionalNote': sale_data.get('additionalNote'),
                    'paymentMethodValue1': sale_data.get('paymentMethodValue1'),
                    'paymentMethodValue2': sale_data.get('paymentMethodValue2'),

                }
                # Crear venta
                sale = Sale.objects.create(**sale_json)
                serializer = SaleWithMovementSerializer(sale)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Movement.DoesNotExist:
                return Response({'error': 'Movimiento no encontrado o ya cerrado.'}, status=status.HTTP_400_BAD_REQUEST)
            except Tariff.DoesNotExist:
                return Response({'error': 'Tarifa no encontrada.'}, status=status.HTTP_400_BAD_REQUEST)
            except PaymentMethod.DoesNotExist:
                return Response({'error': 'Método de pago no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def by_report(self, request):
        report_id = request.query_params.get('reportId')
        if not report_id:
            return Response({'error': 'reportId is required'}, status=status.HTTP_400_BAD_REQUEST)
        sales = Sale.objects.filter(saleReport__id=report_id).select_related(
            'movement', 'movement__tariff', 'paymentMethod'
        ).order_by('-id')
        serializer = SaleWithMovementSerializer(sales, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent_sales(self, request):
        sales = Sale.objects.select_related(
            'movement', 'movement__tariff', 'paymentMethod'
        ).filter(item='PARKING').order_by('-id')[:15]
        serializer = SaleWithMovementSerializer(sales, many=True)
        return Response(serializer.data)