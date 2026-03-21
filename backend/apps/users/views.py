from django.contrib.auth import authenticate, login, logout
from django.http import HttpRequest, JsonResponse
from .models import User
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from rest_framework.authtoken.models import Token


@csrf_exempt
def login_view(request: HttpRequest):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        print("Intentando autenticar usuario:", username)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Obtener o crear token para el usuario
            token, _ = Token.objects.get_or_create(user=user)
            return JsonResponse({
                "message": "Login exitoso",
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "fullName": user.fullName,
                    "role": user.groups.first().name if user.groups.exists() else None
                }
            })
        else:
            return JsonResponse({"error": "Credenciales inválidas"}, status=401)
        
@csrf_exempt
def signup_view(request: HttpRequest):
    if request.method == "POST":
        data = json.loads(request.body)
        data_user = data["user"]
        username = data_user.get("username")
        role = data.get("role")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "El nombre de usuario ya existe"}, status=400)

        user = User.objects.create_user(**data_user)
        group = Group.objects.get(name=role)
        user.groups.add(group)
        # Generar token para el nuevo usuario
        token = Token.objects.create(user=user)
        return JsonResponse({
            "message": "Usuario creado exitosamente",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "fullName": user.fullName,
                "role": role
            }
        }, status=201)

@login_required
def me_view(request):
    user = request.user
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "fullName": user.fullName,
        "imgURL": user.imgURL,
        "lastLogin": user.lastLogin,
        "role": user.groups.first().name if user.groups.exists() else None
        })

def logout_view(request):
    logout(request)
    response = JsonResponse({"message": "Logout exitoso"})
    # response.delete_cookie('sessionid')
    return response