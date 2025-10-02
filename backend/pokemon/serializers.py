from rest_framework import serializers
from .models import PokemonUsuario, TipoPokemon
from .services import get_pokemon_detail


# === TipoPokemon ===
class TipoPokemonSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPokemon
        fields = ["idtipopokemon", "descricao"]


# === PokemonUsuario (favoritos/equipe) ===
class PokemonUsuarioSerializer(serializers.ModelSerializer):
    tipopokemon = serializers.SerializerMethodField()
    hp = serializers.SerializerMethodField()
    attack = serializers.SerializerMethodField()
    defense = serializers.SerializerMethodField()

    class Meta:
        model = PokemonUsuario
        fields = [
            "idpokemonusuario",
            "codigo",
            "nome",
            "imagemurl",
            "grupobatalha",
            "favorito",
            "tipopokemon",
            "hp",
            "attack",
            "defense",
        ]

    def get_tipopokemon(self, obj):
        try:
            data = get_pokemon_detail(int(obj.codigo))
            return data.get("tipopokemon", [])
        except Exception:
            return []

    def get_hp(self, obj):
        try:
            data = get_pokemon_detail(int(obj.codigo))
            return data.get("hp")
        except Exception:
            return None

    def get_attack(self, obj):
        try:
            data = get_pokemon_detail(int(obj.codigo))
            return data.get("attack")
        except Exception:
            return None

    def get_defense(self, obj):
        try:
            data = get_pokemon_detail(int(obj.codigo))
            return data.get("defense")
        except Exception:
            return None


# === Favoritos ===
class ToggleFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PokemonUsuario
        fields = ["favorito"]


# === Equipe (time de batalha) ===
class ToggleTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = PokemonUsuario
        fields = ["grupobatalha"]

    def validate_grupobatalha(self, value):
        user = self.context["request"].user
        if value is True:
            count = PokemonUsuario.objects.filter(
                usuario=user, grupobatalha=True
            ).count()
            if count >= 6:
                raise serializers.ValidationError("A equipe já possui 6 Pokémon.")
        return value


# === Lista geral da Pokédex (dados crus da API) ===
class PokemonSerializer(serializers.Serializer):
    codigo = serializers.CharField()
    nome = serializers.CharField()
    imagemurl = serializers.CharField()
    tipopokemon = serializers.ListField(
        child=serializers.CharField()
    )
    hp = serializers.IntegerField(required=False)
    attack = serializers.IntegerField(required=False)
    defense = serializers.IntegerField(required=False)
