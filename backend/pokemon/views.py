from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import PokemonUsuario, TipoPokemon
from .serializers import (
    PokemonUsuarioSerializer,
    ToggleFavoriteSerializer,
    ToggleTeamSerializer,
    PokemonSerializer,
)
from .services import get_pokemon_list, get_pokemon_detail


# === LISTA DE POKÉMON GERAL ===
class PokemonListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        page = int(request.query_params.get("page", 1))
        limit = int(request.query_params.get("limit", 20))
        offset = (page - 1) * limit
        name_filter = request.query_params.get("search")

        data = get_pokemon_list(offset=offset, limit=limit, name_filter=name_filter)

        serializer = PokemonSerializer(data["results"], many=True)
        return Response({
            "count": data["count"],
            "results": serializer.data
        })


# === FUNÇÃO AUXILIAR ===
def _get_or_create_pokemon_usuario(user, pk: int):
    data = get_pokemon_detail(pk)

    pokemon, _ = PokemonUsuario.objects.get_or_create(
        usuario=user,
        codigo=data["codigo"],  # "001"
    )

    # Atualiza campos básicos (sem tipos)
    pokemon.nome = data["nome"]
    pokemon.imagemurl = data.get("imagemurl") or ""
    pokemon.save()

    return pokemon


# === FAVORITOS ===
class ToggleFavoriteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        pokemon = _get_or_create_pokemon_usuario(request.user, pk)
        serializer = ToggleFavoriteSerializer(
            pokemon, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # devolve o Pokémon completo já com campos formatados
        return Response(PokemonUsuarioSerializer(pokemon).data)


class FavoritesListView(generics.ListAPIView):
    serializer_class = PokemonUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PokemonUsuario.objects.filter(
            usuario=self.request.user, favorito=True
        )


# === EQUIPE (GRUPO DE BATALHA) ===
class ToggleTeamView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        pokemon = _get_or_create_pokemon_usuario(request.user, pk)
        serializer = ToggleTeamSerializer(
            pokemon, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(PokemonUsuarioSerializer(pokemon).data)


class TeamListView(generics.ListAPIView):
    serializer_class = PokemonUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PokemonUsuario.objects.filter(
            usuario=self.request.user, grupobatalha=True
        )
