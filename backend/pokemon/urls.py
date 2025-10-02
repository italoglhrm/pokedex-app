from django.urls import path
from .views import (
    PokemonListView,
    ToggleFavoriteView,
    ToggleTeamView,
    FavoritesListView,
    TeamListView,
)

urlpatterns = [
    path("", PokemonListView.as_view(), name="pokemon-list"),
    path("<int:pk>/favorite/", ToggleFavoriteView.as_view(), name="pokemon-favorite"),
    path("<int:pk>/team/", ToggleTeamView.as_view(), name="pokemon-team"),
    path("favorites/", FavoritesListView.as_view(), name="favorites"),
    path("team/", TeamListView.as_view(), name="team"),
]
