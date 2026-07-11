from pydantic import BaseModel, ConfigDict


class PropietarioCreate(BaseModel):
    documentos: str


class PropietarioResponse(BaseModel):
    id: int
    id_pessoa: int
    documentos: str
    model_config = ConfigDict(from_attributes=True)
