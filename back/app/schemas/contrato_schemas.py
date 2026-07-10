from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict
from app.models.contrato import StatusContrato 

class ContratoCreate(BaseModel):
    id_sala: int
    id_inquilino: int
    data_inicio: date
    data_termino: date
    valor: float
    status: StatusContrato


class ContratoResponse(BaseModel):
    id: int
    id_sala: int
    id_inquilino: int
    data_inicio: date
    data_termino: date
    valor: float
    status: StatusContrato

    model_config = ConfigDict(from_attributes=True)


class ContratoUpdate(BaseModel):
    data_inicio: Optional[date] = None
    data_termino: Optional[date] = None
    valor: Optional[float] = None
    status: Optional[StatusContrato] = None


    
    