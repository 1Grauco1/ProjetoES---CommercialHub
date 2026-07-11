from __future__ import annotations

from app.models.base import Base
from app.models.contrato import Contrato
from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Inquilino(Base):
    __tablename__ = "inquilinos"

    id: Mapped[int] = mapped_column(primary_key=True)

    id_pessoa: Mapped[int] = mapped_column(ForeignKey("pessoas.id"), unique=True)

    cadastro_profissional: Mapped[str] = mapped_column(Text)

    pessoa = relationship("Pessoa", back_populates="inquilino")

    contratos: Mapped[list["Contrato"]] = relationship(
        "Contrato", back_populates="inquilino"
    )

