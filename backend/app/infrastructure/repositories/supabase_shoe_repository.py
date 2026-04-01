from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, insert
from sqlalchemy.orm import selectinload
from app.domain.entities.shoe import Shoe
from app.domain.repositories.interfaces import ShoeRepository
from app.application.dto.shoe_dto import CreateShoeDTO, UpdateShoeDTO, ShoeDetailDTO
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import ShoeModel, shoe_sizes as shoe_sizes_table, shoe_colors, shoe_materials


class PostgresShoeRepository(ShoeRepository):
    """Shoe repository using SQLAlchemy with PostgreSQL"""
    
    def __init__(self):
        self.table = 'shoes'
    
    def _get_session(self) -> AsyncSession:
        """Get async session for database operations."""
        return AsyncSessionLocal()
    
    async def get_all(
        self,
        category_id: Optional[UUID] = None,
        brand_id: Optional[UUID] = None,
        gender_id: Optional[UUID] = None,
        color_id: Optional[UUID] = None,
        material_id: Optional[UUID] = None,
        size_id: Optional[UUID] = None,
        search: Optional[str] = None,
        low_stock: bool = False,
        limit: int = 100,
        offset: int = 0
    ) -> tuple[List[Shoe], int]:
        async with self._get_session() as db:
            from app.infrastructure.database.models import shoe_colors, shoe_materials, shoe_sizes as shoe_sizes_table
            
            # Build base query
            query = select(ShoeModel).where(ShoeModel.is_active == True)
            count_query = select(func.count(ShoeModel.id)).where(ShoeModel.is_active == True)
            
            # Apply filters
            if category_id:
                query = query.where(ShoeModel.category_id == category_id)
                count_query = count_query.where(ShoeModel.category_id == category_id)
            if brand_id:
                query = query.where(ShoeModel.brand_id == brand_id)
                count_query = count_query.where(ShoeModel.brand_id == brand_id)
            if gender_id:
                query = query.where(ShoeModel.gender_id == gender_id)
                count_query = count_query.where(ShoeModel.gender_id == gender_id)
            
            # Color filter - need to join with shoe_colors
            if color_id:
                query = query.join(shoe_colors).where(shoe_colors.c.color_id == color_id)
                count_query = count_query.join(shoe_colors).where(shoe_colors.c.color_id == color_id)
            
            # Material filter - need to join with shoe_materials
            if material_id:
                query = query.join(shoe_materials).where(shoe_materials.c.material_id == material_id)
                count_query = count_query.join(shoe_materials).where(shoe_materials.c.material_id == material_id)
            
            # Size filter - need to join with shoe_sizes
            if size_id:
                query = query.join(shoe_sizes_table).where(shoe_sizes_table.c.size_id == size_id)
                count_query = count_query.join(shoe_sizes_table).where(shoe_sizes_table.c.size_id == size_id)
            
            if search:
                search_filter = or_(
                    ShoeModel.name.ilike(f'%{search}%'),
                    ShoeModel.sku.ilike(f'%{search}%')
                )
                query = query.where(search_filter)
                count_query = count_query.where(search_filter)
            
            # Get total count
            total_result = await db.execute(count_query)
            total = total_result.scalar() or 0
            
            # Apply pagination and ordering
            query = query.order_by(ShoeModel.created_at.desc())
            query = query.offset(offset).limit(limit)
            
            result = await db.execute(query)
            shoes = result.scalars().all()
            
            # Convert to domain entities
            shoe_entities = [self._to_entity(s) for s in shoes]
            return shoe_entities, total
    
    async def get_by_id(self, id: UUID) -> Optional[Shoe]:
        async with self._get_session() as db:
            query = select(ShoeModel).where(ShoeModel.id == id)
            result = await db.execute(query)
            shoe = result.scalar_one_or_none()
            
            if not shoe:
                return None
            return self._to_entity(shoe)
    
    async def create(self, dto: CreateShoeDTO) -> Shoe:
        async with self._get_session() as db:
            from uuid import uuid4
            # Create shoe model from DTO
            shoe_model = ShoeModel(
                id=uuid4(),  # Generate UUID for new shoe
                sku=dto.sku,
                name=dto.name,
                description=dto.description,
                category_id=dto.category_id,
                brand_id=dto.brand_id,
                gender_id=dto.gender_id,
                supplier_id=dto.supplier_id,
                location_id=dto.location_id,
                season_id=dto.season_id,
                image_url=dto.image_url,
                stock=dto.stock or 0,
                min_stock=dto.min_stock or 5,
                price_cost=dto.price_cost,
                price_sale=dto.price_sale,
                is_active=True
            )
            db.add(shoe_model)
            await db.commit()
            await db.refresh(shoe_model)
            
            # Guardar colores si existen
            if dto.color_ids and len(dto.color_ids) > 0:
                color_records = [
                    {'shoe_id': shoe_model.id, 'color_id': color_id}
                    for color_id in dto.color_ids
                ]
                await db.execute(insert(shoe_colors).values(color_records))
                await db.commit()
            
            # Guardar materiales si existen
            if dto.material_ids and len(dto.material_ids) > 0:
                material_records = [
                    {'shoe_id': shoe_model.id, 'material_id': material_id}
                    for material_id in dto.material_ids
                ]
                await db.execute(insert(shoe_materials).values(material_records))
                await db.commit()
            
            return self._to_entity(shoe_model)
    
    async def update(self, id: UUID, dto: UpdateShoeDTO) -> Optional[Shoe]:
        async with self._get_session() as db:
            query = select(ShoeModel).where(ShoeModel.id == id)
            result = await db.execute(query)
            shoe = result.scalar_one_or_none()
            
            if not shoe:
                return None
            
            # Update fields from DTO
            update_data = dto.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                if value is not None:
                    setattr(shoe, key, value)
            
            await db.commit()
            await db.refresh(shoe)
            
            return self._to_entity(shoe)
    
    async def delete(self, id: UUID) -> bool:
        async with self._get_session() as db:
            query = select(ShoeModel).where(ShoeModel.id == id)
            result = await db.execute(query)
            shoe = result.scalar_one_or_none()
            
            if shoe:
                shoe.is_active = False
                await db.commit()
                return True
            return False
    
    async def get_by_sku(self, sku: str) -> Optional[Shoe]:
        async with self._get_session() as db:
            query = select(ShoeModel).where(ShoeModel.sku == sku)
            result = await db.execute(query)
            shoe_model = result.scalar_one_or_none()
            
            if shoe_model:
                return self._to_entity(shoe_model)
            return None
    
    async def count(self) -> int:
        async with self._get_session() as db:
            query = select(func.count(ShoeModel.id)).where(ShoeModel.is_active == True)
            result = await db.execute(query)
            return result.scalar() or 0
    
    async def count_low_stock(self) -> int:
        # Simplified - count products with stock below minimum
        async with self._get_session() as db:
            from app.infrastructure.database.models import shoe_sizes
            query = select(func.count(func.distinct(shoe_sizes.c.shoe_id))).where(
                shoe_sizes.c.stock_quantity <= 5  # Hardcoded low stock threshold
            )
            result = await db.execute(query)
            return result.scalar() or 0
    
    async def count_by_category(self, category_id: UUID) -> int:
        async with self._get_session() as db:
            query = select(func.count(ShoeModel.id)).where(
                ShoeModel.category_id == category_id,
                ShoeModel.is_active == True
            )
            result = await db.execute(query)
            return result.scalar() or 0
    
    async def count_by_gender(self, gender_id: UUID) -> int:
        async with self._get_session() as db:
            query = select(func.count(ShoeModel.id)).where(
                ShoeModel.gender_id == gender_id,
                ShoeModel.is_active == True
            )
            result = await db.execute(query)
            return result.scalar() or 0
    
    async def get_counts_by_category(self) -> List[dict]:
        """Get count of shoes per category in a single query"""
        async with self._get_session() as db:
            query = select(
                ShoeModel.category_id,
                func.count(ShoeModel.id).label('count')
            ).where(
                ShoeModel.is_active == True,
                ShoeModel.category_id.isnot(None)
            ).group_by(ShoeModel.category_id)
            
            result = await db.execute(query)
            rows = result.all()
            
            return [
                {"category_id": str(row.category_id), "count": row.count}
                for row in rows
            ]
    
    async def get_counts_by_gender(self) -> List[dict]:
        """Get count of shoes per gender in a single query"""
        async with self._get_session() as db:
            query = select(
                ShoeModel.gender_id,
                func.count(ShoeModel.id).label('count')
            ).where(
                ShoeModel.is_active == True,
                ShoeModel.gender_id.isnot(None)
            ).group_by(ShoeModel.gender_id)
            
            result = await db.execute(query)
            rows = result.all()
            
            return [
                {"gender_id": str(row.gender_id), "count": row.count}
                for row in rows
            ]
    
    async def get_recent(self, limit: int = 5) -> List[dict]:
        async with self._get_session() as db:
            query = select(ShoeModel).where(ShoeModel.is_active == True).order_by(
                ShoeModel.created_at.desc()
            ).limit(limit)
            result = await db.execute(query)
            shoes = result.scalars().all()
            
            return [
                {
                    'id': str(s.id),
                    'name': s.name,
                    'sku': s.sku,
                    'brand': None,
                    'category': None,
                }
                for s in shoes
            ]
    
    async def get_low_stock(self) -> List[Shoe]:
        return []
    
    def _to_entity(self, model: ShoeModel) -> Shoe:
        """Convert SQLAlchemy model to domain entity"""
        return Shoe(
            id=model.id,
            sku=model.sku,
            name=model.name,
            description=model.description,
            category_id=model.category_id,
            brand_id=model.brand_id,
            gender_id=model.gender_id,
            supplier_id=model.supplier_id,
            location_id=model.location_id,
            season_id=model.season_id,
            image_url=model.image_url,
            min_stock=model.min_stock,
            price_cost=model.price_cost,
            price_sale=model.price_sale,
            is_active=model.is_active,
            created_at=model.created_at,
            updated_at=model.updated_at
        )


# Alias for backwards compatibility
SupabaseShoeRepository = PostgresShoeRepository
