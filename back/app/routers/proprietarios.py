from app.crud import proprietario_crud
from app.dependencies.auth_dependency import get_current_user
from app.dependencies.db_dependency import get_db
from app.schemas.proprietario_schemas import ProprietarioCreate, ProprietarioResponse
from app.services import propietario_service
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/proprietarios", tags=["proprietarios"])


@router.get("/listar", response_model=list[ProprietarioResponse])
async def listar(db=Depends(get_db), user=Depends(get_current_user)):
    return proprietario_crud.listar_proprietarios(db)


@router.get("/buscar/{id}", response_model=ProprietarioResponse)
async def buscar(id: int, db=Depends(get_db), user=Depends(get_current_user)):
    prop = proprietario_crud.buscar_id_proprietario(db, id)
    if not prop:
        raise HTTPException(status_code=404, detail="Proprietário não encontrado")
    return prop


@router.post("/criar", response_model=ProprietarioResponse)
async def criar(
    dados: ProprietarioCreate, db=Depends(get_db), user=Depends(get_current_user)
):
    return propietario_service.registrar_proprietario(
        db, user.id_pessoa, dados.documentos
    )
