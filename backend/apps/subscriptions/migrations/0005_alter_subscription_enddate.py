from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0004_subscription_vehicles'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscription',
            name='endDate',
            field=models.DateField(blank=True, null=True),
        ),
    ]
