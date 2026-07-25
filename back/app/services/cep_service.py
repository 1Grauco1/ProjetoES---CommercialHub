import httpx

async def buscar_cep(cep: str):
    cep = cep.replace("-", "").strip()

    url = f"https://viacep.com.br/ws/{cep}/json/"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code != 200:
        return None

    dados = response.json()

    if "erro" in dados:
        return None

    return dados