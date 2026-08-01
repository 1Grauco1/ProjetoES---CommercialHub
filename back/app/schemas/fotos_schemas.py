from typing import Optional
from pydantic import BaseModel, ConfigDict

class FotosCreate(BaseModel):
    id_sala: int
    caminho: str
    
class FotoResponse(BaseModel):
    id : int
    id_sala : int
    caminho : str
    
    