from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID


class DashboardSummaryDTO(BaseModel):
    """DTO for dashboard summary metrics"""
    total_products: int
    low_stock_count: int
    category_counts: List[dict]  # [{category_name, count}]
    gender_counts: List[dict]    # [{gender_name, count}]
    recent_products: List[dict]


class LowStockShoeDTO(BaseModel):
    """DTO for shoes with low stock"""
    id: UUID
    sku: str
    name: str
    brand_name: Optional[str] = None
    category_name: Optional[str] = None
    total_stock: int
    min_stock: int
    sizes_low: List[dict]  # [{size_number, stock}]


class LowStockResponseDTO(BaseModel):
    """DTO for low stock list response"""
    data: List[LowStockShoeDTO]
    total: int
