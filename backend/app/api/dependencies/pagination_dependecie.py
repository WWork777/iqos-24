from typing import Tuple

from fastapi import Query


def get_pagination(
        skip: int = Query(0, ge=0, description="Количество пропущенных записей"),
        limit: int = Query(50, ge=1, le=1000, description="Лимит записей на странице")
) -> Tuple[int, int]:
    return skip, limit