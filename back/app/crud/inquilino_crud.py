from app.models.inquilino import Inquilino
from sqlalchemy.orm import Session


def criar_inquilino(db: Session, id_pessoa: int, cadastro_profissional: str):
    inquilino = Inquilino(
        id_pessoa=id_pessoa, cadastro_profissional=cadastro_profissional
    )
    db.add(inquilino)
    db.flush()
    return inquilino


def buscar_id_inquilino(db: Session, id: int):
    return db.query(Inquilino).filter(Inquilino.id == id).first()


def buscar_inquilino_pessoa(db: Session, id_pessoa: int):
    return db.query(Inquilino).filter(Inquilino.id_pessoa == id_pessoa).first()


def listar_inquilinos(db: Session):
    return db.query(Inquilino).all()
