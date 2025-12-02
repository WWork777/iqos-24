from sqladmin import ModelView
from wtforms import TextAreaField

from backend.core.models import TereaModel
from backend.core.models.emun_for_models import SET_FLAVORS


class MySQLSetField(TextAreaField):
    def __init__(self, label=None, validators=None, filters=(), description='', id=None, default=None, widget=None,
                 render_kw=None, name=None, _form=None, _prefix='', _translations=None, _meta=None):
        if render_kw is None:
            render_kw = {}
        render_kw.setdefault("rows", 3)
        render_kw.setdefault("cols", 50)
        
        super().__init__(
            label=label, 
            validators=validators, 
            filters=filters, 
            description=description, 
            id=id, 
            default=default, 
            widget=widget, 
            render_kw=render_kw, 
            name=name, 
            _form=_form, 
            _prefix=_prefix, 
            _translations=_translations, 
            _meta=_meta
        )
        
    def process_formdata(self, valuelist):
        if valuelist:
            self.data = valuelist[0]
        else:
            self.data = None


class TereaAdmin(ModelView, model=TereaModel):
    name = "Terea"
    name_plural = "Таблица Terea"

    column_list = [
        TereaModel.id,
        TereaModel.name,
        TereaModel.price,
        TereaModel.pricePack,
        TereaModel.flavor,
        TereaModel.strength,
        TereaModel.has_capsule,
        TereaModel.country,
        TereaModel.nalichie,
        TereaModel.new,
        TereaModel.hit,
        TereaModel.category,
    ]

    column_searchable_list = [TereaModel.name, TereaModel.description, TereaModel.flavor, TereaModel.strength, TereaModel.country]
    column_sortable_list = [
        TereaModel.id, TereaModel.name, TereaModel.price, TereaModel.pricePack, TereaModel.flavor, TereaModel.strength, TereaModel.has_capsule, TereaModel.country, TereaModel.nalichie, TereaModel.new, TereaModel.hit
    ]
    column_default_sort = [(TereaModel.id, True)]

    column_formatters = {
        TereaModel.nalichie: lambda m, a: "Да" if m.nalichie else "Нет",
        TereaModel.new: lambda m, a: "Да" if m.new else "Нет",
        TereaModel.hit: lambda m, a: "Да" if m.hit else "Нет" if m.hit is not None else "Н/Д",
        TereaModel.has_capsule: lambda m, a: "Да" if m.has_capsule else "Нет",
        TereaModel.pricePack: lambda m, a: m.pricePack if m.pricePack is not None else "Н/Д",
        TereaModel.flavor: lambda m, a: ', '.join(m.flavor) if isinstance(m.flavor, (list, set, tuple)) else m.flavor,
    }

    column_labels = {
        TereaModel.id: "ID",
        TereaModel.name: "Название",
        TereaModel.description: "Описание",
        TereaModel.image: "Изображение",
        TereaModel.imagePack: "Пакет изображений",
        TereaModel.price: "Цена",
        TereaModel.pricePack: "Пакет с ценами",
        TereaModel.has_capsule: "Имеет капсулу",
        TereaModel.flavor: "Вкус",
        TereaModel.country: "Страна",
        TereaModel.brend: "Бренд",
        TereaModel.strength: "Крепость",
        TereaModel.nalichie: "Наличие",
        TereaModel.new: "Новинка",
        TereaModel.hit: "Хит",
        TereaModel.ref: "Ссылка",
        TereaModel.type: "Тип",
        TereaModel.terea_id: "ID Категории",
        TereaModel.category: "Категория",
    }

    form_columns = [
        TereaModel.name,
        TereaModel.description,
        TereaModel.image,
        TereaModel.imagePack,
        TereaModel.price,
        TereaModel.pricePack,
        TereaModel.has_capsule,
        TereaModel.flavor,
        TereaModel.country,
        TereaModel.brend,
        TereaModel.strength,
        TereaModel.nalichie,
        TereaModel.new,
        TereaModel.hit,
        TereaModel.ref,
        TereaModel.type,
        TereaModel.category
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
        "imagePack": {
            "label": "Пакет изображений",
            "description": "Укажите ссылку на изображение",
        },
        "price": {
            "label": "Цена",
            "description": "Введите цену устройства",
        },
        "pricePack": {
            "label": "Пакет с ценами",
            "description": "Укажите цену",
        },
        "has_capsule": {
            "label": "Имеет капсулу",
            "description": "Укажите: Да = 1;  Нет = 0",
        },
        "flavor": {
            "label": "Вкус",
            "description": "Введите вкусы через запятую. Доступные вкусы: " + ", ".join(SET_FLAVORS),
        },
        "country": {
            "label": "Страна",
            "description": "Укажите страну",
        },
        "brend": {
            "label": "Бренд",
            "description": "Бренд = Terea",
        },
        "strength": {
            "label": "Крепость",
            "description": "Укажите крепость",
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
        "ref": {
            "label": "Ссылка",
            "description": "Укажите ссылку на товар",
        },
        "type": {
            "label": "Тип",
            "description": "Тип = terea",
        },
        "category": {
            "label": "Категория",
            "description": "Выберите категорию товара",
        },
    }

    form_overrides = {
        "flavor": MySQLSetField,
    }

    async def on_model_change(self, data, model, is_created, request):
        if "flavor" in data:
            flavor_data = data["flavor"]

            if isinstance(flavor_data, str) and flavor_data.startswith("{") and flavor_data.endswith("}"):
                clean_flavor = flavor_data[1:-1].replace("'", "")
                flavor_data = clean_flavor.replace(", ", ",")

            if isinstance(flavor_data, str):
                flavors = [f.strip() for f in flavor_data.split(",") if f.strip()]
                valid_flavors = [f for f in flavors if f in SET_FLAVORS]
                data["flavor"] = ",".join(valid_flavors)

        if hasattr(super(), 'on_model_change'):
            await super().on_model_change(data, model, is_created, request)

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True

    page_size = 25
    page_size_options = [10, 25, 50, 100]