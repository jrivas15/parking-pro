from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from apps.users.models import User
from apps.tariffs.models import Tariff
from apps.parking_info.models import ParkingInfo
from apps.payment_methods.models import PaymentMethod
from apps.taxes.models import Tax


class Command(BaseCommand):
    help = 'Pobla la base de datos con datos iniciales'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Elimina datos existentes antes de sembrar',
        )

    def handle(self, *args, **options):
        if options['reset']:
            User.objects.filter(username='admin').delete()
            Tariff.objects.filter(name__in=['Tarifa Carro', 'Tarifa Moto']).delete()
            ParkingInfo.objects.all().delete()
            self.stdout.write(self.style.WARNING('Datos existentes eliminados'))

        # Ensure groups exist
        self.call_command_setup_groups()

        # Admin user
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'fullName': 'Administrador',
                'isActive': True,
            }
        )
        if created:
            user.set_password('admin123')
            user.save()
            self.stdout.write(self.style.SUCCESS('Usuario "admin" creado'))
        else:
            self.stdout.write(self.style.WARNING('Usuario "admin" ya existe'))

        try:
            admin_group = Group.objects.get(name='Admin')
            user.groups.add(admin_group)
        except Group.DoesNotExist:
            self.stdout.write(self.style.WARNING('Grupo "Admin" no encontrado'))

        # Car tariff
        car_tariff, created = Tariff.objects.get_or_create(
            name='Tarifa Carro',
            defaults={
                'tariffType': '1',
                'vehicleType': 'C',
                'priceHour': 3000.00,
                'priceHourAdditional': 3000.00,
                'maxPrice': 30000.00,
                'segment': 0,
                'startTimeCharge': 0,
                'startTimeAdditional': 0,
                'enableDays': [1, 2, 3, 4, 5, 6, 7],
                'enable': True,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Tarifa "Tarifa Carro" creada'))
        else:
            self.stdout.write(self.style.WARNING('Tarifa "Tarifa Carro" ya existe'))

        # Motorcycle tariff
        moto_tariff, created = Tariff.objects.get_or_create(
            name='Tarifa Moto',
            defaults={
                'tariffType': '1',
                'vehicleType': 'M',
                'priceHour': 2000.00,
                'priceHourAdditional': 2000.00,
                'maxPrice': 20000.00,
                'segment': 0,
                'startTimeCharge': 0,
                'startTimeAdditional': 0,
                'enableDays': [1, 2, 3, 4, 5, 6, 7],
                'enable': True,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Tarifa "Tarifa Moto" creada'))
        else:
            self.stdout.write(self.style.WARNING('Tarifa "Tarifa Moto" ya existe'))

        # ParkingInfo
        if not ParkingInfo.objects.exists():
            ParkingInfo.objects.create(
                name='Mi Parqueadero',
                nit=None,
                address=None,
                phone=None,
                email=None,
                includeLogo=True,
                includeParkingInfo=True,
                includeFeResolution=False,
                includeQRCode=True,
                includeBasicRules=True,
            )
            self.stdout.write(self.style.SUCCESS('ParkingInfo creado'))
        else:
            self.stdout.write(self.style.WARNING('ParkingInfo ya existe'))

        # Payment methods
        payment_methods = [
            {'name': 'Efectivo', 'codeEI': None},
            {'name': 'Transferencia', 'codeEI': None},
        ]
        for pm in payment_methods:
            obj, created = PaymentMethod.objects.get_or_create(
                name=pm['name'],
                defaults={'codeEI': pm['codeEI'], 'isActive': True}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Método de pago "{pm["name"]}" creado'))
            else:
                self.stdout.write(self.style.WARNING(f'Método de pago "{pm["name"]}" ya existe'))

        # Taxes
        tax, created = Tax.objects.get_or_create(
            name='IVA',
            defaults={'percent': 0, 'isActive': True, 'codeEI': None}
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Impuesto "IVA" creado'))
        else:
            self.stdout.write(self.style.WARNING('Impuesto "IVA" ya existe'))

    def call_command_setup_groups(self):
        from django.core.management import call_command
        call_command('setup_groups', stdout=self.stdout, stderr=self.stderr)
