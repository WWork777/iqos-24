from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import VARCHAR

from backend.core.models.base_model import BaseModel


class IqosCategoryModel(BaseModel):
    __tablename__ = "Iqos_category"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    category_name: Mapped[str] = mapped_column(VARCHAR(256))

    iqos: Mapped[list["IqosModel"]] = relationship(back_populates="category")

    def __str__(self):
        return f"Категория {self.category_name}"