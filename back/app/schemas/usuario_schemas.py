from pydantic import BaseModel, ConfigDict, Field

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class UsuarioCreate(BaseModel):
    id_pessoa: int
    usuario: str
    senha: str = Field(min_length=8)


class UsuarioResponse(BaseModel):
    id: int
    id_pessoa: int
    usuario: str

    model_config = ConfigDict(from_attributes=True)


class CadastroUsuario(BaseModel):
    nome: str
    email: str = Field(pattern=EMAIL_REGEX)
    telefone: str | None = None
    senha: str = Field(min_length=8)


class VerUsuario(BaseModel):
    nome: str
    email: str = Field(pattern=EMAIL_REGEX)
    telefone: str | None = None
