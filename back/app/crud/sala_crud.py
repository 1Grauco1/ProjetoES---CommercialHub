from sqlalchemy.orm import Session
from app.schemas import sala_schemas
from app.models import Sala

def criar_sala(db : Session, dados_sala : sala_schemas.SalaCreate):
    sala = Sala(
        **dados_sala.model_dump()
    )
    
    db.add(sala)
    db.flush()
    
    return sala

def buscar_sala_id(db: Session, id : int):
    
    return db.query(Sala).filter(Sala.id == id).first()

def listar_sala_endereco(db : Session, id_endereço : int):
    
    return db.query(Sala).filter(Sala.id_endereco == id_endereço).first()

def listar_salas_proprietario(db : Session, id_proprietario : int):
    
    salas = db.query(Sala).filter(Sala.id_proprietario == id_proprietario).all()
    
    return salas

def listar_salas_tamanho_maior(db : Session, tamanho: float):
    return db.query(Sala).filter(Sala.tamanho > tamanho).all()

def listar_salas_tamanho_menor(db : Session, tamanho: float):
    return db.query(Sala).filter(Sala.tamanho < tamanho).all()
    
def editar_sala(db: Session, id : int, dados_sala_update : sala_schemas.SalaUpdatePatch):
    
    sala = buscar_sala_id(db, id)
    
    if not sala:
        return None
    
    dados = dados_sala_update.model_dump(
        exclude_unset=True
    )

    for campo, valor in dados.items():
        setattr(sala, campo, valor)

    db.commit()
    db.refresh(sala)

    return sala

def remover_sala(db : Session, dados_sala : sala_schemas.SalaResponse):
    
    sala = buscar_sala_id(db, dados_sala.id)
    if sala:
        db.delete(sala)
        db.commit()
        return sala
    
    return None