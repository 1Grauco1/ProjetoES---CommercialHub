from typing import Optional

from app.models.sala import StatusSala
from pydantic import BaseModel, ConfigDict


class SalaCreate(BaseModel):

    id_proprietario: int
    id_endereco: int
    tamanho: float
    preco: float
    status_ocupacao: StatusSala
    fotos: str


class SalaResponse(BaseModel):

    id: int
    id_proprietario: int
    id_endereco: int
    tamanho: float
    preco: float
    status_ocupacao: StatusSala
    fotos: str

    model_config = ConfigDict(from_attributes=True)


class SalaUpdatePatch(BaseModel):

    id_endereco: Optional[int] = None
    tamanho: Optional[float] = None
    preco: Optional[float] = None
    status_ocupacao: Optional[StatusSala] = None
    fotos: Optional[str] = None
