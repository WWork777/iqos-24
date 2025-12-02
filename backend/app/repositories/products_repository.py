import logging
from typing import Tuple, List

from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from backend.core.models import DevicesModel, IqosModel, TereaModel
from backend.core.db_helper import db_helper


logger = logging.getLogger(__name__)


class DevicesRepository:
    @staticmethod
    async def select_devices(skip: int = 0, limit: int = 100) -> Tuple[List[DevicesModel], int]:
        logger.debug(f"Получение всех девайсов с пагинацией: skip={skip}, limit={limit}")
        try:
            async with db_helper.session_factory() as session:
                total_query = select(func.count(DevicesModel.id))
                total_result = await session.execute(total_query)
                total = total_result.scalar()

                devices_query = (
                    select(DevicesModel)
                    .options(selectinload(DevicesModel.category))
                    .offset(skip)
                    .limit(limit)
                    .order_by(DevicesModel.id.desc())
                )
                devices_result = await session.execute(devices_query)
                devices = devices_result.scalars().all()

                logger.info(f"Получено {len(devices)} девайсов из {total} всего")
                return devices, total

        except Exception as error:
            logger.error(f"Ошибка при получении списка девайсов: {str(error)}", exc_info=True)
            raise

    @staticmethod
    async def select_device_by_id(devices_id: int) -> DevicesModel | None:
        logger.debug(f"Поиск девайса по id: {devices_id}")
        try:
            async with db_helper.session_factory() as session:
                result = await session.execute(
                    select(DevicesModel)
                    .options(selectinload(DevicesModel.category))
                    .where(DevicesModel.id == devices_id)
                )
                device = result.scalar_one_or_none()

                if device:
                    logger.debug(f"Дeвайс с id {devices_id} найден")
                else:
                    logger.debug(f"Дeвайс с id {devices_id} не найден")

                return device

        except Exception as error:
            logger.error(f"Ошибка при получении девайса по id {devices_id}: {str(error)}", exc_info=True)
            raise

    @staticmethod
    async def select_iqos(skip: int = 0, limit: int = 100) -> Tuple[List[IqosModel], int]:
        logger.debug(f"Получение всех продуктов iqos с пагинацией: skip={skip}, limit={limit}")
        try:
            async with db_helper.session_factory() as session:
                total_query = select(func.count(IqosModel.id))
                total_result = await session.execute(total_query)
                total = total_result.scalar()

                iqos_list_query = (
                    select(IqosModel)
                    .options(selectinload(IqosModel.category))
                    .offset(skip)
                    .limit(limit)
                    .order_by(IqosModel.id.desc())
                )
                iqos_result = await session.execute(iqos_list_query)
                iqos_list = iqos_result.scalars().all()

                logger.info(f"Получено {len(iqos_list)} продуктов iqos из {total} продуктов iqos")
                return iqos_list, total

        except Exception as error:
            logger.error(f"Ошибка при получении списка iqos: {str(error)}", exc_info=True)
            raise

    @staticmethod
    async def select_iqos_by_id(iqos_id: int) -> IqosModel | None:
        logger.debug(f"Поиск продукта iqos по id: {iqos_id}")
        try:
            async with db_helper.session_factory() as session:
                result = await session.execute(
                    select(IqosModel)
                    .options(selectinload(IqosModel.category))
                    .where(IqosModel.id == iqos_id)
                )
                iqos = result.scalar_one_or_none()

                if iqos:
                    logger.debug(f"Продукт iqos с id {iqos_id} найден")
                else:
                    logger.debug(f"Продукт iqos с id {iqos_id} не найден")

                return iqos

        except Exception as error:
            logger.error(f"Ошибка при получении продукта iqos по id {iqos_id}: {str(error)}", exc_info=True)
            raise

    @staticmethod
    async def select_terea(skip: int = 0, limit: int = 100) -> Tuple[List[TereaModel], int]:
        logger.debug(f"Получение всех продуктов terea с пагинацией: skip={skip}, limit={limit}")
        try:
            async with db_helper.session_factory() as session:
                total_query = select(func.count(TereaModel.id))
                total_result = await session.execute(total_query)
                total = total_result.scalar()

                terea_list_query = (
                    select(TereaModel)
                    .options(selectinload(TereaModel.category))
                    .offset(skip)
                    .limit(limit)
                    .order_by(TereaModel.id.desc())
                )
                terea_result = await session.execute(terea_list_query)
                terea_list = terea_result.scalars().all()

                logger.info(f"Получено {len(terea_list)} продуктов terea из {total} продуктов terea")
                return terea_list, total

        except Exception as error:
            logger.error(f"Ошибка при получении списка iqos: {str(error)}", exc_info=True)
            raise

    @staticmethod
    async def select_terea_by_id(terea_id: int) -> TereaModel | None:
        logger.debug(f"Поиск продукта terea по id: {terea_id}")
        try:
            async with db_helper.session_factory() as session:
                result = await session.execute(
                    select(TereaModel)
                    .options(selectinload(TereaModel.category))
                    .where(TereaModel.id == terea_id)
                )
                terea = result.scalar_one_or_none()

                if terea:
                    logger.debug(f"Продукт terea с id {terea_id} найден")
                else:
                    logger.debug(f"Продукт terea с id {terea_id} не найден")

                return terea

        except Exception as error:
            logger.error(f"Ошибка при получении продукта terea по id {terea_id}: {str(error)}", exc_info=True)
            raise
