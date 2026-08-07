from app.crud import endereco_crud, proprietario_crud, sala_crud, foto_crud
from app.schemas import endereco_schema, sala_schemas
from app.services.arquivo_service import salvar_imagem
from fastapi import File, HTTPException, UploadFile
from sqlalchemy.orm import Session


def adicionar_sala(
    db: Session,
    dados_sala: sala_schemas.SalaCreate,
    dados_endereco: endereco_schema.EnderecoCreate,
    id_pessoa: int,
):
    try:
        proprietario = proprietario_crud.buscar_proprietario_pessoa(db, id_pessoa)
        if not proprietario:
            raise HTTPException(status_code=400, detail="Usuário não é proprietário.")

        endereco = endereco_crud.criar_endereco(db, dados_endereco)

        dados_sala.id_endereco = endereco.id
        dados_sala.id_proprietario = proprietario.id
        sala = sala_crud.criar_sala(db, dados_sala)

        if not sala:
            raise HTTPException(status_code=400, detail="Erro ao criar sala.")

        db.commit()
        db.refresh(sala)
        return sala
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


async def adicionar_foto(
    db: Session,
    id_sala: int,
    fotos: list[UploadFile],
    id_pessoa: int,
):
    try:

        sala = sala_crud.buscar_sala_id(db, id_sala)

        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada.")

        proprietario = proprietario_crud.buscar_proprietario_pessoa(db, id_pessoa)
        if not proprietario or sala.id_proprietario != proprietario.id:
            raise HTTPException(
                status_code=401, detail="Usuario não autorizado para realizar ação!"
            )

        for foto in fotos:
            caminho = await salvar_imagem(foto)
            foto_crud.adicionarFoto(db, id_sala, caminho)

        db.commit()
        db.refresh(sala)

        return sala

    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


async def remover_foto(
    db: Session,
    id_sala: int,
    id_foto: int,
    id_pessoa: int,
):
    try:
        sala = sala_crud.buscar_sala_id(db, id_sala)
        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada.")

        proprietario = proprietario_crud.buscar_proprietario_pessoa(db, id_pessoa)
        if not proprietario or sala.id_proprietario != proprietario.id:
            raise HTTPException(
                status_code=401, detail="Usuário não autorizado para realizar ação!"
            )

        foto_deletada = foto_crud.removerFoto(db, id_foto)

        if not foto_deletada:
            raise HTTPException(status_code=404, detail="Foto não encontrada.")

        db.commit()
        db.refresh(sala)

        return sala

    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def remover_sala(db: Session, id_sala: int, id_pessoa: int):
    try:
        sala = sala_crud.buscar_sala_id(db, id_sala)

        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada.")

        proprietario = proprietario_crud.buscar_proprietario_pessoa(db, id_pessoa)
        if not proprietario or sala.id_proprietario != proprietario.id:
            raise HTTPException(
                status_code=401, detail="Usuario não autorizado para realizar ação!"
            )

        db.delete(sala)
        db.commit()
        return {"message": "Sala removida."}

    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def buscar_salas(db: Session, dados_sala: sala_schemas.SalaFilterSearch):
    try:
        salas = sala_crud.buscar_salas_filtros(db, dados_sala)

        if not salas:
            raise HTTPException(status_code=400, detail="Sala não encontrada.")
        return salas
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
