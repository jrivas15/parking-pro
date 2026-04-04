from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('expenses', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='expense',
            name='expenseType',
            field=models.CharField(
                blank=True,
                choices=[('Compra', 'Compra'), ('Nómina', 'Nómina'), ('Pago', 'Pago'), ('Otro', 'Otro')],
                max_length=20,
                null=True,
            ),
        ),
    ]
