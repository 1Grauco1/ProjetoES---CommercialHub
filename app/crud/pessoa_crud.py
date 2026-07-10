from sqlalchemy.orm  import Session
from app.models.pessoa import Pessoa
from app.schemas import usuario_schemas

def criar_pessoa(db: Session, dados_pessoa : usuario_schemas.CadastroUsuario ):
     pessoa = Pessoa(nome = dados_pessoa.nome, email = dados_pessoa.email, telefone = dados_pessoa.telefone)

     db.add(pessoa)
     db.flush()

     return pessoa

def listar_pessoa(db:Session):
    return db.query(Pessoa).all()