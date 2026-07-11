from app.models.usuario import NivelAcesso
from pydantic import BaseModel


class UsuarioCreate(BaseModel):
    id_pessoa: int
    usuario: str
    senha: str
    nivel_acesso: NivelAcesso


class UsuarioResponse(BaseModel):
    id: int
    id_pessoa: int
    usuario: str
    nivel_acesso: NivelAcesso


class CadastroUsuario(BaseModel):
    nome: str
    email: str
    id_pessoa: int
    telefone: str
    senha: str
    nivel_acesso: NivelAcesso


class VerUsuario(BaseModel):
    nome: str
    email: str
    telefone: str
    nivel_acesso: NivelAcesso

