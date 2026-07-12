from app.core.config import ALGORITHM, SECRET_KEY
from pwdlib import PasswordHash
from datetime import datetime, timedelta, timezone

import jwt

password_hash = PasswordHash.recommended()

if SECRET_KEY is None:
    raise ValueError("SECRET_KEY não configurada no ambiente")


def gerar_hash(senha):
    return password_hash.hash(senha)


def verificar_senha(senha, hash):
    return password_hash.verify(senha, hash)


def criar_access_token(data: dict):
    payload = data.copy()

    payload["exp"] = datetime.now(timezone.utc) + timedelta(hours=6)

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verificar_access_token(token: str):
    return jwt.decode(token, SECRET_KEY,algorithms=[ALGORITHM])
