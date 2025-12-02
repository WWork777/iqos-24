from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import VARCHAR, Integer
from backend.core.models.base_model import BaseModel
from passlib.hash import pbkdf2_sha256

class AdminUserModel(BaseModel):
    __tablename__ = "Admin_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(VARCHAR(80), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(VARCHAR(255), nullable=False)


    def set_password(self, password: str):
        self.password_hash = pbkdf2_sha256.hash(password)

    def check_password(self, password: str) -> bool:
        return pbkdf2_sha256.verify(password, self.password_hash)

    def __str__(self):
        return f"AdminUser: {self.username}"
