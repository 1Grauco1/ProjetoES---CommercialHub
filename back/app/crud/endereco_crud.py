from sqlalchemy.orm import Session
from app.models.endereco import Endereco
from app.schemas import endereco_schema

def criar_endereco(db: Session,id_pessoa: int, rua : str, numero : str, bairro : str, cidade : str, estado : str, cep : str):

    endereco = Endereco(id_pessoa = id_pessoa, rua = rua, numero = numero, bairro = bairro, cidade = cidade, estado = estado, cep = cep)

    db.add(endereco)
    db.flush()

    return endereco

def listar_endereco_usuario(db: Session, id_pessoa: int):
    
    return db.query(Endereco).filter_by(id_pessoa == id_pessoa).all()

def buscar_endereco(db : Session, id_endereco : int):
    return db.query(Endereco).filter_by(id_endereco).first

def editar_endereco(db : Session, id_endereco : int, dados_endereco_update : endereco_schema.EnderecoUpdate):
    
    endereco = buscar_endereco(db, id_endereco)
    
    if not endereco:
        return None
    
    dados = dados_endereco_update.model_dump(
        exclude_unset= True
    )
    
    for campo,valor in dados.items:
        setattr(endereco, campo, valor)
    
    db.commit()
    db.refresh(endereco)
    
    return endereco

def remover_endereco(db : Session, id_endereco : int):
    
    endereco = buscar_endereco(db, id_endereco)
    
    if endereco:
        db.delete(endereco)
        db.commit()
        
        return {"message" : "Endereço removido."}
    
    return None
        
