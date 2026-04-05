from sqlalchemy import Column, String, Integer, Boolean, Numeric, DateTime, ForeignKey, Table, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.infrastructure.database.database import Base


# Tablas de asociación
shoe_colors = Table(
    'shoe_colors',
    Base.metadata,
    Column('shoe_id', UUID(as_uuid=True), ForeignKey('shoes.id'), primary_key=True, index=True),
    Column('color_id', UUID(as_uuid=True), ForeignKey('colors.id'), primary_key=True, index=True)
)

shoe_materials = Table(
    'shoe_materials',
    Base.metadata,
    Column('shoe_id', UUID(as_uuid=True), ForeignKey('shoes.id'), primary_key=True, index=True),
    Column('material_id', UUID(as_uuid=True), ForeignKey('materials.id'), primary_key=True, index=True)
)

shoe_sizes = Table(
    'shoe_sizes',
    Base.metadata,
    Column('shoe_id', UUID(as_uuid=True), ForeignKey('shoes.id'), primary_key=True, index=True),
    Column('size_id', UUID(as_uuid=True), ForeignKey('sizes.id'), primary_key=True, index=True),
    Column('stock_quantity', Integer, default=0),
    Index('ix_shoe_sizes_shoe_stock', 'shoe_id', 'stock_quantity')
)


class ShoeModel(Base):
    """SQLAlchemy model for shoes table"""
    __tablename__ = 'shoes'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    sku = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(String(1000))
    category_id = Column(UUID(as_uuid=True), ForeignKey('categories.id'), index=True)
    brand_id = Column(UUID(as_uuid=True), ForeignKey('brands.id'), index=True)
    gender_id = Column(UUID(as_uuid=True), ForeignKey('genders.id'), index=True)
    supplier_id = Column(UUID(as_uuid=True), ForeignKey('suppliers.id'), index=True)
    location_id = Column(UUID(as_uuid=True), ForeignKey('locations.id'), index=True)
    season_id = Column(UUID(as_uuid=True), ForeignKey('seasons.id'), index=True)
    image_url = Column(String(500))
    stock = Column(Integer, default=0, nullable=False)
    min_stock = Column(Integer, default=5)
    price_cost = Column(Numeric(10, 2))
    price_sale = Column(Numeric(10, 2))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class CategoryModel(Base):
    """SQLAlchemy model for categories table"""
    __tablename__ = 'categories'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class BrandModel(Base):
    """SQLAlchemy model for brands table"""
    __tablename__ = 'brands'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    logo_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class GenderModel(Base):
    """SQLAlchemy model for genders table"""
    __tablename__ = 'genders'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(20), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SupplierModel(Base):
    """SQLAlchemy model for suppliers table"""
    __tablename__ = 'suppliers'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(150), nullable=False)
    contact_name = Column(String(100))
    phone = Column(String(20))
    email = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LocationModel(Base):
    """SQLAlchemy model for locations table"""
    __tablename__ = 'locations'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ColorModel(Base):
    """SQLAlchemy model for colors table"""
    __tablename__ = 'colors'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    hex_code = Column(String(7))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MaterialModel(Base):
    """SQLAlchemy model for materials table"""
    __tablename__ = 'materials'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SizeModel(Base):
    """SQLAlchemy model for sizes table"""
    __tablename__ = 'sizes'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    number = Column(Integer, nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SeasonModel(Base):
    """SQLAlchemy model for seasons table"""
    __tablename__ = 'seasons'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SaleBatchModel(Base):
    """SQLAlchemy model for sale batches (invoices) - groups multiple items"""
    __tablename__ = 'sale_batches'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    invoice_number = Column(String(20), unique=True, nullable=False)
    total_amount = Column(Numeric(12, 2), default=0)
    status = Column(String(20), default='completed')  # completed, cancelled
    notes = Column(Text, nullable=True)
    sale_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SaleModel(Base):
    """SQLAlchemy model for sales table"""
    __tablename__ = 'sales'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    batch_id = Column(UUID(as_uuid=True), ForeignKey('sale_batches.id'), nullable=True)  # Group items in a batch
    shoe_id = Column(UUID(as_uuid=True), ForeignKey('shoes.id'), nullable=False)
    size_id = Column(UUID(as_uuid=True), ForeignKey('sizes.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    sale_price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)  # quantity * sale_price
    sale_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SettingsModel(Base):
    """SQLAlchemy model for app settings"""
    __tablename__ = 'app_settings'
    
    id = Column(String(50), primary_key=True)  # e.g., 'fixed_costs'
    value = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
