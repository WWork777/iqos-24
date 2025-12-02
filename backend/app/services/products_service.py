import logging

from backend.app.api.schemas import(
    GetDevicesResponse,
    DevicesSchema,
    GetDeviceByIdResponse,

    GetIqosResponse,
    IqosSchema,
    GetIqosByIdResponse,

    GetTereaResponse,
    TereaSchema,
    GetTereaByIdResponse
)
from backend.app.repositories.products_repository import DevicesRepository


logger = logging.getLogger(__name__)


class DevicesService:
    @staticmethod
    async def get_devices(skip: int = 0, limit: int = 100) -> GetDevicesResponse:
        logger.info(f"Получение списка девайсов: skip={skip}, limit={limit}")
        try:
            devices_models, total = await DevicesRepository.select_devices(skip=skip, limit=limit)

            devices_response = [
                DevicesSchema(
                    id=device.id,
                    name=device.name,
                    description=device.description,
                    image=device.image,
                    price=device.price,
                    nalichie=device.nalichie,
                    new=device.new,
                    hit=device.hit,
                    color=device.color,
                    ref=device.ref,
                    type=device.type,
                    device_id=device.device_id,
                    category=device.category
                ) for device in devices_models

            ]

            logger.info(f"Успешно возвращено {len(devices_response)} девайсов")
            return GetDevicesResponse(
                devices=devices_response,
                skip=skip,
                limit=limit,
                total=total
            )

        except Exception as error:
            logger.error(f"Ошибка при получении девайсов: {str(error)}", exc_info=True)
            raise ValueError(f"Ошибка при получении девайсов: {str(error)}")

    @staticmethod
    async def get_device(devices_id: int) -> GetDevicesResponse:
        logger.info(f"Получение девайса по id: {devices_id}")
        try:
            device_model = await DevicesRepository.select_device_by_id(devices_id)

            if not device_model:
                logger.warning(f"Девайс с id {devices_id} не найден")
                raise ValueError("Девайс не найден")

            device_response = DevicesSchema(
                id=device_model.id,
                name=device_model.name,
                description=device_model.description,
                image=device_model.image,
                price=device_model.price,
                nalichie=device_model.nalichie,
                new=device_model.new,
                hit=device_model.hit,
                color=device_model.color,
                ref=device_model.ref,
                type=device_model.type,
                device_id=device_model.device_id,
                category=device_model.category
            )

            logger.info(f"Девайса с id {devices_id} успешно получен")
            return GetDeviceByIdResponse(device=device_response)

        except ValueError as error:
            logger.warning(f"Девайс с id {devices_id} не найден")
            raise ValueError(str(error))
        except Exception as error:
            logger.error(f"Ошибка при получении девайса {devices_id}: {str(error)}", exc_info=True)
            raise ValueError(f"Ошибка при получении девайса: {str(error)}")

    @staticmethod
    async def get_iqos_list(skip: int = 0, limit: int = 100) -> GetIqosResponse:
        logger.info(f"Получение списка iqos: skip={skip}, limit={limit}")
        try:
            iqos_models, total = await DevicesRepository.select_iqos(skip=skip, limit=limit)

            iqos_response = [
                IqosSchema(
                    id=iqos.id,
                    name=iqos.name,
                    model=iqos.model,
                    description=iqos.description,
                    image=iqos.image,
                    price=iqos.price,
                    color=iqos.color,
                    new=iqos.new,
                    hit=iqos.hit,
                    exclusive=iqos.exclusive,
                    nalichie=iqos.nalichie,
                    ref=iqos.ref,
                    type=iqos.type,
                    sale_price=iqos.sale_price,
                    id_category=iqos.id_category,
                    category=iqos.category
                ) for iqos in iqos_models

            ]
            logger.info(f"Успешно возвращено {len(iqos_response)} продуктов iqos")
            return GetIqosResponse(
                iqos=iqos_response,
                skip=skip,
                limit=limit,
                total=total
            )

        except Exception as error:
            logger.error(f"Ошибка при получении продуктов iqos: {str(error)}", exc_info=True)
            raise ValueError(f"Ошибка при получении продуктов iqos: {str(error)}")

    @staticmethod
    async def get_iqos(iqos_id: int) -> GetIqosByIdResponse:
        logger.info(f"Получение продукта iqos по id: {iqos_id}")
        try:
            iqos_model = await DevicesRepository.select_iqos_by_id(iqos_id)

            if not iqos_model:
                logger.warning(f"Продукт iqos с id {iqos_id} не найден")
                raise ValueError("Продукт iqos не найден")

            iqos_response = IqosSchema(
                id=iqos_model.id,
                name=iqos_model.name,
                model=iqos_model.model,
                description=iqos_model.description,
                image=iqos_model.image,
                price=iqos_model.price,
                color=iqos_model.color,
                new=iqos_model.new,
                hit=iqos_model.hit,
                exclusive=iqos_model.exclusive,
                nalichie=iqos_model.nalichie,
                ref=iqos_model.ref,
                type=iqos_model.type,
                sale_price=iqos_model.sale_price,
                id_category=iqos_model.id_category,
                category=iqos_model.category
            )

            logger.info(f"Продукт iqos с id {iqos_id} успешно получен")
            return GetIqosByIdResponse(iqos=iqos_response)

        except ValueError as error:
            logger.warning(f"Продукт iqos с id {iqos_id} не найден")
            raise ValueError(str(error))
        except Exception as error:
            logger.error(f"Ошибка при получении продукта iqos {iqos_id}: {str(error)}", exc_info=True)
            raise ValueError(f"Ошибка при получении продукта iqos: {str(error)}")

    @staticmethod
    async def get_terea_list(skip: int = 0, limit: int = 100) -> GetTereaResponse:
        logger.info(f"Получение списка terea: skip={skip}, limit={limit}")
        try:
            terea_models, total = await DevicesRepository.select_terea(skip=skip, limit=limit)

            terea_response = [
                TereaSchema(
                    id=terea.id,
                    name=terea.name,
                    description=terea.description,
                    image=terea.image,
                    imagePack=terea.imagePack,
                    price=terea.price,
                    pricePack=terea.pricePack,
                    has_capsule=terea.has_capsule,
                    flavor=terea.flavor,
                    country=terea.country,
                    brend=terea.brend,
                    strength=terea.strength,
                    nalichie=terea.nalichie,
                    new=terea.new,
                    hit=terea.hit,
                    ref=terea.ref,
                    type=terea.type,
                    terea_id=terea.terea_id,
                    category=terea.category
                ) for terea in terea_models

            ]
            logger.info(f"Успешно возвращено {len(terea_response)} продуктов terea")
            return GetTereaResponse(
                terea=terea_response,
                skip=skip,
                limit=limit,
                total=total
            )

        except Exception as error:
            logger.error(f"Ошибка при получении продуктов terea: {str(error)}", exc_info=True)
            raise ValueError(f"Ошибка при получении продуктов terea: {str(error)}")

    @staticmethod
    async def get_terea(terea_id: int) -> GetTereaByIdResponse:
        logger.info(f"Получение продукта terea по id: {terea_id}")
        try:
            terea_model = await DevicesRepository.select_terea_by_id(terea_id)

            if not terea_model:
                logger.warning(f"Продукт terea с id {terea_id} не найден")
                raise ValueError("Продукт terea не найден")

            terea_response = TereaSchema(
                id=terea_model.id,
                name=terea_model.name,
                description=terea_model.description,
                image=terea_model.image,
                imagePack=terea_model.imagePack,
                price=terea_model.price,
                pricePack=terea_model.pricePack,
                has_capsule=terea_model.has_capsule,
                flavor=terea_model.flavor,
                country=terea_model.country,
                brend=terea_model.brend,
                strength=terea_model.strength,
                nalichie=terea_model.nalichie,
                new=terea_model.new,
                hit=terea_model.hit,
                ref=terea_model.ref,
                type=terea_model.type,
                terea_id=terea_model.terea_id,
                category=terea_model.category
            )

            logger.info(f"Продукт terea с id {terea_id} успешно получен")
            return GetTereaByIdResponse(terea=terea_response)

        except ValueError as error:
            logger.warning(f"Продукт terea с id {terea_id} не найден")
            raise ValueError(str(error))
        except Exception as error:
            logger.error(f"Ошибка при получении продукта terea {terea_id}: {str(error)}", exc_info=True)
            raise ValueError(f"Ошибка при получении продукта terea: {str(error)}")