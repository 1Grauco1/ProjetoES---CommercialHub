from app.models.proprietario import Proprietario
from sqlalchemy import select
from sqlalchemy.orm import Session


def criar_proprietario(
    db: Session, id_pessoa: int, documentos: str
) -> Proprietario:
    proprietario = Proprietario(id_pessoa=id_pessoa, documentos=documentos)
    db.add(proprietario)
    db.flush()
    return proprietario


def buscar_id_proprietario(db: Session, id: int) -> Proprietario | None:
    return db.scalar(select(Proprietario).where(Proprietario.id == id))


def buscar_proprietario_pessoa(db: Session, id_pessoa: int) -> Proprietario | None:
    return db.scalar(select(Proprietario).where(Proprietario.id_pessoa == id_pessoa))


def listar_proprietarios(db: Session) -> list[Proprietario]:
    return list(db.scalars(select(Proprietario)))
