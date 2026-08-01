from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class PessoaCreate(BaseModel):
    nome: str
    email: str = Field(pattern=EMAIL_REGEX)
    telefone: Optional[str] = Field(default=None, max_length=20)
    id_endereco: int | None = None


class PessoaResponse(BaseModel):
    id: int
    nome: str
    email: str
    telefone: str
    id_endereco: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class PessoaUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = Field(default=None, pattern=EMAIL_REGEX)
    telefone: Optional[str] = Field(default=None, max_length=20)
