import asyncio
import sys
from logging.config import fileConfig
from pathlib import Path


current_path = Path(__file__).resolve()
backend_path = current_path.parent.parent
root_path = backend_path.parent

paths_to_add = [str(root_path), str(backend_path)]
for path in paths_to_add:
    if path not in sys.path:
        sys.path.insert(0, path)


from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

from backend.core.config import settings
from backend.core.models import (
    BaseModel,
    DevicesModel, DevicesCategoryModel,
    IqosModel, IqosCategoryModel,
    TereaModel, TereaCategoryModel,
    OrderModel, OrderedProductModel,
    AdminUserModel
)


config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = BaseModel.metadata
config.set_main_option("sqlalchemy.url", str(settings.db.url))


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
