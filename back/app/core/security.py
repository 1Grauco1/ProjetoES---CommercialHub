from datetime import UTC, datetime, timedelta

import jwt
from pwdlib import PasswordHash

from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY

password_hash = PasswordHash.recommended()

if SECRET_KEY is None:
    raise ValueError("SECRET_KEY não configurada no ambiente")


def gerar_hash(senha):
    return password_hash.hash(senha)


def verificar_senha(senha, hash):
    return password_hash.verify(senha, hash)


def criar_access_token(data: dict):
    payload = data.copy()

    agora = datetime.now(UTC)
    payload["iat"] = agora
    payload["exp"] = agora + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verificar_access_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
