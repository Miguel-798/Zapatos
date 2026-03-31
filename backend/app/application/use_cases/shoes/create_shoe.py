import random
from uuid import UUID
from app.application.dto.shoe_dto import CreateShoeDTO, ShoeDetailDTO, ShoeSizeOutputDTO
from app.domain.repositories.interfaces import ShoeRepository
from sqlalchemy import select
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import shoe_sizes as shoe_sizes_table, SizeModel, shoe_colors, shoe_materials, ColorModel, MaterialModel, BrandModel, CategoryModel, GenderModel


class CreateShoeUseCase:
    """Use case for creating a new shoe"""
    
    def __init__(self, shoe_repository: ShoeRepository):
        self.shoe_repository = shoe_repository
    
    async def execute(self, dto: CreateShoeDTO) -> ShoeDetailDTO:
        # Generar SKU automático único
        chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
        while True:
            random_part = ''.join(random.choices(chars, k=5))
            sku_value = f"ZAP-{random_part}"
            
            # Verificar que no exista
            existing = await self.shoe_repository.get_by_sku(sku_value)
            if not existing:
                break
        
        # Actualizar el DTO con el SKU generado
        dto.sku = sku_value
        
        # Crear zapato
        shoe = await self.shoe_repository.create(dto)
        
        # Fetch sizes, colors, materials, and names for the response
        sizes_data = await self._get_shoe_sizes(shoe.id)
        colors_data = await self._get_shoe_colors(shoe.id)
        materials_data = await self._get_shoe_materials(shoe.id)
        brand_name = await self._get_brand_name(shoe.brand_id)
        category_name = await self._get_category_name(shoe.category_id)
        gender_name = await self._get_gender_name(shoe.gender_id)
        
        # Convertir entidad a DTO
        return ShoeDetailDTO(
            id=shoe.id,
            sku=shoe.sku,
            name=shoe.name,
            description=shoe.description,
            category_id=shoe.category_id,
            brand_id=shoe.brand_id,
            gender_id=shoe.gender_id,
            supplier_id=shoe.supplier_id,
            location_id=shoe.location_id,
            season_id=shoe.season_id,
            image_url=shoe.image_url,
            min_stock=shoe.min_stock,
            price_cost=shoe.price_cost,
            price_sale=shoe.price_sale,
            is_active=shoe.is_active,
            category_name=category_name,
            brand_name=brand_name,
            gender_name=gender_name,
            supplier_name=None,
            location_name=None,
            season_name=None,
            colors=colors_data,
            materials=materials_data,
            sizes=sizes_data
        )
    
    async def _get_shoe_sizes(self, shoe_id):
        """Fetch sizes with stock quantity for a shoe"""
        async with AsyncSessionLocal() as db:
            query = select(
                SizeModel.number,
                shoe_sizes_table.c.stock_quantity
            ).join(
                SizeModel, SizeModel.id == shoe_sizes_table.c.size_id
            ).where(
                shoe_sizes_table.c.shoe_id == shoe_id
            )
            
            result = await db.execute(query)
            rows = result.all()
            
            return [
                ShoeSizeOutputDTO(size_number=row.number, stock_quantity=row.stock_quantity)
                for row in rows
            ]
    
    async def _get_shoe_colors(self, shoe_id) -> list[str]:
        """Fetch colors for a shoe"""
        async with AsyncSessionLocal() as db:
            query = select(
                ColorModel.name
            ).join(
                shoe_colors, shoe_colors.c.color_id == ColorModel.id
            ).where(
                shoe_colors.c.shoe_id == shoe_id
            )
            
            result = await db.execute(query)
            rows = result.all()
            
            return [row.name for row in rows]
    
    async def _get_shoe_materials(self, shoe_id) -> list[str]:
        """Fetch materials for a shoe"""
        async with AsyncSessionLocal() as db:
            query = select(
                MaterialModel.name
            ).join(
                shoe_materials, shoe_materials.c.material_id == MaterialModel.id
            ).where(
                shoe_materials.c.shoe_id == shoe_id
            )
            
            result = await db.execute(query)
            rows = result.all()
            
            return [row.name for row in rows]
    
    async def _get_brand_name(self, brand_id) -> str | None:
        """Fetch brand name by ID"""
        if not brand_id:
            return None
        async with AsyncSessionLocal() as db:
            query = select(BrandModel.name).where(BrandModel.id == brand_id)
            result = await db.execute(query)
            row = result.scalar_one_or_none()
            return row
    
    async def _get_category_name(self, category_id) -> str | None:
        """Fetch category name by ID"""
        if not category_id:
            return None
        async with AsyncSessionLocal() as db:
            query = select(CategoryModel.name).where(CategoryModel.id == category_id)
            result = await db.execute(query)
            row = result.scalar_one_or_none()
            return row
    
    async def _get_gender_name(self, gender_id) -> str | None:
        """Fetch gender name by ID"""
        if not gender_id:
            return None
        async with AsyncSessionLocal() as db:
            query = select(GenderModel.name).where(GenderModel.id == gender_id)
            result = await db.execute(query)
            row = result.scalar_one_or_none()
            return row
