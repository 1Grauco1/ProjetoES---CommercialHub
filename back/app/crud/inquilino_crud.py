from app.models.inquilino import Inquilino
from sqlalchemy import select
from sqlalchemy.orm import Session


def criar_inquilino(db: Session, id_pessoa: int, cadastro_profissional: str) -> Inquilino:
    inquilino = Inquilino(
        id_pessoa=id_pessoa, cadastro_profissional=cadastro_profissional
    )
    db.add(inquilino)
    db.flush()
    return inquilino


def buscar_id_inquilino(db: Session, id: int) -> Inquilino | None:
    return db.scalar(select(Inquilino).where(Inquilino.id == id))


def buscar_inquilino_pessoa(db: Session, id_pessoa: int) -> Inquilino | None:
    return db.scalar(select(Inquilino).where(Inquilino.id_pessoa == id_pessoa))


def listar_inquilinos(db: Session) -> list[Inquilino]:
    return list(db.scalars(select(Inquilino)))
