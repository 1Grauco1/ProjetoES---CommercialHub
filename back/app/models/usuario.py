from enum import Enum

from app.models.base import Base
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class NivelAcesso(Enum):
    ADMIN = "Administrador"
    PROPRIETARIO = "Proprietário"
    INQUILINO = "Inquilino"


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)

    id_pessoa: Mapped[int] = mapped_column(ForeignKey("pessoas.id"), unique=True)

    usuario: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    senha: Mapped[str] = mapped_column(String(255), nullable=False)

    nivel_acesso: Mapped[NivelAcesso] = mapped_column(SQLEnum(NivelAcesso))

    pessoa = relationship("Pessoa", back_populates="usuario")

