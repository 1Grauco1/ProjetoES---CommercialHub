from app.models.endereco import Endereco
from app.schemas import endereco_schemas
from sqlalchemy import select
from sqlalchemy.orm import Session


def criar_endereco(db: Session, dados_endereco: endereco_schemas.EnderecoCreate) -> Endereco:
    endereco = Endereco(
        rua=dados_endereco.rua,
        numero=dados_endereco.numero,
        bairro=dados_endereco.bairro,
        cidade=dados_endereco.cidade,
        estado=dados_endereco.estado,
        cep=dados_endereco.cep,
    )

    db.add(endereco)
    db.flush()

    return endereco


def buscar_endereco(db: Session, id_endereco: int) -> Endereco | None:
    return db.scalar(select(Endereco).where(Endereco.id == id_endereco))


def editar_endereco(
    db: Session, id_endereco: int, dados_endereco_update: endereco_schemas.EnderecoUpdate
) -> Endereco | None:
    endereco = buscar_endereco(db, id_endereco)

    if not endereco:
        return None

    dados = dados_endereco_update.model_dump(exclude_unset=True)

    for campo, valor in dados.items():
        setattr(endereco, campo, valor)

    return endereco
