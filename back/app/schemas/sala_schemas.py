from typing import List, Optional

from app.models.sala import StatusSala, TipoSala
from app.schemas.endereco_schemas import EnderecoResponse, EnderecoUpdate
from pydantic import BaseModel, ConfigDict, Field, field_validator


class SalaCreate(BaseModel):

    id_proprietario: Optional[int] = None
    id_endereco: Optional[int] = None
    titulo: str
    tamanho: float = Field(gt=0)
    preco: float = Field(gt=0)
    status_ocupacao: StatusSala
    descricao: str
    tipo: TipoSala


class FotoResponse(BaseModel):
    id: int
    id_sala: int
    caminho: str

    model_config = ConfigDict(from_attributes=True)


class SalaResponse(BaseModel):

    id: int
    id_proprietario: int
    id_endereco: int
    titulo: str
    tamanho: float
    preco: float
    status_ocupacao: StatusSala
    fotos: List[FotoResponse] = []
    descricao: str
    tipo: TipoSala
    endereco: Optional[EnderecoResponse] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator("fotos", mode="before")
    @classmethod
    def normalizar_fotos(cls, valor):
        if valor is None:
            return []
        if isinstance(valor, str):
            return [{"id": 0, "id_sala": 0, "caminho": valor}]
        if isinstance(valor, (list, tuple)):
            return list(valor)
        return valor


class SalaUpdatePatch(BaseModel):

    titulo: Optional[str] = None
    id_endereco: Optional[int] = None
    tamanho: Optional[float] = Field(default=None, gt=0)
    preco: Optional[float] = Field(default=None, gt=0)
    status_ocupacao: Optional[StatusSala] = None
    descricao: Optional[str] = None
    tipo: Optional[TipoSala] = None


class SalaUpdatePayload(BaseModel):

    dados_sala: Optional[SalaUpdatePatch] = None
    dados_endereco: Optional[EnderecoUpdate] = None


class SalaFilterSearch(BaseModel):

    cidade: Optional[str] = None
    estado: Optional[str] = None
    cep: Optional[str] = None
    tamanho_min: Optional[float] = Field(default=None, gt=0)
    tamanho_max: Optional[float] = Field(default=None, gt=0)
    preco_min: Optional[float] = Field(default=None, gt=0)
    preco_max: Optional[float] = Field(default=None, gt=0)
    tipo: Optional[TipoSala] = None
