from .base import BaseEntity
from typing import Optional

class Supplier(BaseEntity):
    name: str
    contact: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
