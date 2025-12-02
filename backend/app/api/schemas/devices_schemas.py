import decimal
from typing import Literal, List

from pydantic import BaseModel, Field, ConfigDict


class DevicesCategorySchema(BaseModel):
    id: int = Field(..., description="Уникальный идентификатор категории", examples=[1])
    category_name: str = Field(..., description="Название категории", examples=["ringsiluma"], max_length=256)

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)


class DevicesSchema(BaseModel):
    id: int = Field(..., description="Уникальный идентификатор устройства", examples=[38])
    name: str = Field(..., description="Название устройства", examples=["Съемная крышка для ILuma Prime, голубой"], max_length=256)
    description: str = Field(
        ...,
        description="Описание устройства",
        examples=["Съемная крышка для ILuma Prime(голубой) В ассортименте! Наличие уточнять у менеджера"],
        max_length=16777215
    )
    image: str = Field(
        ...,
        description="Путь к изображению устройства",
        examples=["/images/devices/Съемная крышка для ILuma Prime (Серая).png.webp"],
        max_length=16777215
    )
    price: decimal.Decimal = Field(..., description="Цена устройства", examples=[1990], max_digits=10, decimal_places=0)
    nalichie: int = Field(..., description="Наличие (обычно 0 или 1)", examples=[1], ge=0, le=1)
    new: int = Field(..., description="Флаг новинки (обычно 0 или 1)", examples=[0], ge=0, le=1)
    hit: int | None = Field(None, description="Флаг хита (обычно 0 или 1, может быть NULL)", examples=[0], ge=0, le=1)
    color: Literal['Красный', 'Черный', 'Бежевый', 'Синий', 'Оранжевый', 'Зеленый', 'Фиолетовый', 'Желтый', 'Серый'] = (
        Field(
            ...,
            description="Цвет устройства",
            examples=['Серый']
        )
    )
    ref: str = Field(..., description="Ссылка или имя файла изображения", examples=["Съемная крышка для ILuma Prime (Серая).png.webp"], max_length=256)
    type: str = Field(..., description="Тип записи (devices)", examples=["devices"], max_length=256)
    device_id: int = Field(..., description="ID связанной категории", examples=[1])
    category: DevicesCategorySchema = Field(..., description="Информация о категории устройства")

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)


class GetDevicesResponse(BaseModel):
    devices: List[DevicesSchema] = Field(..., description="Список устройств")
    skip: int
    limit: int
    total: int


class GetDeviceByIdResponse(BaseModel):
    device: DevicesSchema = Field(..., description="Устройство")
