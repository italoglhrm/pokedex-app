from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Usuario

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            data = response.data
            access = data.get("access")
            refresh = data.get("refresh")

            # Seta cookies HttpOnly
            response.set_cookie(
                "access_token",
                access,
                httponly=True,
                secure=False,  
                samesite="Lax",
                max_age=60 * 15,  # 15 min
            )
            response.set_cookie(
                "refresh_token",
                refresh,
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=60 * 60 * 24,  # 1 dia
            )

            # Não expõe tokens no corpo
            del response.data["access"]
            del response.data["refresh"]

        return response

class CookieTokenRefreshView(TokenRefreshView):
    # Usa o refresh_token do cookie para renovar o access_token.
    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh_token")
        if refresh is None:
            return Response({"detail": "Refresh token not found."}, status=status.HTTP_401_UNAUTHORIZED)

        # Monta request.data esperado pelo TokenRefreshView
        request.data._mutable = True if hasattr(request.data, "_mutable") else None
        request.data["refresh"] = refresh
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access = response.data.get("access")
            response.set_cookie(
                "access_token",
                access,
                httponly=True,
                secure=False, 
                samesite="Lax",
                max_age=60 * 15,  # 15 minutos
            )
            del response.data["access"]

        return response

class LogoutView(APIView):
    def post(self, request):
        response = Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user: Usuario = request.user
        return Response({
            "id": user.id,
            "login": user.username,
            "email": user.email,
            "nome": user.nome,
        })