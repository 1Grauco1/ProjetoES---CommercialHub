from app.crud import pessoa_crud
from app.dependencies.auth_dependencie import get_current_user
from app.dependencies.db_dependencie import get_db
from app.schemas.pessoa_schemas import PessoaResponse, PessoaUpdate
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/usuario", tags=["usuario"])


@router.get("/listar", response_model=list[PessoaResponse])
async def listar_usuarios(db=Depends(get_db), user=Depends(get_current_user)):
    return pessoa_crud.listar_pessoa(db)


@router.get("/me", response_model=PessoaResponse)
async def me(db=Depends(get_db), user=Depends(get_current_user)):
    pessoa = pessoa_crud.buscar_pessoa(db, user.id_pessoa)
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")
    return pessoa


@router.get("/buscar/{id_pessoa}", response_model=PessoaResponse)
async def buscar_usuario(id_pessoa: int, db=Depends(get_db), user=Depends(get_current_user)):
    pessoa = pessoa_crud.buscar_pessoa(db, id_pessoa)
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")
    return pessoa


@router.patch("/editar/{id_pessoa}", response_model=PessoaResponse)
async def editar_usuario(
    id_pessoa: int,
    dados: PessoaUpdate,
    db=Depends(get_db),
    user=Depends(get_current_user),
):
    if user.id_pessoa != id_pessoa:
        raise HTTPException(
            status_code=401, detail="Usuário não autorizado para realizar ação!"
        )
    pessoa = pessoa_crud.editar_pessoa(db, dados, id_pessoa)
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")
    db.commit()
    db.refresh(pessoa)
    return pessoa
