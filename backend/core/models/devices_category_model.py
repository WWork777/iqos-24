from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import VARCHAR

from backend.core.models.base_model import BaseModel


class DevicesCategoryModel(BaseModel):
    __tablename__ = "Devices_category"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    category_name: Mapped[str] = mapped_column(VARCHAR(256))

    devices: Mapped[list["DevicesModel"]] = relationship(back_populates="category")

    def __str__(self):
        return f"Категория {self.category_name}"