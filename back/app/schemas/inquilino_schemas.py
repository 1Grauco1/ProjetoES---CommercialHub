from pydantic import BaseModel, ConfigDict


class InquilinoCreate(BaseModel):
    cadastro_profissional: str


class InquilinoResponse(BaseModel):
    id: int
    id_pessoa: int
    cadastro_profissional: str
    model_config = ConfigDict(from_attributes=True)
