from backend.app.admin.devices_admin_model import DevicesAdmin
from backend.app.admin.iqos_admin_model import IqosAdmin
from backend.app.admin.terea_admin_model import TereaAdmin
from backend.app.admin.category_admin_madel import DevicesCategoryAdmin, IqosCategoryAdmin, TereaCategoryAdmin
from backend.app.admin.orders_admin_model import OrdersAdmin, OrdersProductAdmin

admin_views = [
    DevicesAdmin,
    IqosAdmin,
    TereaAdmin,
    DevicesCategoryAdmin,
    IqosCategoryAdmin,
    TereaCategoryAdmin,
    OrdersAdmin,
    OrdersProductAdmin
]