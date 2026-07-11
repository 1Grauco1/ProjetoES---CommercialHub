from app.models.contrato import Contrato
from app.schemas import contrato_schemas
from sqlalchemy.orm import Session


def criar_contrato(db: Session, dados_contrato: contrato_schemas.ContratoCreate):

    contrato = Contrato(**dados_contrato.model_dump())

    db.add(contrato)
    db.flush()
    db.refresh(contrato)

    return contrato


def listar_contrato_inquilino(db: Session, id_usuario: int):

    return db.query(Contrato).filter(Contrato.id_inquilino == id_usuario).all()


def listar_contrato_proprietario(db: Session, id_usuario: int):

    return db.query(Contrato).filter(Contrato.id_proprietario == id_usuario).all()


def listar_contratos(db: Session):
    return db.query(Contrato).all()


def buscar_contrato(db: Session, id: int):
    return db.query(Contrato).filter(Contrato.id == id).first()


def editar_contrato(
    db: Session,
    id_contrato: int,
    dados_contrato_atualizar: contrato_schemas.ContratoUpdate,
):

    contrato = buscar_contrato(db, id_contrato)

    if not contrato:
        return None

    dados = dados_contrato_atualizar.model_dump(exclude_unset=True)

    for campo, valor in dados.items():
        setattr(contrato, campo, valor)

    db.commit()
    db.refresh(contrato)

    return contrato


def remover_contrato(db: Session, id_contrato: int):

    contrato = buscar_contrato(db, id_contrato)

    if contrato:

        db.delete(contrato)
        db.commit()
        return contrato

    return None
