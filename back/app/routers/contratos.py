from app.crud import contrato_crud
from app.dependencies.auth_dependencie import get_current_user
from app.dependencies.db_dependencie import get_db
from app.schemas.contrato_schemas import (
    ContratoCreate,
    ContratoResponse,
    ContratoUpdate,
)
from app.services import contrato_service
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/contratos", tags=["contratos"])


@router.get("/", response_model=list[ContratoResponse])
async def listar(db=Depends(get_db)):
    return contrato_crud.listar_contratos(db)


@router.get("/{id}", response_model=ContratoResponse)
async def buscar(id: int, db=Depends(get_db)):
    contrato = contrato_crud.buscar_contrato(db, id)
    if not contrato:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")
    return contrato


@router.post("/", response_model=ContratoResponse)
async def criar(
    dados: ContratoCreate, db=Depends(get_db), user=Depends(get_current_user)
):
    return contrato_service.criar_contrato(db, dados)


@router.patch("/{id}", response_model=ContratoResponse)
async def editar(
    id: int, dados: ContratoUpdate, db=Depends(get_db), user=Depends(get_current_user)
):
    return contrato_service.editar_contrato(db, id, dados)


@router.delete("/{id}")
async def remover(id: int, db=Depends(get_db), user=Depends(get_current_user)):
    return contrato_service.remover_contrato(db, id)
