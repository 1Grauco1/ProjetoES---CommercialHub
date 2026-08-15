from app.models.proprietario import Proprietario
from sqlalchemy.orm import Session


def criar_proprietario(db: Session, id_pessoa: int, documentos: str):
    proprietario = Proprietario(id_pessoa=id_pessoa, documentos=documentos)
    db.add(proprietario)
    db.flush()
    return proprietario


def buscar_id_proprietario(db: Session, id: int):
    return db.query(Proprietario).filter(Proprietario.id == id).first()


def buscar_proprietario_pessoa(db: Session, id_pessoa: int):
    return db.query(Proprietario).filter(Proprietario.id_pessoa == id_pessoa).first()


def listar_proprietarios(db: Session):
    return db.query(Proprietario).all()
