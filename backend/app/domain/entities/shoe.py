from .base import BaseEntity
from typing import Optional, List
from uuid import UUID
from decimal import Decimal
from datetime import datetime

class Shoe(BaseEntity):
    sku: str
    name: str
    description: Optional[str] = None
    category_id: Optional[UUID] = None
    brand_id: Optional[UUID] = None
    gender_id: Optional[UUID] = None
    supplier_id: Optional[UUID] = None
    location_id: Optional[UUID] = None
    season_id: Optional[UUID] = None
    image_url: Optional[str] = None
    min_stock: int = 5
    price_cost: Optional[Decimal] = None
    price_sale: Optional[Decimal] = None
    is_active: bool = True
    updated_at: Optional[datetime] = None
