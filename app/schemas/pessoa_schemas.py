from pydantic import BaseModel
from app.models.usuario import NivelAcesso

class PessoaCreate(BaseModel):
    nome: str
    email: str
    telefone: str
    
class PessoaResponse(BaseModel):
    id : int
    nome : str
    email : str
    telefone : str