from enum import Enum

from sqlalchemy import Date, Float, ForeignKey
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class StatusContrato(Enum):
    ATIVO = "Ativo"
    ENCERRADO = "Encerrado"
    CANCELADO = "Cancelado"
    PENDENTE = "Pendente"


class Contrato(Base):
    __tablename__ = "contratos"

    id: Mapped[int] = mapped_column(primary_key=True)

    id_sala: Mapped[int] = mapped_column(ForeignKey("salas.id"))

    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))

    data_inicio: Mapped[Date] = mapped_column(Date)

    data_termino: Mapped[Date] = mapped_column(Date)

    valor: Mapped[float] = mapped_column(Float)

    status: Mapped[StatusContrato] = mapped_column(SQLEnum(StatusContrato))

    sala = relationship("Sala", back_populates="contratos")

    usuario = relationship("Usuario", back_populates="contratos")
