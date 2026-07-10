from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

def gerar_hash(senha):
    return password_hash.hash(senha)


def verificar_senha(senha, hash):
    return password_hash.verify(senha, hash)

from datetime import datetime, timedelta, timezone
import jwt

SECRET_KEY = "LobinhaIndefesa"
ALGORITHM = "HS256"

def criar_access_token(data: dict):
    payload = data.copy()

    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=45)

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )