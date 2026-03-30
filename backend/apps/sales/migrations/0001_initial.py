import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('customers', '0001_initial'),
        ('movements', '0002_alter_movement_parkingtime'),
        ('payment_methods', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('discount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('taxPercent', models.DecimalField(decimal_places=2, default=0, max_digits=3)),
                ('subtotal', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('taxValue', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('total', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('item', models.CharField(max_length=255, null=True)),
                ('additionalNote', models.CharField(max_length=255, null=True)),
                ('paymentMethodValue1', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('paymentMethodValue2', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('customerID', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sales', to='customers.customer')),
                ('movement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sales', to='movements.movement')),
                ('paymentMethod', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sales', to='payment_methods.paymentmethod')),
                ('paymentMethod1', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sales1', to='payment_methods.paymentmethod')),
                ('paymentMethod2', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sales2', to='payment_methods.paymentmethod')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sales', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Sale',
                'verbose_name_plural': 'Sales',
                'db_table': 'sales',
            },
        ),
    ]
