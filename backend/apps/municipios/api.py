from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializer import MunicipioSerializer
from .models import Municipio


class MunicipioViewSet(viewsets.ModelViewSet):
    queryset = Municipio.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MunicipioSerializer

    @action(detail=False, methods=['get'])
    def by_department(self, request):
        depto = request.query_params.get('depto')
        if not depto:
            return Response({'error': 'depto parameter is required'}, status=400)
        municipios = Municipio.objects.filter(depto__iexact=depto).order_by('municipio')
        serializer = self.get_serializer(municipios, many=True)
        return Response(serializer.data)
