from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class CategoryDTO(BaseModel):
    """DTO for Category entity"""
    id: UUID
    name: str
    description: Optional[str] = None


class CreateCategoryDTO(BaseModel):
    """DTO for creating a new category"""
    name: str
    description: Optional[str] = None


class UpdateCategoryDTO(BaseModel):
    """DTO for updating a category"""
    name: Optional[str] = None
    description: Optional[str] = None


class BrandDTO(BaseModel):
    """DTO for Brand entity"""
    id: UUID
    name: str
    logo_url: Optional[str] = None


class CreateBrandDTO(BaseModel):
    """DTO for creating a new brand"""
    name: str
    logo_url: Optional[str] = None


class UpdateBrandDTO(BaseModel):
    """DTO for updating a brand"""
    name: Optional[str] = None
    logo_url: Optional[str] = None


class SupplierDTO(BaseModel):
    """DTO for Supplier entity"""
    id: UUID
    name: str
    contact_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class CreateSupplierDTO(BaseModel):
    """DTO for creating a new supplier"""
    name: str
    contact_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class UpdateSupplierDTO(BaseModel):
    """DTO for updating a supplier"""
    name: Optional[str] = None
    contact_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class LocationDTO(BaseModel):
    """DTO for Location entity"""
    id: UUID
    name: str
    description: Optional[str] = None


class CreateLocationDTO(BaseModel):
    """DTO for creating a new location"""
    name: str
    description: Optional[str] = None


class UpdateLocationDTO(BaseModel):
    """DTO for updating a location"""
    name: Optional[str] = None
    description: Optional[str] = None


class ColorDTO(BaseModel):
    """DTO for Color entity"""
    id: UUID
    name: str
    hex_code: Optional[str] = None


class CreateColorDTO(BaseModel):
    """DTO for creating a new color"""
    name: str
    hex_code: Optional[str] = None


class UpdateColorDTO(BaseModel):
    """DTO for updating a color"""
    name: Optional[str] = None
    hex_code: Optional[str] = None


class MaterialDTO(BaseModel):
    """DTO for Material entity"""
    id: UUID
    name: str


class CreateMaterialDTO(BaseModel):
    """DTO for creating a new material"""
    name: str


class UpdateMaterialDTO(BaseModel):
    """DTO for updating a material"""
    name: Optional[str] = None


class SizeDTO(BaseModel):
    """DTO for Size entity"""
    id: UUID
    number: int


class CreateSizeDTO(BaseModel):
    """DTO for creating a new size"""
    number: int


class UpdateSizeDTO(BaseModel):
    """DTO for updating a size"""
    number: Optional[int] = None


class SeasonDTO(BaseModel):
    """DTO for Season entity"""
    id: UUID
    name: str


class CreateSeasonDTO(BaseModel):
    """DTO for creating a new season"""
    name: str


class UpdateSeasonDTO(BaseModel):
    """DTO for updating a season"""
    name: Optional[str] = None


class GenderDTO(BaseModel):
    """DTO for Gender entity"""
    id: UUID
    name: str


class CreateGenderDTO(BaseModel):
    """DTO for creating a new gender"""
    name: str


class UpdateGenderDTO(BaseModel):
    """DTO for updating a gender"""
    name: Optional[str] = None
