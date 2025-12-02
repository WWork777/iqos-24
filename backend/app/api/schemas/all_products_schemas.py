from typing import List

from pydantic import BaseModel, Field, ConfigDict

from backend.app.api.schemas import DevicesSchema, IqosSchema, TereaSchema


class GetAllProductsResponse(BaseModel):
    devices: List[DevicesSchema] = Field(..., description="Список устройств Devices")
    iqos: List[IqosSchema] = Field(..., description="Список продуктов IQOS")
    terea: List[TereaSchema] = Field(..., description="Список продуктов Terea")

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)
