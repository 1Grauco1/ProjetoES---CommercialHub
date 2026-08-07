from app.crud import (
    inquilino_crud,
    pessoa_crud,
    proprietario_crud,
    usuario_crud,
)
from app.models.pessoa import Pessoa
from app.models.usuario import NivelAcesso
from app.schemas import pessoa_schemas, usuario_schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session


def cadastrar_usuario(
    db: Session, dados_usuario: usuario_schemas.CadastroUsuario
) -> dict:
    try:
        if dados_usuario.nivel_acesso == NivelAcesso.ADMIN:
            raise HTTPException(
                status_code=400, detail="Não é possível criar conta de Administrador."
            )

        if usuario_crud.buscar_email(db, dados_usuario.email):
            raise HTTPException(status_code=409, detail="E-mail já cadastrado.")

        pessoa_criada = pessoa_crud.criar_pessoa(db, dados_usuario)

        usuario_criado = usuario_crud.criar_usuario(db, dados_usuario, pessoa_criada.id)

        db.commit()
        db.refresh(pessoa_criada)
        db.refresh(usuario_criado)

        return {"usuario": usuario_criado, "pessoa": pessoa_criada}

    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def editar_usuario(
    db: Session, id_pessoa: int, dados: pessoa_schemas.PessoaUpdate
) -> Pessoa:
    try:
        pessoa = pessoa_crud.editar_pessoa(db, dados, id_pessoa)
        if not pessoa:
            raise HTTPException(status_code=404, detail="Pessoa não encontrada")
        db.commit()
        db.refresh(pessoa)
        return pessoa
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
