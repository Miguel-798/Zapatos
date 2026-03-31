from .base import BaseEntity
from typing import Optional

class Brand(BaseEntity):
    name: str
    logo_url: Optional[str] = None
