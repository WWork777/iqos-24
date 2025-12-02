import decimal
from datetime import datetime
from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.mysql import TEXT, TINYINT
from sqlalchemy import VARCHAR, DECIMAL, Integer, DateTime, ForeignKey, func

from backend.core.models.base_model import BaseModel


class OrderModel(BaseModel):
    __tablename__ = "Orders"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    is_first_order: Mapped[bool] = mapped_column(TINYINT(display_width=1))
    customer_name: Mapped[str] = mapped_column(VARCHAR(256))
    phone_number: Mapped[str] = mapped_column(VARCHAR(32))
    is_delivery: Mapped[bool] = mapped_column(TINYINT(display_width=1))
    city: Mapped[str | None] = mapped_column(VARCHAR(256), nullable=True)
    address: Mapped[str | None] = mapped_column(TEXT, nullable=True)
    total_amount: Mapped[decimal.Decimal] = mapped_column(DECIMAL(precision=12, scale=2))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


    ordered_items: Mapped[List["OrderedProductModel"]] = relationship(back_populates="order", cascade="all, delete-orphan")

    def __str__(self):
        return f"Заказ id: {self.id}, Заказчик: {self.customer_name}, Адрес: {self.city}, {self.address}, Номер телефона: {self.phone_number}"


class OrderedProductModel(BaseModel):
    __tablename__ = "Ordered_products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    product_name: Mapped[str] = mapped_column(VARCHAR(256))
    quantity: Mapped[int] = mapped_column(Integer)
    price_at_time_of_order: Mapped[decimal.Decimal] = mapped_column(DECIMAL(precision=10, scale=2))
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("Orders.id", ondelete="CASCADE"))

    order: Mapped["OrderModel"] = relationship(back_populates="ordered_items")

    def __str__(self):
        return f"ID заказа: {self.order_id}, Товар: {self.product_name}, Количество: {self.quantity}"