from fastapi import APIRouter

router = APIRouter(prefix= "/salas", tags= ["salas"])

@router.get("/")
async def Salas():
    return {"mensagem": "tela de salas"}