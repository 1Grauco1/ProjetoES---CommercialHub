from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import DATABASE_URL

if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada no arquivo .env")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)

# O schema é gerenciado por migrations (alembic upgrade head), não por create_all.
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
