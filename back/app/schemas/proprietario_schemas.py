from pydantic import BaseModel, ConfigDict


class ProprietarioCreate(BaseModel):
    documentos: str


class ProprietarioResponse(BaseModel):
    id: int
    id_pessoa: int
    documentos: str
    model_config = ConfigDict(from_attributes=True)
