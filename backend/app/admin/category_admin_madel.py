from sqladmin import ModelView

from backend.core.models import DevicesCategoryModel, IqosCategoryModel, TereaCategoryModel


class DevicesCategoryAdmin(ModelView, model=DevicesCategoryModel):
    name = "Категории Devices"
    name_plural = "Таблица категорий Devices"

    column_list = [DevicesCategoryModel.id, DevicesCategoryModel.category_name]

    column_searchable_list = [DevicesCategoryModel.category_name]
    column_sortable_list = [DevicesCategoryModel.id, DevicesCategoryModel.category_name]
    column_default_sort = [(DevicesCategoryModel.id, True)]
    column_labels = {DevicesCategoryModel.id: "ID", DevicesCategoryModel.category_name: "Название Категории"}

    form_columns = [DevicesCategoryModel.category_name]
    form_args = {
        "category_name": {
            "label": "Название категории",
            "description": "Введите название категории"
        }
    }

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True

    page_size = 25
    page_size_options = [10, 25, 50, 100]


class IqosCategoryAdmin(ModelView, model=IqosCategoryModel):
    name = "Категории Iqos"
    name_plural = "Таблица категорий Iqos"

    column_list = [IqosCategoryModel.id, IqosCategoryModel.category_name]

    column_searchable_list = [IqosCategoryModel.category_name]
    column_sortable_list = [IqosCategoryModel.id, IqosCategoryModel.category_name]
    column_default_sort = [(IqosCategoryModel.id, True)]
    column_labels = {IqosCategoryModel.id: "ID", IqosCategoryModel.category_name: "Название Категории"}

    form_columns = [IqosCategoryModel.category_name]
    form_args = {
        "category_name": {
            "label": "Название категории",
            "description": "Введите название категории"
        }
    }

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True

    page_size = 25
    page_size_options = [10, 25, 50, 100]


class TereaCategoryAdmin(ModelView, model=TereaCategoryModel):
    name = "Категории Terea"
    name_plural = "Таблица категорий Terea"

    column_list = [TereaCategoryModel.id, TereaCategoryModel.category_name]

    column_searchable_list = [TereaCategoryModel.category_name]
    column_sortable_list = [TereaCategoryModel.id, TereaCategoryModel.category_name]
    column_default_sort = [(TereaCategoryModel.id, True)]
    column_labels = {TereaCategoryModel.id: "ID", TereaCategoryModel.category_name: "Название Категории"}

    form_columns = [TereaCategoryModel.category_name]

    form_args = {
        "category_name": {
            "label": "Название категории",
            "description": "Введите название категории"
        }
    }

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True

    page_size = 25
    page_size_options = [10, 25, 50, 100]