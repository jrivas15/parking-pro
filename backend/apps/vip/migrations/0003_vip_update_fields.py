from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vip', '0002_rename_vigencia_vip_caducate_rename_tarjeta_vip_card_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vip',
            name='caducate',
        ),
        migrations.AlterField(
            model_name='vip',
            name='isActive',
            field=models.BooleanField(default=True),
        ),
    ]
