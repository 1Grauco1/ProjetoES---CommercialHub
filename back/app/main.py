import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import auth, cep, contratos, pessoas, salas

app = FastAPI(title="CommercialHub", version="1.0")


@app.get("/health")
def health():
    return {"status": "ok"}


UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)


ALLOWED_ORIGINS_RAW = os.getenv("ALLOWED_ORIGINS", "")
if ALLOWED_ORIGINS_RAW:
    origins = [o.strip() for o in ALLOWED_ORIGINS_RAW.split(",") if o.strip()]
else:
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seus roteadores existentes
app.include_router(auth.router)
app.include_router(pessoas.router)
app.include_router(salas.router)
app.include_router(contratos.router)
app.include_router(cep.router)

app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# uvicorn app.main:app --reload
