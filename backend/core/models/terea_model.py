import decimal

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.mysql import TEXT, LONGTEXT, TINYINT, SET, ENUM
from sqlalchemy import VARCHAR, DECIMAL, Integer, ForeignKey

from backend.core.models.base_model import BaseModel
from backend.core.models.emun_for_models import SET_FLAVORS, ENUM_STRENGTHS


class TereaModel(BaseModel):
    __tablename__ = "Terea"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(VARCHAR(256))
    description: Mapped[str] = mapped_column(LONGTEXT)
    image: Mapped[str] = mapped_column(LONGTEXT)
    imagePack: Mapped[str | None] = mapped_column(VARCHAR(256), nullable=True)
    price: Mapped[decimal.Decimal] = mapped_column(DECIMAL(precision=10, scale=0))
    pricePack: Mapped[decimal.Decimal | None] = mapped_column(DECIMAL(precision=10, scale=0), nullable=True)
    has_capsule: Mapped[int] = mapped_column(TINYINT(display_width=1))
    flavor: Mapped[str] = mapped_column(SET(*SET_FLAVORS))  # !
    country: Mapped[str] = mapped_column(TEXT)
    brend: Mapped[str] = mapped_column(VARCHAR(256))
    strength: Mapped[str] = mapped_column(ENUM(*ENUM_STRENGTHS))
    nalichie: Mapped[int] = mapped_column(TINYINT(display_width=1))
    new: Mapped[int] = mapped_column(TINYINT)
    hit: Mapped[int | None] = mapped_column(TINYINT, nullable=True)
    ref: Mapped[str] = mapped_column(VARCHAR(256))
    type: Mapped[str] = mapped_column(VARCHAR(256))
    terea_id: Mapped[int] = mapped_column(Integer, ForeignKey("Terea_category.id"))

    category: Mapped["TereaCategoryModel"] = relationship(back_populates="terea")

    def __str__(self):
        return f"Terea id: {self.id}"