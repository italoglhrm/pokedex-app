import requests

BASE_URL = "https://pokeapi.co/api/v2"


def get_pokemon_list(offset=0, limit=20, name_filter=None):
    # Busca lista de Pokémon na PokéAPI, com paginação e filtro por nome.
    params = {"offset": offset, "limit": limit}
    r = requests.get(f"{BASE_URL}/pokemon", params=params, timeout=10)
    r.raise_for_status()
    data = r.json()

    results = []
    for item in data["results"]:
        if name_filter and name_filter.lower() not in item["name"]:
            continue

        pd = requests.get(item["url"], timeout=10).json()
        results.append(_map_pokemon(pd))

    return {"count": data["count"], "results": results}


def get_pokemon_detail(pokemon_id: int):
    # Busca detalhes de um Pokémon específico.
    r = requests.get(f"{BASE_URL}/pokemon/{pokemon_id}", timeout=10)
    r.raise_for_status()
    return _map_pokemon(r.json())


def _map_pokemon(data: dict) -> dict:
    stats = {s["stat"]["name"]: s["base_stat"] for s in data.get("stats", [])}

    imagem = (
        data.get("sprites", {})
            .get("other", {})
            .get("official-artwork", {})
            .get("front_default")
        or data.get("sprites", {}).get("front_default")
    )

    return {
        "codigo": str(data["id"]).zfill(3),  # zero-padding (#001, #004)
        "nome": data.get("name", "").capitalize(),
        "imagemurl": imagem or "",  # fallback vazio se nada encontrado
        "tipopokemon": [t["type"]["name"] for t in data.get("types", [])],
        "hp": stats.get("hp", 0),
        "attack": stats.get("attack", 0),
        "defense": stats.get("defense", 0),
    }

