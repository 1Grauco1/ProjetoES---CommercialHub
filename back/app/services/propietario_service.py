from app.crud import proprietario_crud
from fastapi import HTTPException
from sqlalchemy.orm import Session


def registrar_proprietario(db: Session, id_pessoa: int, documentos: str):
    existente = proprietario_crud.buscar_proprietario_pessoa(db, id_pessoa)
    if existente:
        raise HTTPException(status_code=409, detail="Usuário já é proprietário")
    return proprietario_crud.criar_proprietario(db, id_pessoa, documentos)
