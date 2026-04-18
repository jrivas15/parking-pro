from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('e_invoices', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EInvoiceAPIConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('endpoint', models.URLField(default='http://localhost:8001/api/v1')),
                ('api_key', models.CharField(blank=True, default='', max_length=256)),
            ],
            options={
                'verbose_name': 'E-Invoice API Config',
                'db_table': 'e_invoice_api_config',
            },
        ),
    ]
