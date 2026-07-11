from fastapi import APIRouter, Depends
from app.crud import pessoa_crud
from app.dependencies.db_dependencie import get_db

router = APIRouter(prefix= "/usuario", tags= ["usuario"])

@router.get("/")
async def Home():
    return {"mensagem": "tela de usuario"}


@router.get("/")
async def Usuario(db = Depends(get_db)):
    return pessoa_crud.listar_pessoa(db)