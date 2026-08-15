from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.contrato import Contrato
from app.models.sala import Sala


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)

    id_pessoa: Mapped[int] = mapped_column(ForeignKey("pessoas.id"), unique=True)

    usuario: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    senha: Mapped[str] = mapped_column(String(255), nullable=False)

    pessoa = relationship("Pessoa", back_populates="usuario")

    salas: Mapped[list[Sala]] = relationship("Sala", back_populates="usuario")

    contratos: Mapped[list[Contrato]] = relationship(
        "Contrato", back_populates="usuario"
    )
