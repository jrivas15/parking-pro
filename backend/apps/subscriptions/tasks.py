from celery import shared_task
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

from .models import Subscription, SubscriptionPayment

MORA_DAYS = 5

MONTHS_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]


def _generate_periods(subscription, today):
    """
    Genera los periodos mensuales faltantes desde startDate hasta el mes actual.
    Respeta la lógica de fin de mes: si el mes destino no tiene el día original,
    usa el último día disponible como fin (no resta 1).
    """
    if not subscription.startDate:
        return 0

    existing_starts = set(
        SubscriptionPayment.objects
        .filter(subscription=subscription)
        .values_list('startDate', flat=True)
    )

    original_day = subscription.startDate.day
    to_create = []
    period_start = subscription.startDate

    while period_start <= today:
        if period_start not in existing_starts:
            next_period_start = period_start + relativedelta(months=1)
            if next_period_start.day < original_day:
                period_end = next_period_start
            else:
                period_end = next_period_start - timedelta(days=1)

            label = f"{MONTHS_ES[period_start.month - 1]} {period_start.year}"
            to_create.append(SubscriptionPayment(
                subscription=subscription,
                period=label,
                startDate=period_start,
                endDate=period_end,
            ))

        period_start = period_start + relativedelta(months=1)

    if to_create:
        SubscriptionPayment.objects.bulk_create(to_create)

    return len(to_create)


@shared_task(name='apps.subscriptions.tasks.update_subscription_states')
def update_subscription_states():
    """
    Para cada suscripción activa (no cancelada):
      1. Genera los periodos mensuales faltantes hasta hoy.
      2. Actualiza el estado:
           - active  : sin pagos pendientes
           - pending : al menos un pago pendiente sin mora > MORA_DAYS días
           - expired : tiene algún pago vencido hace más de MORA_DAYS días sin pagar
    """
    today = date.today()
    mora_threshold = today - timedelta(days=MORA_DAYS)

    active_ids  = []
    pending_ids = []
    expired_ids = []
    total_created = 0

    subscriptions = (
        Subscription.objects
        .filter(isActive=True)
        .exclude(state='cancelled')
    )

    for sub in subscriptions:
        total_created += _generate_periods(sub, today)

        unpaid_qs = SubscriptionPayment.objects.filter(subscription=sub, sale__isnull=True)

        if not unpaid_qs.exists():
            new_state = 'active'
        elif unpaid_qs.filter(endDate__lt=mora_threshold).exists():
            new_state = 'expired'
        else:
            new_state = 'pending'

        if sub.state != new_state:
            if new_state == 'active':
                active_ids.append(sub.id)
            elif new_state == 'expired':
                expired_ids.append(sub.id)
            else:
                pending_ids.append(sub.id)

    if active_ids:
        Subscription.objects.filter(id__in=active_ids).update(state='active')
    if pending_ids:
        Subscription.objects.filter(id__in=pending_ids).update(state='pending')
    if expired_ids:
        Subscription.objects.filter(id__in=expired_ids).update(state='expired')

    return {
        'periods_created': total_created,
        'state_updates': {
            'active':  len(active_ids),
            'pending': len(pending_ids),
            'expired': len(expired_ids),
        },
    }
