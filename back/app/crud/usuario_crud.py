from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import gerar_hash
from app.models.usuario import Usuario
from app.schemas import usuario_schemas


def criar_usuario(
    db: Session, dados: usuario_schemas.CadastroUsuario, id_pessoa: int
) -> Usuario:
    usuario = Usuario(
        id_pessoa=id_pessoa,
        usuario=dados.email,
        senha=gerar_hash(dados.senha),
    )

    db.add(usuario)
    db.flush()

    return usuario


def buscar_email(db: Session, email: str) -> Usuario | None:
    return db.scalar(select(Usuario).where(Usuario.usuario == email))


def buscar_usuario_por_id_pessoa(db: Session, id_pessoa: int) -> Usuario | None:
    return db.scalar(select(Usuario).where(Usuario.id_pessoa == id_pessoa))
