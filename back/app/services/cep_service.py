import httpx

TIMEOUT_SEGUNDOS = 5


async def buscar_cep(cep: str) -> dict | None:
    cep = cep.replace("-", "").strip()

    url = f"https://viacep.com.br/ws/{cep}/json/"

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_SEGUNDOS) as client:
            response = await client.get(url)
    except httpx.HTTPError:
        return None

    if response.status_code != 200:
        return None

    dados = response.json()

    if "erro" in dados:
        return None

    return dados
