from app.crud import inquilino_crud
from app.dependencies.auth_dependencie import get_current_user
from app.dependencies.db_dependencie import get_db
from app.schemas.inquilino_schemas import InquilinoCreate, InquilinoResponse
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/inquilinos", tags=["inquilinos"])


@router.get("/", response_model=list[InquilinoResponse])
async def listar(db=Depends(get_db)):
    return inquilino_crud.listar_inquilinos(db)


@router.get("/{id}", response_model=InquilinoResponse)
async def buscar(id: int, db=Depends(get_db)):
    inq = inquilino_crud.buscar_inquilino_id(db, id)
    if not inq:
        raise HTTPException(status_code=404, detail="Inquilino não encontrado")
    return inq


@router.post("/", response_model=InquilinoResponse)
async def criar(
    dados: InquilinoCreate, db=Depends(get_db), user=Depends(get_current_user)
):
    existente = inquilino_crud.buscar_inquilino_pessoa(db, user.id_pessoa)
    if existente:
        raise HTTPException(status_code=409, detail="Usuário já é inquilino")
    return inquilino_crud.criar_inquilino(
        db, user.id_pessoa, dados.cadastro_profissional
    )
