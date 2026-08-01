from app.crud import inquilino_crud
from app.dependencies.auth_dependencie import get_current_user
from app.dependencies.db_dependencie import get_db
from app.schemas.inquilino_schemas import InquilinoCreate, InquilinoResponse
from app.services import inquilino_service
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/inquilinos", tags=["inquilinos"])


@router.get("/listar/", response_model=list[InquilinoResponse])
async def listar(db=Depends(get_db), user=Depends(get_current_user)):
    return inquilino_crud.listar_inquilinos(db)


@router.get("/buscar/{id}", response_model=InquilinoResponse)
async def buscar(id: int, db=Depends(get_db), user=Depends(get_current_user)):
    inq = inquilino_crud.buscar_id_inquilino(db, id)
    if not inq:
        raise HTTPException(status_code=404, detail="Inquilino não encontrado")
    return inq


@router.post("/criar/", response_model=InquilinoResponse)
async def criar(
    dados: InquilinoCreate, db=Depends(get_db), user=Depends(get_current_user)
):
    return inquilino_service.registrar_inquilino(
        db, user.id_pessoa, dados.cadastro_profissional
    )
