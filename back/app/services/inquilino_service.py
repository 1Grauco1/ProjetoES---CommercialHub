from app.crud import inquilino_crud
from fastapi import HTTPException
from sqlalchemy.orm import Session


def registrar_inquilino(db: Session, id_pessoa: int, cadastro_profissional: str):
    existente = inquilino_crud.buscar_inquilino_pessoa(db, id_pessoa)
    if existente:
        raise HTTPException(status_code=409, detail="Usuário já é inquilino")
    return inquilino_crud.criar_inquilino(db, id_pessoa, cadastro_profissional)
