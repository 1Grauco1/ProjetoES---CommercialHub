from __future__ import annotations

from enum import Enum

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.contrato import Contrato


class StatusSala(Enum):
    DISPONIVEL = "Disponível"
    RESERVADA = "Reservada"
    ALUGADA = "Alugada"
    MANUTENCAO = "Manutenção"


class TipoSala(Enum):
    COMERCIAL = "Comercial"
    RESIDENCIAL = "Residencial"


class Sala(Base):
    __tablename__ = "salas"

    id: Mapped[int] = mapped_column(primary_key=True)

    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))

    id_endereco: Mapped[int] = mapped_column(ForeignKey("enderecos.id"))

    titulo: Mapped[str] = mapped_column(String(150), nullable=False)

    tamanho: Mapped[float] = mapped_column(Float)

    preco: Mapped[float] = mapped_column(Float)

    status_ocupacao: Mapped[StatusSala] = mapped_column(SQLEnum(StatusSala))

    descricao: Mapped[str] = mapped_column(Text, nullable=False)

    tipo: Mapped[TipoSala] = mapped_column(SQLEnum(TipoSala), nullable=False)

    quartos: Mapped[int] = mapped_column(Integer, default=0)
    banheiros: Mapped[int] = mapped_column(Integer, default=0)
    vagas_garagem: Mapped[int] = mapped_column(Integer, default=0)

    ar_condicionado: Mapped[bool] = mapped_column(Boolean, default=False)
    elevador: Mapped[bool] = mapped_column(Boolean, default=False)
    portaria: Mapped[bool] = mapped_column(Boolean, default=False)
    mobiliada: Mapped[bool] = mapped_column(Boolean, default=False)
    internet: Mapped[bool] = mapped_column(Boolean, default=False)
    alarme: Mapped[bool] = mapped_column(Boolean, default=False)
    estacionamento: Mapped[bool] = mapped_column(Boolean, default=False)

    usuario = relationship("Usuario", back_populates="salas")

    @property
    def proprietario_whatsapp(self) -> str | None:
        try:
            return self.usuario.pessoa.telefone or None
        except AttributeError, InvalidRequestError:
            return None

    endereco = relationship("Endereco", back_populates="sala")

    contratos: Mapped[list[Contrato]] = relationship("Contrato", back_populates="sala")
    fotos = relationship("Foto", back_populates="sala", cascade="all, delete-orphan")
