from fastapi import APIRouter, Depends
from app.dependencies.db_dependencie import get_db
from fastapi.responses import RedirectResponse
from app.services import pessoa_service, auth_service
from app.schemas import pessoa_schemas, usuario_schemas,auth_schemas

router = APIRouter( prefix="/auth", tags=["Autenticação"] )

@router.get("/")
def home():
    return RedirectResponse(url="/login", status_code= 302)

@router.post("/login")
def login(dados_login : auth_schemas.Login, db = Depends(get_db)):
    login = auth_service.checar_login(db, dados_login)
    
    return {"login" : login}

@router.post("/criar_conta")
def criar_conta( dados_usuario : usuario_schemas.CadastroUsuario, db = Depends(get_db)):
    usuario = pessoa_service.cadastrar_usuario(db, dados_usuario)
    return{"usuario" : usuario}
    

@router.post("/logoff")
def logoff():
    return{"mensagem":"usuario deslogado."}