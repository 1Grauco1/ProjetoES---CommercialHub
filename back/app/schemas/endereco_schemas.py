from typing import Optional

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
    rua: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = Field(default=None, max_length=2)
    cep: Optional[str] = None
