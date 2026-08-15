import os
from pathlib import Path

from dotenv import load_dotenv

# Fonte única de carregamento de ambiente: `back/.env` (padrão),
# com fallback para `back/app/.env` (localização legada).
BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR / "app" / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")

SECRET_KEY = os.getenv("SECRET_KEY")


ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60
