from fastapi import APIRouter
from app.crud import pessoa_crud
router = APIRouter(prefix= "/usuario", tags= ["usuario"])

@router.get("/")
async def Usuario():
    return {"mensagem": "tela de usuario"}

@router.post("/registrar_usuario")
async def CriarUsuario():
    return pessoa_crud.criar_pessoa()

@router.get("/")
async def Usuario():
    return pessoa_crud.listar_pessoa()