from fastapi import APIRouter

router = APIRouter(prefix= "/contratos", tags= ["contrato"])

@router.get("/")
async def Contrato():
    return {"mensagem": "tela de contrato"}