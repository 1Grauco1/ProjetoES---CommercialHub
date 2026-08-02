from typing import Optional

from app.models.sala import StatusSala, TipoSala
from app.schemas.endereco_schema import EnderecoResponse, EnderecoUpdate
from pydantic import BaseModel, ConfigDict, field_validator


class SalaCreate(BaseModel):

    id_proprietario: Optional[int] = None
    id_endereco: Optional[int] = None
    titulo: str
    tamanho: float
    preco: float
    status_ocupacao: StatusSala
    fotos: str | None
    descricao: str
    tipo: TipoSala


class SalaResponse(BaseModel):

    id: int
    id_proprietario: int
    id_endereco: int
    titulo: str
    tamanho: float
    preco: float
    status_ocupacao: StatusSala
    fotos: Optional[str] = None
    descricao: str
    tipo: TipoSala
    endereco: Optional[EnderecoResponse] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator("fotos", mode="before")
    @classmethod
    def normalizar_fotos(cls, valor):
        if valor is None or isinstance(valor, str):
            return valor
        if isinstance(valor, (list, tuple)):
            if not valor:
                return None
            return getattr(valor[0], "caminho", None) or str(valor[0])
        return valor


class SalaUpdatePatch(BaseModel):

    titulo: Optional[str] = None
    id_endereco: Optional[int] = None
    tamanho: Optional[float] = None
    preco: Optional[float] = None
    status_ocupacao: Optional[StatusSala] = None
    fotos: Optional[str] = None
    descricao: Optional[str] = None
    tipo: Optional[TipoSala] = None


class SalaUpdatePayload(BaseModel):

    dados_sala: Optional[SalaUpdatePatch] = None
    dados_endereco: Optional[EnderecoUpdate] = None


class SalaFilterSearch(BaseModel):

    cidade: Optional[str] = None
    estado: Optional[str] = None
    CEP: Optional[str] = None
    tamanho_min: Optional[float] = None
    tamanho_max: Optional[float] = None
    preco_min: Optional[float] = None
    preco_max: Optional[float] = None
    tipo: Optional[TipoSala] = None
