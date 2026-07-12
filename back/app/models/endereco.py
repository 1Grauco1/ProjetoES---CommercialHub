from app.models.base import Base
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Endereco(Base):
    __tablename__ = "enderecos"

    id: Mapped[int] = mapped_column(primary_key=True)

    rua: Mapped[str] = mapped_column(String(150))

    numero: Mapped[str] = mapped_column(String(20))

    bairro: Mapped[str] = mapped_column(String(100))

    cidade: Mapped[str] = mapped_column(String(100))

    estado: Mapped[str] = mapped_column(String(2))

    cep: Mapped[str] = mapped_column(String(9))

    sala = relationship("Sala", back_populates="endereco", uselist=False)
    
    pessoa = relationship("Pessoa", back_populates="endereco", uselist=False)
