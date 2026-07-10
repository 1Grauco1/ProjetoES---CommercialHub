from fastapi import HTTPException

from app.crud import pessoa_crud
from app.crud import usuario_crud 
from app.schemas import usuario_schemas
from app.schemas import pessoa_schemas

from sqlalchemy.orm import Session

def cadastrar_usuario( db: Session, dados_usuario : usuario_schemas.CadastroUsuario):
    try:
        
        if usuario_crud.buscar_email(db, dados_usuario.email):
            raise HTTPException(
                status_code=409,
                detail="E-mail já cadastrado."
            )
        
        pessoa_criada = pessoa_crud.criar_pessoa(db, dados_usuario)
    
        usuario_criado = usuario_crud.criar_usuario(db, dados_usuario, pessoa_criada.id)

        db.commit()
        db.refresh(pessoa_criada)
        db.refresh(usuario_criado)
        
        return {"usuario" : usuario_criado, "pessoa" : pessoa_criada}
    
    except HTTPException:
        raise
    except Exception:
        db.rollback()
        raise
    
