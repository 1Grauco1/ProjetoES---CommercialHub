from fastapi import HTTPException

from app.crud import pessoa_crud
from app.crud import usuario_crud 
from app.schemas import usuario_schemas
from app.schemas import pessoa_schemas

from sqlalchemy.orm import Session


        