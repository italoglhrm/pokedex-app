from django.urls import path
from .views import CookieTokenObtainPairView, CookieTokenRefreshView, LogoutView, MeView

urlpatterns = [
    path("login/", CookieTokenObtainPairView.as_view(), name="login"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
     path("me/", MeView.as_view(), name="me"),
]
