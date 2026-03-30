from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

from .models import Subscription, SubscriptionPayment
from .serializer import SubscriptionSerializer, SubscriptionPaymentSerializer, SubscriptionPaymentDetailSerializer
from .tasks import MONTHS_ES


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all().order_by('-id')
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubscriptionSerializer

    @action(detail=False, methods=['get'])
    def active(self, request):
        today = date.today()
        qs = Subscription.objects.filter(isActive=True, endDate__gte=today).order_by('endDate')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def payments(self, request, pk=None):
        subscription = self.get_object()
        qs = SubscriptionPayment.objects.filter(subscription=subscription).order_by('-startDate')
        serializer = SubscriptionPaymentDetailSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def advance(self, request, pk=None):
        """Create the next period keeping the original start day across months."""
        subscription = self.get_object()
        if not subscription.startDate:
            return Response({'error': 'La suscripción no tiene fecha de inicio.'}, status=status.HTTP_400_BAD_REQUEST)

        count = SubscriptionPayment.objects.filter(subscription=subscription).count()
        original_day      = subscription.startDate.day
        next_start        = subscription.startDate + relativedelta(months=count)
        next_period_start = subscription.startDate + relativedelta(months=count + 1)
        # If the next month was capped (doesn't have the original day), use that capped date as end.
        # Otherwise end the day before the next period starts.
        if next_period_start.day < original_day:
            next_end = next_period_start
        else:
            next_end = next_period_start - timedelta(days=1)

        label = f"{MONTHS_ES[next_start.month - 1]} {next_start.year}"
        payment = SubscriptionPayment.objects.create(
            subscription=subscription,
            period=label,
            startDate=next_start,
            endDate=next_end,
        )
        serializer = SubscriptionPaymentDetailSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def by_plate(self, request):
        plate = request.query_params.get('plate')
        if not plate:
            return Response({'error': 'plate parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        qs = Subscription.objects.filter(vehicles__plate__iexact=plate).order_by('-endDate')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class SubscriptionPaymentViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPayment.objects.all().order_by('-id')
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubscriptionPaymentDetailSerializer

    @action(detail=False, methods=['get'])
    def by_subscription(self, request):
        subscription_id = request.query_params.get('subscription_id')
        if not subscription_id:
            return Response({'error': 'subscription_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        qs = SubscriptionPayment.objects.filter(subscription_id=subscription_id).order_by('-startDate')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_dates(self, request, pk=None):
        payment = self.get_object()
        if payment.sale_id:
            return Response({'error': 'No se pueden modificar las fechas de un periodo ya pagado.'}, status=status.HTTP_400_BAD_REQUEST)
        data = request.data
        if 'startDate' in data:
            payment.startDate = data['startDate']
        if 'endDate' in data:
            payment.endDate = data['endDate']
        if 'period' in data:
            payment.period = data['period']
        payment.save()
        serializer = self.get_serializer(payment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        with transaction.atomic():
            try:
                from apps.sales.models import Sale
                from apps.payment_methods.models import PaymentMethod
                from apps.taxes.models import Tax

                payment = self.get_object()
                if payment.sale_id:
                    return Response({'error': 'Este periodo ya fue pagado.'}, status=status.HTTP_400_BAD_REQUEST)

                data = request.data
                payment_method = PaymentMethod.objects.get(pk=data['paymentMethodId'])
                total = data['total']
                tax = Tax.objects.filter(isActive=True).first()
                subtotal = float(total) / (1 + float(tax.percent) / 100) if tax and tax.percent > 0 else total

                sale = Sale.objects.create(
                    movement=None,
                    paymentMethod=payment_method,
                    total=total,
                    subtotal=subtotal,
                    amountPaid=data.get('amountPaid', total),
                    taxPercent=tax.percent if tax else 0,
                    taxValue=float(total) - float(subtotal),
                    discount=0,
                    item='MENSUALIDAD',
                    user=request.user,
                    additionalNote=data.get('note'),
                )

                payment.sale = sale
                payment.user = request.user
                if data.get('note'):
                    payment.note = data['note']
                payment.save()

                subscription = payment.subscription
                if subscription.state == 'pending':
                    subscription.state = 'active'
                    subscription.save(update_fields=['state'])

                serializer = self.get_serializer(payment)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except PaymentMethod.DoesNotExist:
                return Response({'error': 'Método de pago no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
