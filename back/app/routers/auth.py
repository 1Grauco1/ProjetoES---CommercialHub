from fastapi.security import OAuth2PasswordRequestForm

from app.dependencies.db_dependencie import get_db
from app.schemas import auth_schemas, usuario_schemas
from app.services import auth_service, pessoa_service
from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.get("/")
def home():
    return RedirectResponse(url="/login", status_code=302)


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    token = auth_service.realizar_login(
        db=db,
        email=form_data.username,
        senha=form_data.password
    )

    return token


@router.post("/criar_conta")
def criar_conta(dados_usuario: usuario_schemas.CadastroUsuario, db=Depends(get_db)):
    usuario = pessoa_service.cadastrar_usuario(db, dados_usuario)
    return {"usuario": usuario}


@router.post("/logoff")
def logoff():
    return {"mensagem": "usuario deslogado."}
