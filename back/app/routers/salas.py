from app.crud import sala_crud
from app.dependencies.auth_dependencie import get_current_user
from app.dependencies.db_dependencie import get_db
from app.schemas.sala_schemas import SalaCreate, SalaResponse, SalaUpdatePatch, SalaFilterSearch
from app.schemas.endereco_schema import EnderecoCreate
from app.services import sala_service
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

router = APIRouter(prefix="/salas", tags=["salas"])


@router.post("/criar_sala", response_model=SalaResponse)
async def criar(dados_sala: SalaCreate,dados_endereco : EnderecoCreate, db=Depends(get_db), user=Depends(get_current_user)):
    return sala_service.adicionar_sala(db, dados_sala, dados_endereco)


@router.patch("/editar_sala/{id}", response_model=SalaResponse)
async def editar(
    id: int, dados: SalaUpdatePatch, db=Depends(get_db), user=Depends(get_current_user)
):
    sala = sala_crud.editar_sala(db, id, dados)
    if not sala:
        raise HTTPException(status_code=404, detail="Sala não encontrada")
    db.commit()
    db.refresh(sala)
    return sala

@router.post("/adicionar_foto/{id}", response_model=SalaResponse)
async def adicionar_foto(dados_sala : SalaResponse, foto : UploadFile, db = Depends(get_db), user = Depends(get_current_user)):
    return sala_service.adicionar_foto(db,dados_sala,foto,user)


@router.delete("/remover/{id}")
async def remover(id: int, db=Depends(get_db), user=Depends(get_current_user)):
    sala = sala_crud.buscar_sala_id(db, id)
    if not sala:
        raise HTTPException(status_code=404, detail="Sala não encontrada")
    sala_service.remover_sala(db, SalaResponse.model_validate(sala), user.id_pessoa)
    return {"mensagem": "Sala removida"}

@router.post("/buscar_salas/filtrar/")
async def filtrar(dados_salas : SalaFilterSearch ,db = Depends(get_db), user = Depends(get_current_user)):
    salas = sala_service.buscar_salas(db,dados_salas)
    return {"mensagem" : "Filtros aplicados."}

