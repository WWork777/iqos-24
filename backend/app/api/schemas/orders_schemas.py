from datetime import datetime
from decimal import Decimal
from typing import List

from pydantic import BaseModel, Field, ConfigDict


class OrderedItemBase(BaseModel):
    product_name: str = Field(min_length=1, max_length=256, examples=["IQOS Iluma i Series One 2025 Leaf Green"])
    quantity: int = Field(gt=0, examples=[1])
    price_at_time_of_order: Decimal = Field(ge=0, examples=[Decimal('9000')])


class OrderedItemCreate(OrderedItemBase):
    pass


class OrderedItemResponse(OrderedItemBase):
    id: int = Field(examples=[1])

    model_config = ConfigDict(from_attributes=True)


class OrderBase(BaseModel):
    customer_name: str = Field(min_length=1, max_length=256, examples=["Иванов Иван"])
    phone_number: str = Field(min_length=10, max_length=32, examples=["+79991234567"])
    is_delivery: bool = Field(examples=[True])
    city: str | None = Field(None, max_length=256, examples=["Москва"])
    address: str | None = Field(None, max_length=1000, examples=["ул. Ленина, д. 1, кв. 1"])


class OrderCreate(OrderBase):
    ordered_items: List[OrderedItemCreate] = Field(default_factory=list, description="Список товаров в заказе")


class GetOrder(OrderBase):
    id: int = Field(examples=[1])
    is_first_order: bool = Field(examples=[True])
    total_amount: Decimal = Field(examples=[Decimal('59999.98')])
    created_at: datetime = Field(examples=["2024-01-15T10:30:00Z"])
    ordered_items: List[OrderedItemResponse] = Field(description="Список товаров в заказе")

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    order: GetOrder

    model_config = ConfigDict(from_attributes=True)
