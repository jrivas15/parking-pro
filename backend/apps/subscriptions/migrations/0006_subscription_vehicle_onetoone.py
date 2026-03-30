from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0005_alter_subscription_enddate'),
        ('vehicles', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subscription',
            name='vehicles',
        ),
        migrations.AddField(
            model_name='subscription',
            name='vehicle',
            field=models.OneToOneField(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='subscription',
                to='vehicles.vehicle',
            ),
        ),
    ]
