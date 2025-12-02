import decimal

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.mysql import LONGTEXT, TINYINT, ENUM
from sqlalchemy import VARCHAR, DECIMAL, Integer, ForeignKey

from backend.core.models.base_model import BaseModel
from backend.core.models.emun_for_models import ENUM_COLORS



class DevicesModel(BaseModel):
    __tablename__ = "Devices"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(VARCHAR(256))
    description: Mapped[str] = mapped_column(LONGTEXT)
    image: Mapped[str] = mapped_column(LONGTEXT)
    price: Mapped[decimal.Decimal] = mapped_column(DECIMAL(precision=10, scale=0))
    nalichie: Mapped[int] = mapped_column(TINYINT(display_width=1))
    new: Mapped[int] = mapped_column(TINYINT)
    hit: Mapped[int | None] = mapped_column(TINYINT, nullable=True)
    color: Mapped[str] = mapped_column(ENUM(*ENUM_COLORS))
    ref: Mapped[str] = mapped_column(VARCHAR(256))
    type: Mapped[str] = mapped_column(VARCHAR(256))
    device_id: Mapped[int] = mapped_column(Integer, ForeignKey("Devices_category.id"))

    category: Mapped["DevicesCategoryModel"] = relationship(back_populates="devices")

    def __str__(self):
        return f"Devices id: {self.id}"