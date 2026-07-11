from __future__ import annotations

from app.models.base import Base
from app.models.contrato import Contrato
from app.models.sala import Sala
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Proprietario(Base):
    __tablename__ = "proprietarios"

    id: Mapped[int] = mapped_column(primary_key=True)

    id_pessoa: Mapped[int] = mapped_column(ForeignKey("pessoas.id"), unique=True)

    documentos: Mapped[str] = mapped_column(Text)

    pessoa = relationship("Pessoa", back_populates="proprietario")
    contratos: Mapped[list["Contrato"]] = relationship(
        "Contrato", back_populates="proprietario"
    )

    salas: Mapped[list["Sala"]] = relationship("Sala", back_populates="proprietario")

