import logging
from typing import Tuple

from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from backend.app.api.dependencies.pagination_dependecie import get_pagination
from backend.app.api.schemas import (
    GetDevicesResponse, GetDeviceByIdResponse,
    GetIqosResponse, GetIqosByIdResponse,
    GetTereaResponse, GetTereaByIdResponse,
    GetAllProductsResponse
)
from backend.app.services.products_service import DevicesService


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/devices", summary="Получить все девайсы с пагинацией")
async def get_devices(pagination: Tuple[int, int] = Depends(get_pagination)) -> GetDevicesResponse:
    skip, limit = pagination
    logger.info(f"GET /products/devices запрос: skip={skip}, limit={limit}")
    try:
        result = await DevicesService.get_devices(skip=skip, limit=limit)
        logger.info(f"GET /products/devices успешно: {len(result.devices)} девайсов возвращено")
        return result

    except ValueError as error:
        logger.warning(f"GET /products/devices ошибка клиента: {str(error)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
    except Exception as error:
        logger.error(f"GET /products/devices внутренняя ошибка: {str(error)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера при получении девайса"
        )


@router.get("/devices/{id}", summary="Получить девайс по id")
async def get_devices_by_id(devices_id: int) -> GetDeviceByIdResponse:
    logger.info(f"GET /products/devices/{devices_id} запрос")
    try:
        result = await DevicesService.get_device(devices_id)
        logger.info(f"GET /products/devices/{devices_id} успешно")
        return result

    except ValueError as error:
        if "не найден" in str(error).lower():
            logger.warning(f"GET /products/devices/{devices_id} девайс не найден")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Девайс не найден"
            )

        logger.warning(f"GET /products/devices/{devices_id} ошибка клиента: {str(error)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
    except Exception as error:
        logger.error(f"GET /products/devices/{devices_id} внутренняя ошибка: {str(error)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера при получении девайса"
        )


@router.get("/iqos", summary="Получить все продукты iqos с пагинацией")
async def get_iqos(pagination: Tuple[int, int] = Depends(get_pagination)) -> GetIqosResponse:
    skip, limit = pagination
    logger.info(f"GET /products/iqos запрос: skip={skip}, limit={limit}")
    try:
        result = await DevicesService.get_iqos_list(skip=skip, limit=limit)
        logger.info(f"GET /products/iqos успешно: {len(result.iqos)} iqos возвращено")
        return result

    except ValueError as error:
        logger.warning(f"GET /products/iqos ошибка клиента: {str(error)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
    except Exception as error:
        logger.error(f"GET /products/iqos внутренняя ошибка: {str(error)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера при получении iqos"
        )


@router.get("/iqos/{id}", summary="Получить продукт iqos по id")
async def get_iqos_by_id(iqos_id: int) -> GetIqosByIdResponse:
    logger.info(f"GET /products/iqos/{iqos_id} запрос")
    try:
        result = await DevicesService.get_iqos(iqos_id)
        logger.info(f"GET /products/iqos/{iqos_id} успешно")
        return result

    except ValueError as error:
        if "не найден" in str(error).lower():
            logger.warning(f"GET /products/iqos/{iqos_id} продукт iqos не найден")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Продукт iqos не найден"
            )

        logger.warning(f"GET /products/iqos/{iqos_id} ошибка клиента: {str(error)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
    except Exception as error:
        logger.error(f"GET /products/iqos/{iqos_id} внутренняя ошибка: {str(error)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера при получении продукта iqos"
        )


@router.get("/terea", summary="Получить все продукты terea с пагинацией")
async def get_terea(pagination: Tuple[int, int] = Depends(get_pagination)) -> GetTereaResponse:
    skip, limit = pagination
    logger.info(f"GET /products/terea запрос: skip={skip}, limit={limit}")
    try:
        result = await DevicesService.get_terea_list(skip=skip, limit=limit)
        logger.info(f"GET /products/terea успешно: {len(result.terea)} продуктов terea возвращено")
        return result

    except ValueError as error:
        logger.warning(f"GET /products/terea ошибка клиента: {str(error)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
    except Exception as error:
        logger.error(f"GET /products/terea внутренняя ошибка: {str(error)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера при получении продукта terea"
        )


@router.get("/terea/{id}", summary="Получить продукт terea по id")
async def get_terea_by_id(terea_id: int) -> GetTereaByIdResponse:
    logger.info(f"GET /products/terea/{terea_id} запрос")
    try:
        result = await DevicesService.get_terea(terea_id)
        logger.info(f"GET /products/terea/{terea_id} успешно")
        return result

    except ValueError as error:
        if "не найден" in str(error).lower():
            logger.warning(f"GET /products/terea/{terea_id} продукт terea не найден")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Продукт terea не найден"
            )

        logger.warning(f"GET /products/terea/{terea_id} ошибка клиента: {str(error)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
    except Exception as error:
        logger.error(f"GET /products/terea/{terea_id} внутренняя ошибка: {str(error)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера при получении продукта terea"
        )

@router.get("", summary="Получить все продукты (devices, iqos, terea)")
async def get_all_products() -> GetAllProductsResponse:
    logger.info(f"GET /products запрос")
    try:
        devices_result = await DevicesService.get_devices(skip=0, limit=1000)
        iqos_result = await DevicesService.get_iqos_list(skip=0, limit=1000)
        terea_result = await DevicesService.get_terea_list(skip=0, limit=1000)

        response_data = GetAllProductsResponse(devices=devices_result.devices, iqos=iqos_result.iqos, terea=terea_result.terea)
        logger.info(f"GET /products успешно: {len(response_data.devices)} devices, {len(response_data.iqos)} iqos, {len(response_data.terea)} terea возвращено")
        return response_data

    except ValueError as error:
        logger.warning(f"GET /products ошибка клиента: {str(error)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
    except Exception as error:
        logger.error(f"GET /products внутренняя ошибка: {str(error)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера при получении всех продуктов"
        )