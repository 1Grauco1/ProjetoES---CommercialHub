from typing import Optional

from app.models.sala import StatusSala
from pydantic import BaseModel, ConfigDict


class SalaCreate(BaseModel):

    id_proprietario: int
    id_endereco: int
    tamanho: float
    preco: float
    status_ocupacao: StatusSala
    fotos: str | None


class SalaResponse(BaseModel):

    id: int
    id_proprietario: int
    id_endereco: int
    tamanho: float
    preco: float
    status_ocupacao: StatusSala
    fotos: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class SalaUpdatePatch(BaseModel):

    id_endereco: Optional[int] = None
    tamanho: Optional[float] = None
    preco: Optional[float] = None
    status_ocupacao: Optional[StatusSala] = None
    fotos: Optional[str] = None
    
class SalaFilterSearch(BaseModel):

    cidade : Optional[str] = None
    estado: Optional[str] = None
    CEP : Optional[str] = None
    tamanho_min: Optional[float] = None
    tamanho_max: Optional[float] = None
    preco_min: Optional[float] = None
    preco_max: Optional[float] = None
    
    
  
