from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from decimal import Decimal


class ShoeSizeInputDTO(BaseModel):
    """DTO for shoe size with stock - uses size_id for creation"""
    size_id: UUID
    stock_quantity: int


class ShoeSizeUpdateDTO(BaseModel):
    """DTO for updating shoe size stock - uses size_number"""
    size_number: int
    stock_quantity: int


class ShoeSizeOutputDTO(BaseModel):
    """DTO for shoe size output"""
    size_id: Optional[str] = None
    size_number: int
    stock_quantity: int


class ShoeDTO(BaseModel):
    """Base DTO for Shoe entity - used for list views"""
    id: UUID
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


class ShoeDetailDTO(ShoeDTO):
    """Extended DTO for shoe detail view with all relations"""
    category_name: Optional[str] = None
    brand_name: Optional[str] = None
    gender_name: Optional[str] = None
    supplier_name: Optional[str] = None
    location_name: Optional[str] = None
    season_name: Optional[str] = None
    colors: List[str] = []
    materials: List[str] = []
    sizes: List[ShoeSizeOutputDTO] = []


class CreateShoeDTO(BaseModel):
    """DTO for creating a new shoe"""
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
    color_ids: List[UUID] = []
    material_ids: List[UUID] = []
    sizes: List[ShoeSizeInputDTO] = []


class UpdateShoeDTO(BaseModel):
    """DTO for updating an existing shoe - all fields optional for partial updates"""
    sku: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[UUID] = None
    brand_id: Optional[UUID] = None
    gender_id: Optional[UUID] = None
    supplier_id: Optional[UUID] = None
    location_id: Optional[UUID] = None
    season_id: Optional[UUID] = None
    image_url: Optional[str] = None
    min_stock: Optional[int] = None
    price_cost: Optional[Decimal] = None
    price_sale: Optional[Decimal] = None
    is_active: Optional[bool] = None
    sizes: Optional[List[ShoeSizeUpdateDTO]] = None


class ShoeFiltersDTO(BaseModel):
    """DTO for filtering shoes - used in list queries"""
    category_id: Optional[UUID] = None
    brand_id: Optional[UUID] = None
    gender_id: Optional[UUID] = None
    size_id: Optional[UUID] = None
    color_id: Optional[UUID] = None
    material_id: Optional[UUID] = None
    supplier_id: Optional[UUID] = None
    location_id: Optional[UUID] = None
    season_id: Optional[UUID] = None
    search: Optional[str] = None
    low_stock: bool = False
    page: int = 1
    limit: int = 20


class ShoeListResponseDTO(BaseModel):
    """DTO for paginated shoe list response"""
    data: List[ShoeDetailDTO]
    total: int
    page: int
    limit: int
