from .base import BaseEntity
from typing import Optional

class Color(BaseEntity):
    name: str
    hex_code: Optional[str] = None
