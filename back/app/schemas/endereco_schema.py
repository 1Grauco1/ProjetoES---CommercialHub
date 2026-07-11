from typing import Optional

from pydantic import BaseModel, ConfigDict


class EnderecoCreate(BaseModel):
    id_pessoa: int
    rua: str
    numero: str
    bairro: str
    cidade: str
    estado: str
    cep: str


class EnderecoResponse(BaseModel):
    id: int
    id_pessoa: int
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
    estado: Optional[str] = None
    cep: Optional[str] = None

