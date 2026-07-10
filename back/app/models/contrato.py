
from sqlalchemy import Date, Float, ForeignKey,Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum
from sqlalchemy import Enum as SQLEnum

from app.models.base import Base



class StatusContrato(Enum):
    ATIVO = "Ativo"
    ENCERRADO = "Encerrado"
    CANCELADO = "Cancelado"
    PENDENTE = "Pendente"

class Contrato(Base):
    __tablename__ = "contratos"



    id: Mapped[int] = mapped_column(primary_key=True)

    id_sala: Mapped[int] = mapped_column(
        ForeignKey("salas.id")
    )

    id_inquilino: Mapped[int] = mapped_column(
        ForeignKey("inquilinos.id")
    )
    
    id_proprietario: Mapped[int] = mapped_column(
        ForeignKey("proprietarios.id")
    )

    data_inicio: Mapped[Date] = mapped_column(Date)

    data_termino: Mapped[Date] = mapped_column(Date)

    valor: Mapped[float] = mapped_column(Float)

    status: Mapped[StatusContrato] = mapped_column(SQLEnum(StatusContrato))

    sala = relationship(
        "Sala",
        back_populates="contratos"
    )

    inquilino = relationship(
        "Inquilino",
        back_populates="contratos"
    )
    
    proprietario = relationship(
        "Proprietario",
        back_populates="contratos"
    )