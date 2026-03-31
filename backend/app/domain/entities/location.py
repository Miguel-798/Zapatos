from .base import BaseEntity
from typing import Optional

class Location(BaseEntity):
    name: str
    description: Optional[str] = None
