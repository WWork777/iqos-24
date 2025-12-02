import logging

from backend.app.api.schemas.orders_schemas import OrderCreate, OrderResponse, GetOrder, OrderedItemResponse
from backend.app.repositories.orders_repository import OrderRepository


logger = logging.getLogger(__name__)


class OrdersService:

    @staticmethod
    async def create_order(order: OrderCreate) -> OrderResponse:
        logger.info(f"Создание заказа: {order.model_dump()}")
        try:
            order_data = order.model_dump()
            order_model = await OrderRepository.create(order_data)

            get_order = GetOrder(
                id=order_model.id,
                customer_name=order_model.customer_name,
                phone_number=order_model.phone_number,
                is_first_order=order_model.is_first_order,
                is_delivery=order_model.is_delivery,
                city=order_model.city,
                address=order_model.address,
                total_amount=order_model.total_amount,
                created_at=order_model.created_at,
                ordered_items=[
                    OrderedItemResponse(
                        id=item.id,
                        product_name=item.product_name,
                        quantity=item.quantity,
                        price_at_time_of_order=item.price_at_time_of_order
                    )
                    for item in order_model.ordered_items
                ]
            )

            logger.info(f"Заказ успешно создан: {get_order.id}")
            return OrderResponse(order=get_order)

        except Exception as error:
            logger.error(f"Ошибка при создании заказа: {str(error)}", exc_info=True)
            raise ValueError(f"Ошибка при создании заказа: {str(error)}")