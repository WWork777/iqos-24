import decimal
from typing import Literal, List, Union, Set

from pydantic import BaseModel, Field, ConfigDict


StrengthEnum = Literal['Легкие', 'Средние', 'Крепкие']


class TereaCategorySchema(BaseModel):
    id: int = Field(..., description="Уникальный идентификатор категории", examples=[3])
    category_name: str = Field(..., description="Название категории", examples=["arm"], max_length=256)

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)


class TereaSchema(BaseModel):
    id: int = Field(..., description="Уникальный идентификатор продукта Terea", examples=[14])
    name: str = Field(..., description="Название продукта Terea", examples=["Terea Sienna AM"], max_length=256)
    description: str = Field(
        ...,
        description="Описание продукта Terea",
        examples=["Стики TEREA Sienna для IQOS ILUMA — это насыщенный табачный вкус с легкими древесными и пряными нотами, придающими особую глубину. Идеальный выбор для тех, кто предпочитает богатый и выразительный вкус"],
        max_length=16777215
    )
    image: str = Field(
        ...,
        description="Путь к изображению продукта Terea",
        examples=["/images/terea/armenia/Armenia Terea Sienna Блок.png.webp"],
        max_length=16777215
    )
    imagePack: str | None = Field(
        None,
        description="Путь к изображению упаковки продукта Terea (может быть NULL)",
        examples=["/images/terea/armenia/Armenia Terea Sienna.png.webp"],
        max_length=256
    )
    price: decimal.Decimal = Field(..., description="Цена продукта Terea", examples=[5000], max_digits=10, decimal_places=0)
    pricePack: decimal.Decimal | None = Field(
        None,
        description="Цена упаковки продукта Terea (может быть NULL)",
        examples=[510],
        max_digits=10,
        decimal_places=0
    )
    has_capsule: int = Field(..., description="Флаг наличия капсулы (обычно 0 или 1)", examples=[0], ge=0, le=1)
    flavor: Union[Set[str], frozenset[str]] = Field(..., description="Вкус продукта Terea (множество значений из допустимого набора в БД)", examples=[{"Ментол"}])
    country: str = Field(..., description="Страна производитель", examples=["Армения"], max_length=65535)
    brend: str = Field(..., description="Бренд продукта Terea", examples=["Terea"], max_length=256)
    strength: StrengthEnum = Field(..., description="Крепость продукта Terea", examples=["Крепкие"])
    nalichie: int = Field(..., description="Наличие (обычно 0 или 1)", examples=[1], ge=0, le=1)
    new: int = Field(..., description="Флаг новинки (обычно 0 или 1)", examples=[0], ge=0, le=1)
    hit: int | None = Field(None, description="Флаг хита (обычно 0 или 1, может быть NULL)", examples=[0], ge=0, le=1)
    ref: str = Field(..., description="Ссылка или имя файла изображения", examples=["terea-armenia-sienna"], max_length=256)
    type: str = Field(..., description="Тип записи (terea)", examples=["terea"], max_length=256)
    terea_id: int = Field(..., description="ID связанной категории", examples=[3])
    category: TereaCategorySchema = Field(..., description="Информация о категории продукта Terea")

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)


class GetTereaResponse(BaseModel):
    terea: List[TereaSchema] = Field(..., description="Список продуктов Terea")
    skip: int = Field(..., description="Количество пропущенных записей")
    limit: int = Field(..., description="Максимальное количество возвращённых записей")
    total: int = Field(..., description="Общее количество записей")


class GetTereaByIdResponse(BaseModel):
    terea: TereaSchema = Field(..., description="Продукт Terea")
