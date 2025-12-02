import logging

from fastapi import APIRouter, HTTPException
from starlette import status

from backend.app.api.schemas.orders_schemas import OrderResponse, OrderCreate
from backend.app.services.orders_services import OrdersService


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/orders", tags=["Заказы"])


@router.post("", summary="Создать новый заказ", status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderCreate) -> OrderResponse:
    logger.info(f"POST /orders запрос: создание заказа {order.model_dump()}")
    try:
        result = await OrdersService.create_order(order)
        logger.info(f"POST /orders успешно: заказ создан с ID {result.order.id}")
        return result
    except ValueError as error:
        logger.warning(f"POST /orders ошибка валидации: {str(error)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Некорректные данные: {str(error)}"
        )
    except Exception as error:
        logger.error(f"POST /orders внутренняя ошибка: {str(error)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера при создании заказа"
        )
