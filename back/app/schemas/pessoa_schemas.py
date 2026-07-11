from typing import Optional

from pydantic import BaseModel, ConfigDict


class PessoaCreate(BaseModel):
    nome: str
    email: str
    telefone: str


class PessoaResponse(BaseModel):
    id: int
    nome: str
    email: str
    telefone: str

    model_config = ConfigDict(from_attributes=True)


class PessoaUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
