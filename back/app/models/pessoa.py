from app.models.base import Base
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Pessoa(Base):
    __tablename__ = "pessoas"

    id: Mapped[int] = mapped_column(primary_key=True)

    nome: Mapped[str] = mapped_column(String(150), nullable=False)

    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)

    telefone: Mapped[str] = mapped_column(String(20))
    
    id_endereco : Mapped[int] = mapped_column(ForeignKey("enderecos.id"), nullable= True)

    usuario = relationship("Usuario", back_populates="pessoa", uselist=False)

    proprietario = relationship("Proprietario", back_populates="pessoa", uselist=False)

    inquilino = relationship("Inquilino", back_populates="pessoa", uselist=False)
    
    endereco = relationship("Endereco", back_populates="pessoa", uselist= False )
    
