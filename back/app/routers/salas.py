from app.crud import sala_crud
from app.dependencies.auth_dependencie import get_current_user
from app.dependencies.db_dependencie import get_db
from app.schemas.sala_schemas import SalaCreate, SalaResponse, SalaUpdatePatch
from app.services import sala_service
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/salas", tags=["salas"])


@router.get("/", response_model=list[SalaResponse])
async def listar(db=Depends(get_db)):
    return sala_crud.listar_salas(db)


@router.get("/{id}", response_model=SalaResponse)
async def buscar(id: int, db=Depends(get_db)):
    sala = sala_crud.buscar_sala_id(db, id)
    if not sala:
        raise HTTPException(status_code=404, detail="Sala não encontrada")
    return sala


@router.post("/", response_model=SalaResponse)
async def criar(dados: SalaCreate, db=Depends(get_db), user=Depends(get_current_user)):
    return sala_service.adicionar_sala(db, dados)


@router.patch("/{id}", response_model=SalaResponse)
async def editar(
    id: int, dados: SalaUpdatePatch, db=Depends(get_db), user=Depends(get_current_user)
):
    sala = sala_crud.editar_sala(db, id, dados)
    if not sala:
        raise HTTPException(status_code=404, detail="Sala não encontrada")
    return sala


@router.delete("/{id}")
async def remover(id: int, db=Depends(get_db), user=Depends(get_current_user)):
    sala = sala_crud.buscar_sala_id(db, id)
    if not sala:
        raise HTTPException(status_code=404, detail="Sala não encontrada")
    sala_service.remover_sala(db, SalaResponse.model_validate(sala), user.id_pessoa)
    return {"mensagem": "Sala removida"}
