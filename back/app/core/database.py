from app.core.config import DATABASE_URL
from app.models.base import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada no arquivo .env")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

import app.models  # noqa: F401  # garante que todos os modelos estejam registrados

Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
