from app.core.security import criar_access_token, verificar_senha
from app.crud import usuario_crud
from app.schemas import auth_schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session


def realizar_login(db: Session, email: str, senha : str):
    try:

        usuario_buscado = usuario_crud.buscar_email(db, email)

        if not usuario_buscado:
            raise HTTPException(status_code=401, detail="Usuario não cadastrado!")

        if not verificar_senha(senha, usuario_buscado.senha):
            raise HTTPException(status_code=401, detail="Senha incorreta!")

        token = criar_access_token(
            {
                "sub": usuario_buscado.usuario,
                "id": usuario_buscado.id_pessoa,
                "nivel": usuario_buscado.nivel_acesso.value,
            }
        )
        
        db.commit()

        return {"access_token": token, "token_type": "bearer"}

    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
