from sqladmin import ModelView

from backend.core.models import IqosModel
from backend.core.models.emun_for_models import ENUM_COLORS


class IqosAdmin(ModelView, model=IqosModel):
    name = "Iqos"
    name_plural = "Таблица Iqos"

    column_list = [
        IqosModel.id,
        IqosModel.name,
        IqosModel.model,
        IqosModel.price,
        IqosModel.sale_price,
        IqosModel.nalichie,
        IqosModel.new,
        IqosModel.hit,
        IqosModel.exclusive,
        IqosModel.color,
        IqosModel.category,
    ]

    column_searchable_list = [IqosModel.name, IqosModel.description, IqosModel.model]
    column_sortable_list = [
        IqosModel.id, IqosModel.name, IqosModel.model, IqosModel.price, IqosModel.sale_price, IqosModel.nalichie, IqosModel.new, IqosModel.hit, IqosModel.exclusive, IqosModel.color
    ]
    column_default_sort = [(IqosModel.id, True)]

    column_formatters = {
        IqosModel.nalichie: lambda m, a: "Да" if m.nalichie else "Нет",
        IqosModel.new: lambda m, a: "Да" if m.new else "Нет",
        IqosModel.hit: lambda m, a: "Да" if m.hit else "Нет" if m.hit is not None else "Н/Д",
        IqosModel.exclusive: lambda m, a: "Да" if m.exclusive else "Нет" if m.exclusive is not None else "Н/Д",
        IqosModel.sale_price: lambda m, a: m.sale_price if m.sale_price is not None else "Н/Д",
    }

    column_labels = {
        IqosModel.id: "ID",
        IqosModel.name: "Название",
        IqosModel.model: "Модель",
        IqosModel.description: "Описание",
        IqosModel.image: "Изображение",
        IqosModel.price: "Цена",
        IqosModel.color: "Цвет",
        IqosModel.nalichie: "Наличие",
        IqosModel.new: "Новинка",
        IqosModel.hit: "Хит",
        IqosModel.exclusive: "Эксклюзив",
        IqosModel.ref: "Ссылка",
        IqosModel.type: "Тип",
        IqosModel.sale_price: "Цена продажи",
        IqosModel.id_category: "ID Категории",
        IqosModel.category: "Категория",
    }

    form_columns = [
        IqosModel.name,
        IqosModel.model,
        IqosModel.description,
        IqosModel.image,
        IqosModel.price,
        IqosModel.color,
        IqosModel.nalichie,
        IqosModel.new,
        IqosModel.hit,
        IqosModel.exclusive,
        IqosModel.ref,
        IqosModel.type,
        IqosModel.sale_price,
        IqosModel.category
    ]

    form_args = {
        "name": {
            "label": "Название устройства",
            "description": "Введите название устройства",
        },
        "model": {
            "label": "Модель",
            "description": "Введите модель",
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
        "color": {
            "label": "Цвет",
            "description": "Выберите цвет устройства",
            "choices": [(c, c) for c in ENUM_COLORS],
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
        "exclusive": {
            "label": "Эксклюзив",
            "description": "Укажите: Да = 1;  Нет = 0",
        },
        "ref": {
            "label": "Ссылка",
            "description": "Укажите ссылку на товар",
        },
        "type": {
            "label": "Тип",
            "description": "Тип = iqos",
        },
        "sale_price": {
            "label": "Цена продажи",
            "description": "Укажите цену продажи",
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