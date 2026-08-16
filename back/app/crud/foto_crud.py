from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.foto import Foto


def adicionarFoto(db: Session, id_sala: int, caminho: str) -> None:
    foto = Foto(id_sala=id_sala, caminho=caminho)
    db.add(foto)
    db.flush()


def buscarFoto(db: Session, id: int) -> Foto | None:
    return db.scalar(select(Foto).where(Foto.id == id))


def removerFoto(db: Session, id_foto: int) -> Foto | None:
    foto = db.scalar(select(Foto).where(Foto.id == id_foto))
    if not foto:
        return None
    removerArquivo(db, id_foto)
    db.delete(foto)
    return foto


def removerFotosCompletas(db: Session, id_sala: int) -> None:
    lista_fotos = list(db.scalars(select(Foto).where(Foto.id_sala == id_sala)))

    for foto in lista_fotos:
        removerArquivo(db, foto.id)
        db.delete(foto)


def removerArquivo(db: Session, id_foto: int) -> None:
    foto = buscarFoto(db, id_foto)

    if foto:
        arquivo = Path(foto.caminho)
        if arquivo.exists():
            arquivo.unlink()
