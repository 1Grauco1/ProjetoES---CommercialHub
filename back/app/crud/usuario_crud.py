from app.core.security import gerar_hash
from app.models.usuario import Usuario
from app.schemas import auth_schemas, usuario_schemas
from sqlalchemy.orm import Session


def criar_usuario(db: Session, dados: usuario_schemas.CadastroUsuario, id_pessoa: int):

    print("Senha:", dados.senha)
    print("Tipo:", type(dados.senha))
    print("Tamanho:", len(dados.senha))

    usuario = Usuario(
        id_pessoa=id_pessoa,
        usuario=dados.email,
        senha=gerar_hash(dados.senha),
        nivel_acesso=dados.nivel_acesso,
    )

    db.add(usuario)
    db.flush()

    return usuario


def buscar_email(db: Session, email: str):

    checagem_email = db.query(Usuario).filter(Usuario.usuario == email).first()

    return checagem_email

def buscar_id_usuario(db: Session, id_usuario: int):
    return db.query(Usuario)filter(Usuario.id_pessoa == id_usuario).first()

