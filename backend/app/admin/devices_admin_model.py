from sqladmin import ModelView

from backend.core.models import DevicesModel
from backend.core.models.emun_for_models import ENUM_COLORS


class DevicesAdmin(ModelView, model=DevicesModel):
    name = "Devices"
    name_plural = "Таблица Devices"

    column_list = [
        DevicesModel.id,
        DevicesModel.name,
        DevicesModel.price,
        DevicesModel.nalichie,
        DevicesModel.new,
        DevicesModel.hit,
        DevicesModel.color,
        DevicesModel.category,
    ]

    column_searchable_list = [DevicesModel.name, DevicesModel.description]
    column_sortable_list = [DevicesModel.id, DevicesModel.name, DevicesModel.price, DevicesModel.nalichie, DevicesModel.new, DevicesModel.hit, DevicesModel.color]  # Сортировка по полям
    column_default_sort = [(DevicesModel.id, True)]

    column_formatters = {
        DevicesModel.nalichie: lambda m, a: "Да" if m.nalichie else "Нет",
        DevicesModel.new: lambda m, a: "Да" if m.new else "Нет",
        DevicesModel.hit: lambda m, a: "Да" if m.hit else "Нет" if m.hit is not None else "Н/Д",
    }

    column_labels = {
        DevicesModel.id: "ID",
        DevicesModel.name: "Название",
        DevicesModel.description: "Описание",
        DevicesModel.image: "Изображение",
        DevicesModel.price: "Цена",
        DevicesModel.nalichie: "Наличие",
        DevicesModel.new: "Новинка",
        DevicesModel.hit: "Хит",
        DevicesModel.color: "Цвет",
        DevicesModel.ref: "Ссылка",
        DevicesModel.type: "Тип",
        DevicesModel.device_id: "ID Категории",
        DevicesModel.category: "Категория",
    }

    form_columns = [
        DevicesModel.name,
        DevicesModel.description,
        DevicesModel.image,
        DevicesModel.price,
        DevicesModel.nalichie,
        DevicesModel.new,
        DevicesModel.hit,
        DevicesModel.color,
        DevicesModel.ref,
        DevicesModel.type,
        DevicesModel.category
    ]

    form_args = {
        "name": {
            "label": "Название устройства",
            "description": "Введите название устройства",
        },
        "description": {
            "label": "Описание",
            "description": "Введите описание устройства",
        },
        "image": {
            "label": "Изображение",
            "description": "Укажите ссылку на изображение",
        },
        "price": {
            "label": "Цена",
            "description": "Введите цену устройства",
        },
        "nalichie": {
            "label": "В наличии",
            "description": "Укажите: Да = 1;  Нет = 0",
        },
        "new": {
            "label": "Новинка",
            "description": "Укажите: Да = 1;  Нет = 0",
        },
        "hit": {
            "label": "Хит",
            "description": "Укажите: Да = 1;  Нет = 0",
        },
        "color": {
            "label": "Цвет",
            "description": "Выберите цвет устройства",
            "choices": [(c, c) for c in ENUM_COLORS],
        },
        "ref": {
            "label": "Ссылка",
            "description": "Укажите ссылку на товар",
        },
        "type": {
            "label": "Тип",
            "description": "Тип = devices",
        },
        "category": {
            "label": "Категория",
            "description": "Выберите категорию товара",
        },
    }

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True

    page_size = 25
    page_size_options = [10, 25, 50, 100]





