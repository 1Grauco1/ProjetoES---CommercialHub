from pydantic import BaseModel, ConfigDict, Field


class EnderecoCreate(BaseModel):
    rua: str
    numero: str
    bairro: str
    cidade: str
    estado: str = Field(max_length=2)
    cep: str


class EnderecoResponse(BaseModel):
    id: int
    rua: str
    numero: str
    bairro: str
    cidade: str
    estado: str
    cep: str

    model_config = ConfigDict(from_attributes=True)


class EnderecoUpdate(BaseModel):
    rua: str | None = None
    numero: str | None = None
    bairro: str | None = None
    cidade: str | None = None
    estado: str | None = Field(default=None, max_length=2)
    cep: str | None = None
