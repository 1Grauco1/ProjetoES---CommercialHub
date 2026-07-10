from fastapi import HTTPException
from app.crud import usuario_crud
from app.schemas import auth_schemas
from app.core.security import verificar_senha, criar_access_token

from sqlalchemy.orm import Session

def checar_login(db : Session, dados_login : auth_schemas.Login):
    try:
        
        usuario_buscado = usuario_crud.buscar_email(db, dados_login.email)
        
        if not usuario_buscado:
            raise HTTPException(
                status_code=401,
                detail="Usuario não cadastrado!"
            )
        
        if not verificar_senha(dados_login.senha, usuario_buscado.senha):
            raise HTTPException(
                status_code=401,
                detail="Senha incorreta!"
            )
        
        
        token = criar_access_token({
            "sub" : usuario_buscado.usuario,
            "id" : usuario_buscado.id_pessoa,
            "nivel" : usuario_buscado.nivel_acesso.value
        })
        
        return { "access_token" : token, "token_type": "bearer"}
    
    except HTTPException:
        raise
    except Exception:
        db.rollback()
        raise