from os import getenv
from urllib.parse import quote_plus

from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_settings import BaseSettings

from backend.core.loger_config import LogerConfig


load_dotenv()

class DatabaseENV:
    is_test_db: bool = bool(int(getenv("IS_TEST_DB")))

    if is_test_db:
        DB_USER: str = getenv("DB_USER_TEST")
        DB_PASSWORD: str = getenv("DB_PASSWORD_TEST")
        DB_HOST: str = getenv("DB_HOST_TEST")
        DB_PORT: str = getenv("DB_PORT_TEST")
        DB_NAME: str = getenv("DB_NAME_TEST")
    else:
        DB_USER: str = getenv("DB_USER")
        DB_PASSWORD: str = quote_plus(getenv("DB_PASSWORD")) if getenv("DB_PASSWORD") else ""
        DB_HOST: str = getenv("DB_HOST")
        DB_PORT: str = getenv("DB_PORT")
        DB_NAME: str = getenv("DB_NAME")


class ServerENV:
    SERVER_HOST: str = getenv("SERVER_HOST")
    SERVER_PORT: int = int(getenv("SERVER_PORT"))


class RunConfig(BaseModel):
    host: str = ServerENV.SERVER_HOST
    port: int = ServerENV.SERVER_PORT


class DataBaseConfig(BaseModel):
    url: str = f"mysql+aiomysql://{DatabaseENV.DB_USER}:{DatabaseENV.DB_PASSWORD}@{DatabaseENV.DB_HOST}:{DatabaseENV.DB_PORT}/{DatabaseENV.DB_NAME}"
    echo: bool = False
    pool_size: int = 10
    max_overflow: int = 15

class AuthConfig(BaseModel):
    SECRET_KEY: str = getenv("SECRET_KEY")


class Settings(BaseSettings):
    run: RunConfig = RunConfig()
    db: DataBaseConfig = DataBaseConfig()
    log: LogerConfig = LogerConfig()
    auth: AuthConfig = AuthConfig()


settings = Settings()