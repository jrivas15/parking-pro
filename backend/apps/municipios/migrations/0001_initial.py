from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Municipio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dptoCode', models.CharField(max_length=10, unique=True)),
                ('dpto', models.CharField(max_length=100)),
                ('municipioCode', models.CharField(max_length=10, unique=True)),
                ('municipio', models.CharField(max_length=100)),
            ],
            options={
                'verbose_name': 'Municipio',
                'verbose_name_plural': 'Municipios',
                'db_table': 'municipios',
            },
        ),
        migrations.AddIndex(
            model_name='municipio',
            index=models.Index(fields=['dpto'], name='idx_municipio_depto'),
        ),
        migrations.AddIndex(
            model_name='municipio',
            index=models.Index(fields=['municipio'], name='idx_municipio_municipio'),
        ),
    ]
