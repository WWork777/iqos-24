import decimal

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.mysql import TEXT, LONGTEXT, ENUM, TINYINT
from sqlalchemy import VARCHAR, DECIMAL, Integer, ForeignKey

from backend.core.models.base_model import BaseModel
from backend.core.models.emun_for_models import ENUM_COLORS


class IqosModel(BaseModel):
    __tablename__ = "Iqos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(VARCHAR(256))
    model: Mapped[str | None] = mapped_column(TEXT, nullable=True)
    description: Mapped[str] = mapped_column(LONGTEXT)
    image: Mapped[str] = mapped_column(LONGTEXT)
    price: Mapped[decimal.Decimal] = mapped_column(DECIMAL(precision=10, scale=0))
    color: Mapped[str] = mapped_column(ENUM(*ENUM_COLORS))
    new: Mapped[int] = mapped_column(TINYINT(display_width=1))
    hit: Mapped[int | None] = mapped_column(TINYINT, nullable=True)
    exclusive: Mapped[int | None] = mapped_column(TINYINT, nullable=True)
    nalichie: Mapped[int] = mapped_column(TINYINT(display_width=1))
    ref: Mapped[str] = mapped_column(VARCHAR(256))
    type: Mapped[str] = mapped_column(VARCHAR(256))
    sale_price: Mapped[decimal.Decimal | None] = mapped_column(DECIMAL(precision=10, scale=0), nullable=True)
    id_category: Mapped[int] = mapped_column(Integer, ForeignKey("Iqos_category.id"))

    category: Mapped["IqosCategoryModel"] = relationship(back_populates="iqos")

    def __str__(self):
        return f"Iqos id: {self.id}"