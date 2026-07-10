from fastapi import FastAPI
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

from app.routers import (
    pessoas,
    salas,
    contratos,
    auth
)

app = FastAPI(
    title="CommercialHub",
    version="1.0"
)

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

app.include_router(auth.router)

app.include_router(pessoas.router)

app.include_router(salas.router)

app.include_router(contratos.router)

#uvicorn app.main:app --reload