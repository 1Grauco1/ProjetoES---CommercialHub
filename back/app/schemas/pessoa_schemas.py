from pydantic import BaseModel, ConfigDict, Field

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class PessoaResponse(BaseModel):
    id: int
    nome: str
    email: str
    telefone: str | None = None
    id_endereco: int | None = None

    model_config = ConfigDict(from_attributes=True)


class PessoaUpdate(BaseModel):
    nome: str | None = None
    email: str | None = Field(default=None, pattern=EMAIL_REGEX)
    telefone: str | None = Field(default=None, max_length=20)
