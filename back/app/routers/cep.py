from fastapi import APIRouter, HTTPException

from app.services.cep_service import buscar_cep

router = APIRouter(prefix="/cep", tags=["CEP"])


@router.get("/{cep}")
async def consultar_cep(cep: str):
    dados = await buscar_cep(cep)

    if not dados:
        raise HTTPException(status_code=404, detail="CEP não encontrado")

    return dados
