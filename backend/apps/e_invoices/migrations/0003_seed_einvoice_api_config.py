from django.db import migrations


def seed_config(apps, schema_editor):
    EInvoiceAPIConfig = apps.get_model('e_invoices', 'EInvoiceAPIConfig')
    EInvoiceAPIConfig.objects.get_or_create(
        pk=1,
        defaults={
            'endpoint': 'http://localhost:8001/api/v1',
            'api_key': '',
        }
    )


class Migration(migrations.Migration):

    dependencies = [
        ('e_invoices', '0002_einvoiceapiconfig'),
    ]

    operations = [
        migrations.RunPython(seed_config, migrations.RunPython.noop),
    ]
