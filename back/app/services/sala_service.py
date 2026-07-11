from app.crud import sala_crud
from app.schemas import sala_schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session


def adicionar_sala(db: Session, dados_sala: sala_schemas.SalaCreate):
    try:
        sala = sala_crud.criar_sala(db, dados_sala)

        if not sala:
            raise HTTPException(status_code=400, detail="Erro ao criar sala.")
        return sala
    except HTTPException:
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

    except HTTPException:
        raise

    except Exception:
        db.rollback()
        raise
