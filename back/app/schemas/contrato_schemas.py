from datetime import date

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.contrato import StatusContrato


class ContratoCreate(BaseModel):
    id_sala: int
    data_inicio: date
    data_termino: date
    valor: float = Field(ge=0)
    status: StatusContrato

    @model_validator(mode="after")
    def validar_datas(self):
        if self.data_termino <= self.data_inicio:
            raise ValueError("data_termino deve ser maior que data_inicio")
        return self


class ContratoResponse(BaseModel):
    id: int
    id_sala: int
    id_usuario: int
    data_inicio: date
    data_termino: date
    valor: float
    status: StatusContrato

    model_config = ConfigDict(from_attributes=True)


class ContratoUpdate(BaseModel):
    data_inicio: date | None = None
    data_termino: date | None = None
    valor: float | None = None
    status: StatusContrato | None = None
