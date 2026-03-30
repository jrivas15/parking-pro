from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0003_subscriptionpayment'),
        ('vehicles', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscription',
            name='vehicles',
            field=models.ManyToManyField(related_name='subscriptions', to='vehicles.vehicle'),
        ),
        migrations.RemoveField(
            model_name='subscription',
            name='vehicle',
        ),
    ]
