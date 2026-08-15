from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.contrato import Contrato
from app.schemas import contrato_schemas


def criar_contrato(
    db: Session,
    dados_contrato: contrato_schemas.ContratoCreate,
    id_usuario: int,
) -> Contrato:
    contrato = Contrato(
        id_sala=dados_contrato.id_sala,
        id_usuario=id_usuario,
        data_inicio=dados_contrato.data_inicio,
        data_termino=dados_contrato.data_termino,
        valor=dados_contrato.valor,
        status=dados_contrato.status,
    )

    db.add(contrato)
    db.flush()
    db.refresh(contrato)

    return contrato


def listar_contratos(db: Session, id_usuario: int) -> list[Contrato]:
    return list(db.scalars(select(Contrato).where(Contrato.id_usuario == id_usuario)))


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
