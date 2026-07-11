from sqlalchemy.orm  import Session
from app.models.pessoa import Pessoa
from app.schemas import usuario_schemas, pessoa_schemas

def criar_pessoa(db: Session, dados_pessoa : usuario_schemas.CadastroUsuario ):
     pessoa = Pessoa(nome = dados_pessoa.nome, email = dados_pessoa.email, telefone = dados_pessoa.telefone)

     db.add(pessoa)
     db.flush()

     return pessoa

def listar_pessoa(db:Session):
    return db.query(Pessoa).all()

def buscar_pessoa(db:Session, id_pessoa : int):
     return db.query(Pessoa).filter(Pessoa.id==id_pessoa).first()

def editar_pessoa(db : Session, dados_pessoa_update : pessoa_schemas.PessoaUpdate, id : int ):
     
     pessoa = buscar_pessoa(db,id)
     
     if not pessoa:
          return None
     
     dados = dados_pessoa_update.model_dump(
          exclude_unset= True
     )
     
     for campo, valor in dados.items():
          setattr(pessoa,campo,valor)
     
     db.commit()
     db.refresh(pessoa)
     
     return pessoa