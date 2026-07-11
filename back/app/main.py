from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

from app.routers import auth, contratos, inquilinos, pessoas, proprietarios, salas

app = FastAPI(title="CommercialHub", version="1.0")

app.include_router(auth.router)
app.include_router(pessoas.router)
app.include_router(salas.router)
app.include_router(contratos.router)
app.include_router(proprietarios.router)
app.include_router(inquilinos.router)

# uvicorn app.main:app --reload
