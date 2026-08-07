from app.crud import contrato_crud, sala_crud
from app.models.contrato import Contrato
from app.models.sala import StatusSala
from app.schemas import contrato_schemas, sala_schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session


def criar_contrato(db: Session, dados: contrato_schemas.ContratoCreate) -> Contrato:
    try:
        sala = sala_crud.buscar_sala_id(db, dados.id_sala)
        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada")
        if sala.status_ocupacao != StatusSala.DISPONIVEL:
            raise HTTPException(status_code=400, detail="Sala não está disponível")

        contrato = contrato_crud.criar_contrato(db, dados)
        sala_crud.editar_sala(
            db,
            dados.id_sala,
            sala_schemas.SalaUpdatePatch(status_ocupacao=StatusSala.ALUGADA),
        )
        db.commit()
        db.refresh(contrato)
        return contrato
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def editar_contrato(
    db: Session, id_contrato: int, dados: contrato_schemas.ContratoUpdate
) -> Contrato:
    try:
        contrato = contrato_crud.editar_contrato(db, id_contrato, dados)
        if not contrato:
            raise HTTPException(status_code=404, detail="Contrato não encontrado")

        db.commit()
        db.refresh(contrato)
        return contrato
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def remover_contrato(db: Session, id_contrato: int) -> dict:
    try:
        contrato = contrato_crud.remover_contrato(db, id_contrato)
        if not contrato:
            raise HTTPException(status_code=404, detail="Contrato não encontrado")
        db.commit()
        return {"message": "Contrato removido."}
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
