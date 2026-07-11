from app.core.security import verificar_access_token
from app.crud.usuario_crud import buscar_usuario_id
from app.dependencies.db_dependencie import get_db
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(token_Url="/auth/login")


def get_usuario_atual(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credenciais_exceptions = HTTPException(
        status_code=401,
        detail="Credenciais Invalidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verificar_access_token(token)
        id_usuario: int = payload.get(id)
        if id_usuario is None:
            raise credenciais_exceptions

    except Exception:
        raise credenciais_exceptions

    usuario = buscar_id_usuario(db, id_usuario)
    if usuario is None:
        raise credenciais_exceptions

    return usuario
