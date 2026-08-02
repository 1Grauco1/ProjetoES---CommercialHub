from fastapi import Path

from app.models.foto import Foto
from sqlalchemy.orm import Session


def adicionarFoto(db : Session, id_sala: int, caminho: str):
    foto = Foto(id_sala = id_sala, caminho = caminho)
    db.add(foto)
    db.flush()

def buscarFoto(db : Session, id : int):
    return db.query(Foto).filter(Foto.id == id).first()
    
def removerFoto(db: Session, id_foto:int):
    foto = db.query(Foto).filter(Foto.id == id_foto).first()
    removerArquivo(db, id_foto)
    db.delete(foto)

def removerFotosCompletas(db: Session, id_sala: int):
    
    lista_fotos = db.query(Foto).filter(Foto.id_sala == id_sala).all()  
    
    for foto in lista_fotos:
        removerArquivo(db, foto.id)
        db.delete(foto)
    
def removerArquivo(db : Session, id_foto : int):
    foto = buscarFoto(db, id_foto)
    
    if foto:
        arquivo = Path(foto.caminho)
        if arquivo.exists():
            arquivo.unlink()
    
    
    
