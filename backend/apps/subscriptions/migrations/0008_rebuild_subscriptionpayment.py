import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0007_subscription_vehicles_m2m'),
        ('sales', '0006_alter_sale_movement_nullable'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # Drop old fields
        migrations.RemoveField(model_name='subscriptionpayment', name='total'),
        migrations.RemoveField(model_name='subscriptionpayment', name='amountPaid'),
        migrations.RemoveField(model_name='subscriptionpayment', name='discount'),
        migrations.RemoveField(model_name='subscriptionpayment', name='paymentMethodValue1'),
        migrations.RemoveField(model_name='subscriptionpayment', name='paymentMethodValue2'),
        migrations.RemoveField(model_name='subscriptionpayment', name='paymentMethod'),
        migrations.RemoveField(model_name='subscriptionpayment', name='paymentMethod1'),
        migrations.RemoveField(model_name='subscriptionpayment', name='paymentMethod2'),
        migrations.RemoveField(model_name='subscriptionpayment', name='saleReport'),
        # Add new fields
        migrations.AddField(
            model_name='subscriptionpayment',
            name='period',
            field=models.CharField(blank=True, default='', max_length=80),
        ),
        migrations.AddField(
            model_name='subscriptionpayment',
            name='startDate',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='subscriptionpayment',
            name='endDate',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='subscriptionpayment',
            name='sale',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to='sales.sale',
            ),
        ),
    ]
