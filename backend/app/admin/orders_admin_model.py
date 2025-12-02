from decimal import Decimal

from sqladmin import ModelView

from backend.core.models import OrderModel, OrderedProductModel


class OrdersAdmin(ModelView, model=OrderModel):
    name = "Заказ"
    name_plural = "Таблица с заказами"

    column_list = [
        OrderModel.id,
        OrderModel.customer_name,
        OrderModel.phone_number,
        OrderModel.is_first_order,
        OrderModel.is_delivery,
        OrderModel.city,
        OrderModel.address,
        OrderModel.total_amount,
        OrderModel.created_at,
        OrderModel.ordered_items
    ]

    column_searchable_list = [
        OrderModel.id,
        OrderModel.customer_name,
        OrderModel.phone_number,
        OrderModel.city,
        OrderModel.address
    ]
    column_sortable_list = [
        OrderModel.id,
        OrderModel.customer_name,
        OrderModel.phone_number,
        OrderModel.is_first_order,
        OrderModel.is_delivery,
        OrderModel.city,
        OrderModel.address,
        OrderModel.total_amount,
        OrderModel.created_at,
    ]
    column_default_sort = [(OrderModel.id, True)]

    column_formatters = {
        OrderModel.is_first_order: lambda m, a: "Да" if m.is_first_order else "Нет",
        OrderModel.is_delivery: lambda m, a: "Да" if m.is_delivery else "Нет",
        OrderModel.total_amount: lambda m, a: f"{m.total_amount:.2f}"
    }

    column_labels = {
        OrderModel.id: "ID",
        OrderModel.customer_name: "Имя заказчика",
        OrderModel.phone_number: "Номер телефона",
        OrderModel.is_first_order: "Первый заказ",
        OrderModel.is_delivery: "Доставка",
        OrderModel.city: "Город",
        OrderModel.address: "Адрес",
        OrderModel.total_amount: "Сумма заказа",
        OrderModel.created_at: "Дата создания",
        OrderModel.ordered_items: "Заказанные товары"
    }

    form_columns = [
        OrderModel.customer_name,
        OrderModel.phone_number,
        OrderModel.is_delivery,
        OrderModel.city,
        OrderModel.address,
    ]

    form_args = {
        "customer_name": {
            "label": "Имя заказчика",
            "description": "Введите имя заказчика",
        },
        "phone_number": {
            "label": "Номер телефона",
            "description": "Введите номер телефона заказчика",
        },
        "is_delivery": {
            "label": "Доставка",
            "description": "Отметьте, если заказ с доставкой",
        },
        "city": {
            "label": "Город",
            "description": "Введите город доставки",
        },
        "address": {
            "label": "Адрес",
            "description": "Введите полный адрес доставки",
        },
    }


    # Отключено создание, так как оно обычно происходит через API
    can_create = False
    # Редактирование разрешено, но может быть ограничено формой
    can_edit = True
    # Удаление разрешено
    can_delete = True
    # Просмотр деталей разрешен
    can_view_details = True

    page_size = 25
    page_size_options = [10, 25, 50, 100]


class OrdersProductAdmin(ModelView, model=OrderedProductModel):
    name = "Заказанный товар"
    name_plural = "Таблица с заказанными товарами"

    column_list = [
        OrderedProductModel.id,
        OrderedProductModel.product_name,
        OrderedProductModel.quantity,
        OrderedProductModel.price_at_time_of_order,
        OrderedProductModel.order_id,
        OrderedProductModel.order
    ]

    column_searchable_list = [
        OrderedProductModel.id,
        OrderedProductModel.product_name,
    ]

    column_sortable_list = [
        OrderedProductModel.id,
        OrderedProductModel.product_name,
        OrderedProductModel.quantity,
        OrderedProductModel.price_at_time_of_order,
        OrderedProductModel.order_id,
    ]
    column_default_sort = [(OrderedProductModel.id, True)]

    column_formatters = {
        OrderedProductModel.price_at_time_of_order: lambda m, a: f"{m.price_at_time_of_order:.2f}",
        OrderedProductModel.quantity: lambda m, a: m.quantity,
    }

    column_labels = {
        OrderedProductModel.id: "ID",
        OrderedProductModel.product_name: "Название товара",
        OrderedProductModel.quantity: "Количество",
        OrderedProductModel.price_at_time_of_order: "Цена на момент заказа",
        OrderedProductModel.order_id: "ID Заказа",
        OrderedProductModel.order: "Заказ"
    }

    form_columns = [
        OrderedProductModel.product_name,
        OrderedProductModel.quantity,
        OrderedProductModel.price_at_time_of_order,
        OrderedProductModel.order,
    ]

    form_args = {
        "product_name": {
            "label": "Название товара",
            "description": "Введите название товара в заказе",
        },
        "quantity": {
            "label": "Количество",
            "description": "Введите количество единиц товара",
            "validators": [lambda x: x > 0]
        },
        "price_at_time_of_order": {
            "label": "Цена на момент заказа",
            "description": "Введите цену товара на момент оформления заказа",
            "coerce": Decimal
        },
        "order": {
            "label": "Заказ",
            "description": "Выберите заказ, к которому относится этот товар",
        },
    }

    # Управление операциями
    # Создание разрешено
    can_create = True
    # Редактирование разрешено
    can_edit = True
    # Удаление разрешено
    can_delete = True
    # Просмотр деталей разрешен
    can_view_details = True

    page_size = 25
    page_size_options = [10, 25, 50, 100]
