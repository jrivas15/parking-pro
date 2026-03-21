import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('municipios', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('personType', models.CharField(max_length=50)),
                ('documentType', models.CharField(max_length=50)),
                ('nDoc', models.IntegerField()),
                ('phone', models.CharField(blank=True, max_length=50, null=True)),
                ('address', models.CharField(blank=True, max_length=255, null=True)),
                ('postalCode', models.CharField(blank=True, max_length=20, null=True)),
                ('location', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='customers', to='municipios.municipio')),
                ('email', models.CharField(blank=True, max_length=255, null=True)),
                ('taxID', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Customer',
                'verbose_name_plural': 'Customers',
                'db_table': 'customers',
            },
        ),
    ]
