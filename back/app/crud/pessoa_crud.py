from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.pessoa import Pessoa
from app.schemas import pessoa_schemas, usuario_schemas


def criar_pessoa(db: Session, dados_pessoa: usuario_schemas.CadastroUsuario) -> Pessoa:
    pessoa = Pessoa(
        nome=dados_pessoa.nome, email=dados_pessoa.email, telefone=dados_pessoa.telefone
    )

    db.add(pessoa)
    db.flush()

    return pessoa


def buscar_pessoa(db: Session, id_pessoa: int) -> Pessoa | None:
    return db.scalar(select(Pessoa).where(Pessoa.id == id_pessoa))


def editar_pessoa(
    db: Session, dados_pessoa_update: pessoa_schemas.PessoaUpdate, id: int
) -> Pessoa | None:
    pessoa = buscar_pessoa(db, id)

    if not pessoa:
        return None

    dados = dados_pessoa_update.model_dump(exclude_unset=True)

    for campo, valor in dados.items():
        setattr(pessoa, campo, valor)

    return pessoa
