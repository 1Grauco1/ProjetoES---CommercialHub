from app.crud import sala_crud, endereco_crud
from app.schemas import sala_schemas, endereco_schema
from app.services.arquivo_service import salvar_imagem
from fastapi import HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os, uuid


def adicionar_sala(db: Session, dados_sala: sala_schemas.SalaCreate, dados_endereco : endereco_schema.EnderecoCreate):
    try:
        endereco = endereco_crud.criar_endereco(db,dados_endereco)
        
        dados_sala.id_endereco = endereco.id
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

async def adicionar_foto(db : Session, dados_sala : sala_schemas.SalaResponse, foto : UploadFile,id_usuario : int):
    try:        
        
        sala = sala_crud.buscar_sala_id(db, dados_sala.id)
        
        if not sala:
            raise HTTPException(status_code=400, detail="Sala não encontrada.")
        
        if sala.id_proprietario != id_usuario:
            raise HTTPException(status_code=401, detail="Usuario não autorizado para realizar ação!")
        caminho = await salvar_imagem(foto)
        
        sala_crud.atualizar_foto(db,dados_sala.id,caminho)
        
        db.commit()
        db.refresh(sala)
        
        return sala
        
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise

def remover_sala(db: Session, dados_sala: sala_schemas.SalaResponse, id_usuario: int):
    try:
        sala = sala_crud.buscar_sala_id(db, dados_sala.id)

        if not sala:
            raise HTTPException(status_code=400, detail="Sala não encontrada.")

        if sala.id_proprietario != id_usuario:
            raise HTTPException(
                status_code=401, detail="Usuario não autorizado para realizar ação!"
            )

        sala_crud.remover_sala(db, dados_sala)
        
        db.commit()
        db.refresh(sala)
        
        return sala

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise

def buscar_sala(db:Session, dados_sala : sala_schemas.SalaFilterSearch):
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
    