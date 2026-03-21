from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from django.contrib.auth.models import Group
from rest_framework.authtoken.models import Token

class UserViewSet(viewsets.ModelViewSet):
    """Basic User viewset. Protects write operations to authenticated users."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]
    def update(self, request, *args, **kwargs):
        """Update a user with custom response."""
        data = request.data.copy()
        role = data.pop('role', None)
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            
            if role:
                instance.groups.clear()
                group = Group.objects.get(name=role)
                instance.groups.add(group)
            
            return Response({
                'message': 'Usuario actualizado exitosamente',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Error al actualizar el usuario',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
    def list(self, request, *args, **kwargs):
        """Get all users with their groups."""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        users_with_groups = []
        for user in queryset:
            user_data = UserSerializer(user).data
            user_data['role'] = user.groups.first().name if user.groups.exists() else None
            users_with_groups.append(user_data)
        
        return Response(users_with_groups, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """Create a new user with custom response."""
        # print("Datos recibidos:", request.data)
        data:dict= request.data
        role = data.pop('role', None)  # Extraer el campo 'role' si existe
        # print("Datos del usuario:", data)
        # print("Rol del usuario:", role)
        if role == None:
            return Response({
                'error': 'El campo role es obligatorio'
            }, status=status.HTTP_400_BAD_REQUEST)
        
   
        serializer = self.get_serializer(data=data)
        
        if serializer.is_valid():
            # Crear el usuario (el serializer usa create_user que hashea el password)
            self.perform_create(serializer)
            user = serializer.instance
            group = Group.objects.get(name=role) 
            user.groups.add(group)
            # Generar token para el nuevo usuario
            token = Token.objects.create(user=user)
            # Respuesta exitosa
            return Response({
                'message': 'Usuario creado exitosamente',
                'token': token.key,
                'user': {
                    'id': serializer.data['id'],
                    'username': serializer.data['username'],
                    'fullName': serializer.data['fullName'],
                    'role': role
                }
            }, status=status.HTTP_201_CREATED)
        else:
            # Respuesta de error con detalles de validación
            return Response({
                'error': 'Error al crear el usuario',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
