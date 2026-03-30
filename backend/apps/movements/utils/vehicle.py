from django.db.models import Q
from apps.vip.models import Vip
from apps.subscriptions.models import Subscription


class Vehicle():
    def __init__(self, placa: str, card: str | None = None) -> None:
        self.plate = placa
        self.card = card
        self.type_v = self.get_type_vehicle()
        self.motivo = ''
        self.speciality = self.set_especialidad()
        if self.speciality is not None and self.type_v is not None:
            self.is_valid_vehicle = True
        else:
            self.is_valid_vehicle = False

    def set_especialidad(self):
        # Verificar VIP: por placa o por tarjeta
        vip_query = Q(vehicle__plate__iexact=self.plate, isActive=True)
        if self.card:
            vip_query |= Q(card__iexact=self.card, isActive=True)

        if Vip.objects.filter(vip_query).exists():
            self.motivo = 'VIP'
            return 'VIP'

        # Verificar mensualidad activa o pendiente
        if Subscription.objects.filter(
            vehicles__plate__iexact=self.plate,
            isActive=True,
            state__in=['active', 'pending'],
        ).exists():
            self.motivo = 'MENSUALIDAD'
            return 'MENS'

        return 'NORMAL'

    def get_type_vehicle(self):
        if self.is_car() or 'IDCAR' in self.plate:
            return 'C'
        elif self.is_motorbike() or 'MOTO' in self.plate or self.is_motorbike():
            return 'M'
        elif self.is_carro_moto():
            return 'C'
        elif self.is_bike():
            return 'B'
        else:
            return None

    def is_bike(self):
        return self.plate in ['BIKE', 'BICI']

    def is_car(self, n_chars=3, max_length=6):
        chars = self.plate[0:n_chars]
        numbers = self.plate[n_chars:]
        if not (chars.isalpha() and len(self.plate) == max_length):
            return False
        return numbers.isdigit()

    def is_motorbike(self):
        plate_length = len(self.plate)
        chars = self.plate[0:3]
        numbers = self.plate[3:5]
        final_char = self.plate[5:6]
        if not chars.isalpha() and plate_length == 6:
            return False
        if not numbers.isdigit():
            return False
        if plate_length == 5:
            return True
        elif plate_length == 6 and final_char.isalpha():
            return True
        return False

    def is_carro_moto(self):
        numbers = self.plate[0:3]
        chars = self.plate[3:]
        if not (numbers.isdigit() and len(self.plate) == 6):
            return False
        return chars.isalpha()
