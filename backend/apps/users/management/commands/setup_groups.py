from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from apps.tariffs.models import Tariff
from django.contrib.contenttypes.models import ContentType
from apps.users.models import User

class Command(BaseCommand):
    help = 'Crea grupos predefinidos con sus permisos'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Elimina grupos existentes antes de crear',
        )

    def handle(self, *args, **options):
        if options['reset']:
            Group.objects.all().delete()
            self.stdout.write(self.style.WARNING('Grupos existentes eliminados'))

        # Definir grupos
        grupos = [
            {
                'nombre': 'Admin',
                'modelos': [Tariff, User],
                'permisos': ['add', 'change', 'delete', 'view']
            },
            {
                'nombre': 'Cajero',
                'modelos': [Tariff],
                'permisos': ['view']
            },
        ]

        for grupo_data in grupos:
            grupo, creado = Group.objects.get_or_create(name=grupo_data['nombre'])
            
            permisos = []
            for modelo in grupo_data['modelos']:
                content_type = ContentType.objects.get_for_model(modelo)
                for permiso in grupo_data['permisos']:
                    codename = f"{permiso}_{modelo._meta.model_name}"
                    try:
                        p = Permission.objects.get(
                            content_type=content_type,
                            codename=codename
                        )
                        permisos.append(p)
                    except Permission.DoesNotExist:
                        self.stdout.write(
                            self.style.WARNING(f"Permiso {codename} no encontrado")
                        )
            
            grupo.permissions.set(permisos)
            
            if creado:
                self.stdout.write(
                    self.style.SUCCESS(f'Grupo "{grupo_data["nombre"]}" creado con {len(permisos)} permisos')
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f'Grupo "{grupo_data["nombre"]}" actualizado con {len(permisos)} permisos')
                )
