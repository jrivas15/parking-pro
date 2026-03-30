import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0005_alter_sale_taxpercent'),
        ('movements', '0002_alter_movement_parkingtime'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sale',
            name='movement',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='sales',
                to='movements.movement',
            ),
        ),
    ]
