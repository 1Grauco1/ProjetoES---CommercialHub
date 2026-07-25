from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.routers import auth, contratos, inquilinos, pessoas, proprietarios, salas,cep

app = FastAPI(title="CommercialHub", version="1.0")


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Libera POST, GET, DELETE, PUT, etc.
    allow_headers=["*"],  # Libera os cabeçalhos como Authorization e Content-Type
)

# Seus roteadores existentes
app.include_router(auth.router)
app.include_router(pessoas.router)
app.include_router(salas.router)
app.include_router(contratos.router)
app.include_router(proprietarios.router)
app.include_router(inquilinos.router)
app.include_router(cep.router)

# uvicorn app.main:app --reload