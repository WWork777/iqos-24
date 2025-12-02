import asyncio

from backend.core.db_helper import db_helper
from backend.core.models.auth_model import AdminUserModel


async def create_admin(username: str, password: str):
    async with db_helper.session_factory() as session:
        new_admin = AdminUserModel(username=username)
        new_admin.set_password(password)
        session.add(new_admin)
        await session.commit()
        await session.refresh(new_admin)

        return new_admin


async def main():
    username = "admin"
    password = "Admin@7681"
    try:
        await create_admin(username, password)
    except Exception as error:
        print(f"Ошибка при создании администратора: {error}")


if __name__ == "__main__":
    asyncio.run(main())