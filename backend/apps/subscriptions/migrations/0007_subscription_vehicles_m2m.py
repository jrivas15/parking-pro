from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0006_subscription_vehicle_onetoone'),
        ('vehicles', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subscription',
            name='vehicle',
        ),
        migrations.AddField(
            model_name='subscription',
            name='vehicles',
            field=models.ManyToManyField(related_name='subscriptions', to='vehicles.vehicle'),
        ),
    ]
