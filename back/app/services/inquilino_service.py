from app.crud import inquilino_crud
from app.models.inquilino import Inquilino
from fastapi import HTTPException
from sqlalchemy.orm import Session


def registrar_inquilino(
    db: Session, id_pessoa: int, cadastro_profissional: str
) -> Inquilino:
    try:
        existente = inquilino_crud.buscar_inquilino_pessoa(db, id_pessoa)
        if existente:
            raise HTTPException(status_code=409, detail="Usuário já é inquilino")
        inquilino = inquilino_crud.criar_inquilino(db, id_pessoa, cadastro_profissional)
        db.commit()
        db.refresh(inquilino)
        return inquilino
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
