
from app.models.sala import Sala
import os
import uuid

from app.crud import endereco_crud, proprietario_crud, sala_crud, foto_crud
from app.schemas import endereco_schema, sala_schemas
from app.services.arquivo_service import salvar_imagem
from fastapi import File, HTTPException, UploadFile
from sqlalchemy.orm import Session


def adicionar_sala(
    db: Session,
    dados_sala: sala_schemas.SalaCreate,
    dados_endereco: endereco_schemas.EnderecoCreate,
    id_usuario: int,
) -> Sala:
    try:
        endereco = endereco_crud.criar_endereco(db, dados_endereco)

        dados_sala.id_endereco = endereco.id
        dados_sala.id_usuario = id_usuario
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


def editar_sala(
    db: Session,
    id_sala: int,
    payload: sala_schemas.SalaUpdatePayload,
    id_usuario: int,
) -> Sala:
    try:
        sala = sala_crud.buscar_sala_id(db, id_sala)
        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada")
        if sala.id_usuario != id_usuario:
            raise HTTPException(
                status_code=401, detail="Usuário não autorizado para realizar ação!"
            )

        if payload.dados_sala:
            sala = sala_crud.editar_sala(db, id_sala, payload.dados_sala)
        if payload.dados_endereco:
            endereco_crud.editar_endereco(db, sala.id_endereco, payload.dados_endereco)

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
    id_usuario: int,
) -> Sala:
    try:

        sala = sala_crud.buscar_sala_id(db, id_sala)

        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada.")

        if sala.id_usuario != id_usuario:
            raise HTTPException(
                status_code=401, detail="Usuario não autorizado para realizar ação!"
            )
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
    id_usuario: int,
) -> Sala:
    try:
        sala = sala_crud.buscar_sala_id(db, id_sala)
        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada.")

        if sala.id_usuario != id_usuario:
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


def remover_sala(db: Session, id_sala: int, id_usuario: int) -> dict:
    try:
        sala = sala_crud.buscar_sala_id(db, id_sala)

        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada.")

        if sala.id_usuario != id_usuario:
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
        return sala_crud.buscar_salas_filtros(db, dados_sala)
    except Exception:
        db.rollback()
        raise
