import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('payment_methods', '0003_alter_paymentmethod_codeei_alter_paymentmethod_name'),
        ('sales_reports', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=255)),
                ('value', models.DecimalField(decimal_places=2, max_digits=12)),
                ('paymentMethod', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='payment_methods.paymentmethod')),
                ('saleReport', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='sales_reports.salesreport')),
            ],
            options={
                'verbose_name': 'Expense',
                'verbose_name_plural': 'Expenses',
                'db_table': 'expenses',
            },
        ),
    ]
