import decimal
from typing import Literal, List

from pydantic import BaseModel, Field, ConfigDict


class IqosCategorySchema(BaseModel):
    id: int = Field(..., description="Уникальный идентификатор категории", examples=[4])
    category_name: str = Field(..., description="Название категории", examples=["onei"], max_length=256)

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)


class IqosSchema(BaseModel):
    id: int = Field(..., description="Уникальный идентификатор продукта IQOS", examples=[99])
    name: str = Field(..., description="Название продукта IQOS", examples=["IQOS Iluma i Series One 2025 Leaf Green"], max_length=256)
    model: str | None = Field(None, description="Модель продукта IQOS (может быть NULL)", examples=["i One"], max_length=65535)
    description: str = Field(
        ...,
        description="Описание продукта IQOS",
        examples=["Нагреватель табака IQOS Iluma i Series One Leaf Green - новинка от IQOS с единым пластиковым корпусом без чехла и бесконтактной системой нагрева табака, что исключает поломку нагревательного элемента механическим способом"],
        max_length=16777215
    )
    image: str = Field(..., description="Путь к изображению продукта IQOS", examples=["/images/iqos/IQOS Iluma i Series One 2025 Leaf Green.png.WEBP"], max_length=16777215)
    price: decimal.Decimal = Field(..., description="Цена продукта IQOS", examples=[9000], max_digits=10, decimal_places=0)
    color: Literal['Красный', 'Черный', 'Бежевый', 'Синий', 'Оранжевый', 'Зеленый', 'Фиолетовый', 'Желтый', 'Серый'] = (
        Field(..., description="Цвет продукта IQOS", examples=['Зеленый'])
    )
    new: int = Field(..., description="Флаг новинки (обычно 0 или 1)", examples=[0], ge=0, le=1)
    hit: int | None = Field(None, description="Флаг хита (обычно 0 или 1, может быть NULL)", examples=[0], ge=0, le=1)
    exclusive: int | None = Field(None, description="Флаг эксклюзивности (обычно 0 или 1, может быть NULL)", examples=[0], ge=0, le=1)
    nalichie: int = Field(..., description="Наличие (обычно 0 или 1)", examples=[1], ge=0, le=1)
    ref: str = Field(..., description="Ссылка или имя файла изображения", examples=["iqos-iluma-i-series-one-2025-leaf-green"], max_length=256)
    type: str = Field(..., description="Тип записи (iqos)", examples=["iqos"], max_length=256)
    sale_price: decimal.Decimal | None = Field(None, description="Цена со скидкой (sale_price)",examples=[None, 8500], max_digits=10, decimal_places=0)
    id_category: int = Field(..., description="ID связанной категории", examples=[4])

    category: IqosCategorySchema = Field(..., description="Информация о категории продукта IQOS")

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)


class GetIqosResponse(BaseModel):
    iqos: List[IqosSchema] = Field(..., description="Список продуктов IQOS")
    skip: int = Field(..., description="Количество пропущенных записей")
    limit: int = Field(..., description="Максимальное количество возвращённых записей")
    total: int = Field(..., description="Общее количество записей")


class GetIqosByIdResponse(BaseModel):
    iqos: IqosSchema = Field(..., description="Продукт IQOS")