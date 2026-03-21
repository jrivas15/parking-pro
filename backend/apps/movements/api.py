from rest_framework import permissions, viewsets
from apps.movements.utils.vehicle import Vehicle
from apps.tariffs.models import Tariff
from apps.users.models import User
from .serializer import MovementSerializer
from .models import Movement
from rest_framework.decorators import action
from rest_framework.response import Response
from .utils.payments import PaymentCalculator
from django.db.models.functions import Cast
from django.db.models import CharField


class MovementViewSet(viewsets.ModelViewSet):
    queryset = Movement.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MovementSerializer

    @action(detail=False, methods=['get'])
    def active_plates(self, request):
        active_movements = Movement.objects.filter(exitTime__isnull=True).order_by('-entryTime')
        serializer = self.get_serializer(active_movements, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def calc_payment_value(self, request):
        plate = request.query_params.get('plate')
        tarrif = request.query_params.get('tarrif')
        if not plate:
            return Response({'error': 'Plate parameter is required'}, status=400)

        try:
            movement = Movement.objects.filter(plate=plate, exitTime__isnull=True).latest('entryTime')
        except Movement.DoesNotExist:
            return Response({'error': 'No active movement found for this plate'}, status=404)
        #*If exist the movement, look up the tarrif
        if tarrif:
            try:
                tarrif_obj = Tariff.objects.get(name=tarrif)
            except Tariff.DoesNotExist:
                return Response({'error': 'Tarrif not found'}, status=404)
        else:
            try:

                tarrif_obj = Tariff.objects.filter(vehicleType=movement.vehicleType, enable=True).first()
                if not tarrif_obj:
                    return Response({'error': 'No active tarrif found for this vehicle type'}, status=404)
            except Exception as e:
                print(e)
                return Response({'error': 'Tariff error'}, status=500)
        
        payment = PaymentCalculator(tarrif_obj, movement.entryTime)

        return Response({'total': payment.total_payment, 
                         'parkingTime': payment.parking_time_msg, 
                         'tariff': tarrif_obj.pk
                         })
    
    @action(detail=False, methods=['post'])
    def new_movement(self, request):
        plate = request.data.get('plate')
        card = request.data.get('card')

        if plate is None:
            return Response({'error': 'Plate parameter is required'}, status=400)

        # Si plate es numérico y hasta 3 dígitos, buscar por ticket
        if plate.isdigit() and len(plate) <= 3:
            active_movements = Movement.objects.filter(
                exitTime__isnull=True
            ).annotate(
                ticket_str=Cast('nTicket', output_field=CharField())
            ).filter(
                ticket_str__endswith=plate
            ).order_by('-entryTime')
            if not active_movements.exists():
                return Response({'error': 'No active movements found'}, status=404)
            return Response(self.get_serializer(active_movements, many=True).data, status=409)

        # Crear nuevo movimiento
        vehicle = Vehicle(plate, card)
        if not vehicle.is_valid_vehicle:
            return Response({'error': 'Invalid vehicle plate or card'}, status=400)
        user:User =request.user
        data = {
            'plate': plate,
            'card': card,
            'vehicleType': vehicle.type_v,
            'speciality': vehicle.speciality,
            'user': user
        }
        movement_active = Movement.objects.filter(plate=plate, exitTime__isnull=True)
        if movement_active.exists():
            return Response(self.get_serializer(movement_active, many=True).data, status=409)
        movement = Movement.objects.create(**data)
        serializer = self.get_serializer(movement)
        return Response(serializer.data, status=201)

    @action(detail=False, methods=['get'])
    def last_exit_movements(self, request):
        last_movements = Movement.objects.filter(exitTime__isnull=False).order_by('-exitTime')[:10]
        serializer = self.get_serializer(last_movements, many=True)
        return Response(serializer.data)