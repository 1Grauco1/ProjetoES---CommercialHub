from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Endereco(Base):
    __tablename__ = "enderecos"

    id: Mapped[int] = mapped_column(primary_key=True)

    id_pessoa : Mapped[int] = mapped_column(Integer)

    rua: Mapped[str] = mapped_column(String(150))

    numero: Mapped[str] = mapped_column(String(20))

    bairro: Mapped[str] = mapped_column(String(100))

    cidade: Mapped[str] = mapped_column(String(100))

    estado: Mapped[str] = mapped_column(String(2))

    cep: Mapped[str] = mapped_column(String(9))

    sala = relationship(
        "Sala",
        back_populates="endereco",
        uselist=False
    )