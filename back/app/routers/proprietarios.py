from app.crud import propietario_crud
from app.dependencies.auth_dependencie import get_current_user
from app.dependencies.db_dependencie import get_db
from app.schemas.proprietario_schemas import ProprietarioCreate, ProprietarioResponse
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/proprietarios", tags=["proprietarios"])


@router.get("/", response_model=list[ProprietarioResponse])
async def listar(db=Depends(get_db)):
    return propietario_crud.listar_proprietarios(db)


@router.get("/{id}", response_model=ProprietarioResponse)
async def buscar(id: int, db=Depends(get_db)):
    prop = propietario_crud.buscar_id_proprietario(db, id)
    if not prop:
        raise HTTPException(status_code=404, detail="Proprietário não encontrado")
    return prop


@router.post("/", response_model=ProprietarioResponse)
async def criar(
    dados: ProprietarioCreate, db=Depends(get_db), user=Depends(get_current_user)
):
    existente = propietario_crud.buscar_proprietario_pessoa(db, user.id_pessoa)
    if existente:
        raise HTTPException(status_code=409, detail="Usuário já é proprietário")
    return propietario_crud.criar_proprietario(db, user.id_pessoa, dados.documentos)
