from django.db import models
from users.models import Usuario

class TipoPokemon(models.Model):
    idtipopokemon = models.AutoField(primary_key=True, db_column="IDTipoPokemon")
    descricao = models.CharField(max_length=40, db_column="Descricao")

    class Meta:
        db_table = "TipoPokemon"

    def __str__(self):
        return self.descricao


class PokemonUsuario(models.Model):
    idpokemonusuario = models.AutoField(primary_key=True, db_column="IDPokemonUsuario")
    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="pokemons", db_column="IDUsuario"
    )
    tipopokemon = models.ManyToManyField(
        TipoPokemon,
        db_table="PokemonUsuario_Tipos",
        related_name="pokemons"
    )
    codigo = models.CharField(max_length=50, db_column="Codigo")
    imagemurl = models.CharField(max_length=255, db_column="ImagemUrl")
    nome = models.CharField(max_length=100, db_column="Nome")
    grupobatalha = models.BooleanField(default=False, db_column="GrupoBatalha")
    favorito = models.BooleanField(default=False, db_column="Favorito")

    class Meta:
        db_table = "PokemonUsuario"

    def __str__(self):
        return f"{self.nome} ({self.usuario.login})"
