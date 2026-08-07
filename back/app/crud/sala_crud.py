from app.models import Endereco, Sala
from app.schemas import sala_schemas
from sqlalchemy import select
from sqlalchemy.orm import Session


def criar_sala(db: Session, dados_sala: sala_schemas.SalaCreate) -> Sala:
    sala = Sala(**dados_sala.model_dump())

    db.add(sala)
    db.flush()

    return sala


def buscar_sala_id(db: Session, id: int) -> Sala | None:
    return db.scalar(select(Sala).where(Sala.id == id))


def listar_salas_proprietario(db: Session, id_proprietario: int) -> list[Sala]:
    return list(
        db.scalars(select(Sala).where(Sala.id_proprietario == id_proprietario))
    )


def buscar_salas_filtros(
    db: Session, filtros: sala_schemas.SalaFilterSearch
) -> list[Sala]:
    conditions = []

    if filtros.cidade:
        conditions.append(Endereco.cidade.ilike(f"%{filtros.cidade}%"))

    if filtros.estado:
        conditions.append(Endereco.estado == filtros.estado)

    if filtros.cep:
        conditions.append(Endereco.cep == filtros.cep)

    if filtros.tamanho_min is not None:
        conditions.append(Sala.tamanho >= filtros.tamanho_min)

    if filtros.tamanho_max is not None:
        conditions.append(Sala.tamanho <= filtros.tamanho_max)

    if filtros.preco_min is not None:
        conditions.append(Sala.preco >= filtros.preco_min)

    if filtros.preco_max is not None:
        conditions.append(Sala.preco <= filtros.preco_max)

    if filtros.tipo is not None:
        conditions.append(Sala.tipo == filtros.tipo)

    query = select(Sala).join(Endereco).where(*conditions)

    return list(db.scalars(query))


def editar_sala(
    db: Session, id: int, dados_sala_update: sala_schemas.SalaUpdatePatch
) -> Sala | None:
    sala = buscar_sala_id(db, id)

    if not sala:
        return None

    dados = dados_sala_update.model_dump(exclude_unset=True)

    for campo, valor in dados.items():
        setattr(sala, campo, valor)

    return sala
