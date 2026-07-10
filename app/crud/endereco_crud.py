from sqlalchemy.orm import Session
from app.models.endereco import Endereco 

def criar_endereco(db: Session,id_pessoa: int, rua : str, numero : str, bairro : str, cidade : str, estado : str, cep : str):

    endereco = Endereco(id_pessoa = id_pessoa, rua = rua, numero = numero, bairro = bairro, cidade = cidade, estado = estado, cep = cep)

    db.add(endereco)
    db.flush()

    return endereco

def listar_endereco_usuario(db: Session, id_pessoa: int):
    
    return db.query(Endereco).filter_by(id_pessoa == id_pessoa).all()
