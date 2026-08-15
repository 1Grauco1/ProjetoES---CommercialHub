from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.sala import StatusSala, TipoSala
from app.schemas.endereco_schemas import EnderecoResponse, EnderecoUpdate


class SalaCreate(BaseModel):
    id_usuario: int | None = None
    id_endereco: int | None = None
    titulo: str
    tamanho: float = Field(gt=0)
    preco: float = Field(gt=0)
    status_ocupacao: StatusSala
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
    fotos: list[FotoResponse] = []
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
    endereco: EnderecoResponse | None = None
    proprietario_whatsapp: str | None = None

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
    titulo: str | None = None
    tamanho: float | None = Field(default=None, gt=0)
    preco: float | None = Field(default=None, gt=0)
    status_ocupacao: StatusSala | None = None
    descricao: str | None = None
    tipo: TipoSala | None = None
    quartos: int | None = Field(default=None, ge=0)
    banheiros: int | None = Field(default=None, ge=0)
    vagas_garagem: int | None = Field(default=None, ge=0)
    ar_condicionado: bool | None = None
    elevador: bool | None = None
    portaria: bool | None = None
    mobiliada: bool | None = None
    internet: bool | None = None
    alarme: bool | None = None
    estacionamento: bool | None = None


class SalaUpdatePayload(BaseModel):
    dados_sala: SalaUpdatePatch | None = None
    dados_endereco: EnderecoUpdate | None = None


class SalaFilterSearch(BaseModel):
    termo: str | None = None
    cidade: str | None = None
    estado: str | None = None
    bairro: str | None = None
    cep: str | None = None
    status_ocupacao: StatusSala | None = None
    tamanho_min: float | None = Field(default=None, gt=0)
    tamanho_max: float | None = Field(default=None, gt=0)
    preco_min: float | None = Field(default=None, gt=0)
    preco_max: float | None = Field(default=None, gt=0)
    tipo: TipoSala | None = None
    quartos_min: int | None = Field(default=None, ge=0)
    banheiros_min: int | None = Field(default=None, ge=0)
    vagas_garagem_min: int | None = Field(default=None, ge=0)
    ar_condicionado: bool | None = None
    elevador: bool | None = None
    portaria: bool | None = None
    mobiliada: bool | None = None
    internet: bool | None = None
    alarme: bool | None = None
    estacionamento: bool | None = None
