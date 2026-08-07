from typing import List, Optional

from app.models.sala import StatusSala, TipoSala
from app.schemas.endereco_schema import EnderecoResponse, EnderecoUpdate
from pydantic import BaseModel, ConfigDict, field_validator


class SalaCreate(BaseModel):

    id_usuario: Optional[int] = None
    id_endereco: Optional[int] = None
    titulo: str
    tamanho: float
    preco: float
    status_ocupacao: StatusSala
    fotos: str | None
    descricao: str
    tipo: TipoSala
    quartos: int = Field(default=0, ge=0)
    banheiros: int = Field(default=0, ge=0)
    vagas_garagem: int = Field(default=0, ge=0)
    ar_condicionado: bool = False
    elevador: bool = False
    portaria: bool = False
    mobiliada: bool = False
    internet: bool = False
    alarme: bool = False
    estacionamento: bool = False


class FotoResponse(BaseModel):
    id: int
    id_sala: int
    caminho: str

    model_config = ConfigDict(from_attributes=True)


class SalaResponse(BaseModel):

    id: int
    id_usuario: int
    id_endereco: int
    titulo: str
    tamanho: float
    preco: float
    status_ocupacao: StatusSala
    fotos: List[FotoResponse] = []
    descricao: str
    tipo: TipoSala
    quartos: int
    banheiros: int
    vagas_garagem: int
    ar_condicionado: bool
    elevador: bool
    portaria: bool
    mobiliada: bool
    internet: bool
    alarme: bool
    estacionamento: bool
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
        return valor


class SalaUpdatePatch(BaseModel):

    titulo: Optional[str] = None
    id_endereco: Optional[int] = None
    tamanho: Optional[float] = Field(default=None, gt=0)
    preco: Optional[float] = Field(default=None, gt=0)
    status_ocupacao: Optional[StatusSala] = None
    fotos: Optional[str] = None
    descricao: Optional[str] = None
    tipo: Optional[TipoSala] = None
    quartos: Optional[int] = Field(default=None, ge=0)
    banheiros: Optional[int] = Field(default=None, ge=0)
    vagas_garagem: Optional[int] = Field(default=None, ge=0)
    ar_condicionado: Optional[bool] = None
    elevador: Optional[bool] = None
    portaria: Optional[bool] = None
    mobiliada: Optional[bool] = None
    internet: Optional[bool] = None
    alarme: Optional[bool] = None
    estacionamento: Optional[bool] = None


class SalaUpdatePayload(BaseModel):

    dados_sala: Optional[SalaUpdatePatch] = None
    dados_endereco: Optional[EnderecoUpdate] = None


class SalaFilterSearch(BaseModel):

    termo: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    bairro: Optional[str] = None
    cep: Optional[str] = None
    status_ocupacao: Optional[StatusSala] = None
    tamanho_min: Optional[float] = Field(default=None, gt=0)
    tamanho_max: Optional[float] = Field(default=None, gt=0)
    preco_min: Optional[float] = Field(default=None, gt=0)
    preco_max: Optional[float] = Field(default=None, gt=0)
    tipo: Optional[TipoSala] = None
    quartos_min: Optional[int] = Field(default=None, ge=0)
    banheiros_min: Optional[int] = Field(default=None, ge=0)
    vagas_garagem_min: Optional[int] = Field(default=None, ge=0)
    ar_condicionado: Optional[bool] = None
    elevador: Optional[bool] = None
    portaria: Optional[bool] = None
    mobiliada: Optional[bool] = None
    internet: Optional[bool] = None
    alarme: Optional[bool] = None
    estacionamento: Optional[bool] = None
