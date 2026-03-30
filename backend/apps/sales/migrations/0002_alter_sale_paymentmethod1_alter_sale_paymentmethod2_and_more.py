from django.db import migrations


class Migration(migrations.Migration):
    """
    This migration is intentionally empty.
    PaymentMethod was previously in the sales app but was moved to the
    payment_methods app. sales.0001_initial now references payment_methods
    directly, so this migration only exists to maintain the dependency chain.
    """

    dependencies = [
        ('payment_methods', '0001_initial'),
        ('sales', '0001_initial'),
    ]

    operations = [
    ]
