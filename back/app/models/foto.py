from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Foto(Base):
    __tablename__ = "fotos"

    id: Mapped[int] = mapped_column(primary_key=True)
    id_sala: Mapped[int] = mapped_column(ForeignKey("salas.id"))
    caminho: Mapped[str] = mapped_column(Text, nullable=False)

    sala = relationship(
        "Sala",
        back_populates="fotos",
    )
