from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from typing import Optional


class SaleItemDTO(BaseModel):
    """DTO for a single sale item"""
    shoe_id: UUID
    size_id: Optional[UUID] = None
    quantity: int
    sale_price: Decimal


class CreateSaleBatchDTO(BaseModel):
    """DTO for registering a sale with multiple items"""
    items: list[SaleItemDTO]
    notes: Optional[str] = None


class CreateSaleDTO(BaseModel):
    """DTO for registering a single sale (legacy compatibility)"""
    shoe_id: UUID
    size_id: Optional[UUID] = None
    quantity: int
    sale_price: Decimal


class SaleResponseDTO(BaseModel):
    """DTO for sale response"""
    id: UUID
    shoe_id: UUID
    size_id: UUID
    quantity: int
    sale_price: Decimal
    sale_date: datetime
    created_at: datetime
    # Additional fields for display
    shoe_name: Optional[str] = None
    shoe_sku: Optional[str] = None
    size_number: Optional[int] = None


class SaleWithDetailsDTO(BaseModel):
    """DTO for sale with full details"""
    id: UUID
    shoe_id: UUID
    shoe_name: str
    shoe_sku: str
    size_id: UUID
    size_number: int
    quantity: int
    sale_price: Decimal
    subtotal: Decimal
    sale_date: datetime
    created_at: datetime


class SaleBatchResponseDTO(BaseModel):
    """DTO for a complete sale batch with items"""
    batch_id: UUID
    invoice_number: str
    items: list[SaleWithDetailsDTO]
    total_amount: Decimal
    sale_date: datetime
    notes: Optional[str] = None


class SaleListResponseDTO(BaseModel):
    """DTO for paginated sales list"""
    data: list[SaleWithDetailsDTO]
    total: int
    page: int
    limit: int


class SaleBatchListResponseDTO(BaseModel):
    """DTO for paginated sale batches list"""
    data: list[SaleBatchResponseDTO]
    total: int
    page: int
    limit: int
