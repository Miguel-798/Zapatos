from .base import BaseEntity
from typing import Optional

class Category(BaseEntity):
    name: str
    description: Optional[str] = None
