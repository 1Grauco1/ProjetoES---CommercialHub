from fastapi import APIRouter, Depends, HTTPException

from app.crud import contrato_crud
from app.dependencies.auth_dependency import get_current_user
from app.dependencies.db_dependency import get_db
from app.schemas.contrato_schemas import (
    ContratoCreate,
    ContratoResponse,
    ContratoUpdate,
)
from app.services import contrato_service

router = APIRouter(prefix="/contratos", tags=["contratos"])


@router.get("/", response_model=list[ContratoResponse])
async def listar(db=Depends(get_db), user=Depends(get_current_user)):
    return contrato_crud.listar_contratos(db, user.id)


@router.get("/buscar_contrato/{id}", response_model=ContratoResponse)
async def buscar(id: int, db=Depends(get_db), user=Depends(get_current_user)):
    contrato = contrato_crud.buscar_contrato(db, id)
    if not contrato:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")
    if contrato.id_usuario != user.id:
        raise HTTPException(
            status_code=401, detail="Usuário não autorizado para realizar ação!"
        )
    return contrato


@router.post("/adicionar_contrato/", response_model=ContratoResponse)
async def criar(
    dados: ContratoCreate, db=Depends(get_db), user=Depends(get_current_user)
):
    return contrato_service.criar_contrato(db, dados, user.id)


@router.patch("/editar_contrato/{id}", response_model=ContratoResponse)
async def editar(
    id: int, dados: ContratoUpdate, db=Depends(get_db), user=Depends(get_current_user)
):
    return contrato_service.editar_contrato(db, id, dados, user.id)


@router.delete("/remove/{id}")
async def remover(id: int, db=Depends(get_db), user=Depends(get_current_user)):
    return contrato_service.remover_contrato(db, id, user.id)
