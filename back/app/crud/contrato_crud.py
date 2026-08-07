from app.models.contrato import Contrato
from app.schemas import contrato_schemas
from sqlalchemy import select
from sqlalchemy.orm import Session


def criar_contrato(db: Session, dados_contrato: contrato_schemas.ContratoCreate) -> Contrato:
    contrato = Contrato(**dados_contrato.model_dump())

    db.add(contrato)
    db.flush()
    db.refresh(contrato)

    return contrato


def listar_contratos(db: Session) -> list[Contrato]:
    return list(db.scalars(select(Contrato)))


def buscar_contrato(db: Session, id: int) -> Contrato | None:
    return db.scalar(select(Contrato).where(Contrato.id == id))


def editar_contrato(
    db: Session,
    id_contrato: int,
    dados_contrato_atualizar: contrato_schemas.ContratoUpdate,
) -> Contrato | None:
    contrato = buscar_contrato(db, id_contrato)

    if not contrato:
        return None

    dados = dados_contrato_atualizar.model_dump(exclude_unset=True)

    for campo, valor in dados.items():
        setattr(contrato, campo, valor)

    return contrato


def remover_contrato(db: Session, id_contrato: int) -> Contrato | None:
    contrato = buscar_contrato(db, id_contrato)

    if contrato:
        db.delete(contrato)

        return contrato

    return None
