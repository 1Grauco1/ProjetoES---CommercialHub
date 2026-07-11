from __future__ import annotations

from enum import Enum

from app.models.base import Base
from app.models.contrato import Contrato
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


class StatusSala(Enum):
    DISPONIVEL = "Disponível"
    RESERVADA = "Reservada"
    ALUGADA = "Alugada"
    MANUTENCAO = "Manutenção"


class Sala(Base):
    __tablename__ = "salas"

    id: Mapped[int] = mapped_column(primary_key=True)

    id_proprietario: Mapped[int] = mapped_column(ForeignKey("proprietarios.id"))

    id_endereco: Mapped[int] = mapped_column(ForeignKey("enderecos.id"))

    tamanho: Mapped[float] = mapped_column(Float)

    preco: Mapped[float] = mapped_column(Float)

    status_ocupacao: Mapped[StatusSala] = mapped_column(SQLEnum(StatusSala))

    fotos: Mapped[str] = mapped_column(Text)

    proprietario = relationship("Proprietario", back_populates="salas")

    endereco = relationship("Endereco", back_populates="sala")

    contratos: Mapped[list["Contrato"]] = relationship(
        "Contrato", back_populates="sala"
    )

