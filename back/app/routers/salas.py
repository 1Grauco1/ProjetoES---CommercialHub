from app.crud import proprietario_crud, sala_crud
from app.dependencies.auth_dependency import get_current_user
from app.dependencies.db_dependency import get_db
from app.schemas.endereco_schemas import EnderecoCreate
from app.schemas.sala_schemas import (
    SalaCreate,
    SalaFilterSearch,
    SalaResponse,
    SalaUpdatePayload,
)
from app.services import sala_service
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

router = APIRouter(prefix="/salas", tags=["salas"])


@router.post("/criar_sala", response_model=SalaResponse)
async def criar(
    dados_sala: SalaCreate,
    dados_endereco: EnderecoCreate,
    db=Depends(get_db),
    user=Depends(get_current_user),
):
    return sala_service.adicionar_sala(db, dados_sala, dados_endereco, user.id_pessoa)


@router.get("/minhas", response_model=list[SalaResponse])
async def minhas(db=Depends(get_db), user=Depends(get_current_user)):
    proprietario = proprietario_crud.buscar_proprietario_pessoa(db, user.id_pessoa)
    if not proprietario:
        return []
    return sala_crud.listar_salas_proprietario(db, proprietario.id)


@router.post("/buscar_salas/filtrar/", response_model=list[SalaResponse])
async def filtrar(
    dados_salas: SalaFilterSearch, db=Depends(get_db), user=Depends(get_current_user)
):
    return sala_service.buscar_salas(db, dados_salas)


@router.post("/buscar", response_model=list[SalaResponse])
async def buscar_publico(dados_salas: SalaFilterSearch, db=Depends(get_db)):
    return sala_service.buscar_salas(db, dados_salas)

@router.patch("/{id}", response_model=SalaResponse)
async def editar_por_id(
    id: int,
    payload: SalaUpdatePayload,
    db=Depends(get_db),
    user=Depends(get_current_user),
):
    return sala_service.editar_sala(db, id, payload, user.id_pessoa)

@router.get("/{id}", response_model=SalaResponse)
async def buscar_por_id(id: int, db=Depends(get_db)):
    sala = sala_crud.buscar_sala_id(db, id)
    if not sala:
        raise HTTPException(status_code=404, detail="Sala não encontrada")
    db.commit()
    db.refresh(sala)
    return sala


@router.patch("/{id}", response_model=SalaResponse)
async def editar_por_id(
    id: int,
    payload: SalaUpdatePayload,
    db=Depends(get_db),
    user=Depends(get_current_user),
):
    return sala_service.editar_sala(db, id, payload, user.id_pessoa)


@router.delete("/{id}")
async def remover_por_id(id: int, db=Depends(get_db), user=Depends(get_current_user)):
    return sala_service.remover_sala(db, id, user.id_pessoa)


@router.post("/{id}/foto", response_model=SalaResponse)
async def adicionar_foto_por_id(
    id: int,
    foto: list[UploadFile] = File(...),
    db=Depends(get_db),
    user=Depends(get_current_user),
):
    return await sala_service.adicionar_foto(db, id, foto, user.id_pessoa)


@router.delete("/{id_sala}/foto/{id_foto}", response_model=SalaResponse)
async def deletar_foto(
    id_sala: int,
    id_foto: int,
    db=Depends(get_db),
    user=Depends(get_current_user),
):
    return await sala_service.remover_foto(
        db=db, id_sala=id_sala, id_foto=id_foto, id_pessoa=user.id_pessoa
    )
