from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud import contrato_crud, sala_crud
from app.models.contrato import Contrato, StatusContrato
from app.models.sala import StatusSala
from app.schemas import contrato_schemas, sala_schemas


def criar_contrato(
    db: Session, dados: contrato_schemas.ContratoCreate, id_usuario: int
) -> Contrato:
    try:
        sala = sala_crud.buscar_sala_id(db, dados.id_sala)
        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada")
        if sala.id_usuario != id_usuario:
            raise HTTPException(
                status_code=401, detail="Usuário não autorizado para realizar ação!"
            )
        if sala.status_ocupacao != StatusSala.DISPONIVEL:
            raise HTTPException(status_code=400, detail="Sala não está disponível")

        contrato = contrato_crud.criar_contrato(db, dados, id_usuario)
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
    db: Session,
    id_contrato: int,
    dados: contrato_schemas.ContratoUpdate,
    id_usuario: int,
) -> Contrato:
    try:
        contrato = contrato_crud.buscar_contrato(db, id_contrato)
        if not contrato:
            raise HTTPException(status_code=404, detail="Contrato não encontrado")
        if contrato.id_usuario != id_usuario:
            raise HTTPException(
                status_code=401, detail="Usuário não autorizado para realizar ação!"
            )

        contrato = contrato_crud.editar_contrato(db, id_contrato, dados)
        if not contrato:
            raise HTTPException(status_code=404, detail="Contrato não encontrado")

        if dados.status is not None:
            sala = sala_crud.buscar_sala_id(db, contrato.id_sala)
            if sala:
                if dados.status in (
                    StatusContrato.ENCERRADO,
                    StatusContrato.CANCELADO,
                ):
                    sala_crud.editar_sala(
                        db,
                        sala.id,
                        sala_schemas.SalaUpdatePatch(
                            status_ocupacao=StatusSala.DISPONIVEL
                        ),
                    )
                elif dados.status in (
                    StatusContrato.ATIVO,
                    StatusContrato.PENDENTE,
                ):
                    if sala.status_ocupacao == StatusSala.DISPONIVEL:
                        sala_crud.editar_sala(
                            db,
                            sala.id,
                            sala_schemas.SalaUpdatePatch(
                                status_ocupacao=StatusSala.ALUGADA
                            ),
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


def remover_contrato(db: Session, id_contrato: int, id_usuario: int) -> dict:
    try:
        contrato = contrato_crud.buscar_contrato(db, id_contrato)
        if not contrato:
            raise HTTPException(status_code=404, detail="Contrato não encontrado")
        if contrato.id_usuario != id_usuario:
            raise HTTPException(
                status_code=401, detail="Usuário não autorizado para realizar ação!"
            )

        sala = sala_crud.buscar_sala_id(db, contrato.id_sala)
        contrato_crud.remover_contrato(db, id_contrato)

        if sala:
            sala_crud.editar_sala(
                db,
                sala.id,
                sala_schemas.SalaUpdatePatch(status_ocupacao=StatusSala.DISPONIVEL),
            )

        db.commit()
        return {"message": "Contrato removido."}
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
