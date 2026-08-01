from typing import Optional

from pydantic import BaseModel, ConfigDict


class PessoaCreate(BaseModel):
    nome: str
    email: str
    telefone: str
    id_endereco : int | None


class PessoaResponse(BaseModel):
    id: int
    nome: str
    email: str
    telefone: str
    id_endereco: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class PessoaUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
