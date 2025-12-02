from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from itsdangerous import URLSafeTimedSerializer, BadSignature
from sqlalchemy import select

from backend.core.db_helper import db_helper
from backend.core.models.auth_model import AdminUserModel
from backend.core.config import settings


class AdminAuth(AuthenticationBackend):
    def __init__(self, secret_key: str):
        super().__init__(secret_key=secret_key)
        self.token_serializer = URLSafeTimedSerializer(secret_key)

    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form["username"]
        password = form["password"]

        async with db_helper.session_factory() as session:
            try:
                stmt = select(AdminUserModel).where(AdminUserModel.username == username)
                result = await session.execute(stmt)
                user = result.scalar_one_or_none()

                if user and user.check_password(password):
                    token_data = str(user.id)
                    token = self.token_serializer.dumps(token_data)
                    request.session.update({"user_token": token})
                    return True
                else:
                    return False
            except Exception as error:
                print(f"Ошибка при аутентификации: {error}")

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("user_token")

        if not token:
            return False

        try:
            user_id_str = self.token_serializer.loads(token, max_age=43200)
            user_id = int(user_id_str)
            async with db_helper.session_factory() as session:
                try:
                    stmt = select(AdminUserModel).where(AdminUserModel.id == user_id)
                    result = await session.execute(stmt)
                    user = result.scalar_one_or_none()
                    return user is not None
                except Exception as error:
                    print(f"Ошибка при авторизации: {error}")
        except BadSignature:
            return False
        except ValueError:
            return False


authentication_backend = AdminAuth(secret_key=settings.auth.SECRET_KEY)