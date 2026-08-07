from app.crud import proprietario_crud
from app.models.proprietario import Proprietario
from fastapi import HTTPException
from sqlalchemy.orm import Session


def registrar_proprietario(
    db: Session, id_pessoa: int, documentos: str
) -> Proprietario:
    try:
        existente = proprietario_crud.buscar_proprietario_pessoa(db, id_pessoa)
        if existente:
            raise HTTPException(status_code=409, detail="Usuário já é proprietário")
        proprietario = proprietario_crud.criar_proprietario(db, id_pessoa, documentos)
        db.commit()
        db.refresh(proprietario)
        return proprietario
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
