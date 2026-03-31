from uuid import UUID, uuid4
from typing import List, Optional, Type, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import (
    CategoryModel, BrandModel, SupplierModel, LocationModel,
    ColorModel, MaterialModel, SizeModel, SeasonModel, GenderModel
)


class CatalogRepository:
    """Generic repository for catalog tables using SQLAlchemy"""
    
    def __init__(self, model: Type[Any]):
        self.model = model
    
    def _get_session(self) -> AsyncSession:
        return AsyncSessionLocal()
    
    async def get_all(self) -> List[Any]:
        async with self._get_session() as db:
            # SizeModel uses 'number' instead of 'name'
            if hasattr(self.model, 'name'):
                query = select(self.model).order_by(self.model.name)
            elif hasattr(self.model, 'number'):
                query = select(self.model).order_by(self.model.number)
            else:
                query = select(self.model)
            result = await db.execute(query)
            return list(result.scalars().all())
    
    async def get_by_id(self, id: UUID) -> Optional[Any]:
        async with self._get_session() as db:
            query = select(self.model).where(self.model.id == id)
            result = await db.execute(query)
            return result.scalar_one_or_none()
    
    async def create(self, data: dict) -> Any:
        async with self._get_session() as db:
            # Generate UUID if not provided
            if 'id' not in data or data['id'] is None:
                data['id'] = uuid4()
            
            # Create new instance
            instance = self.model(**data)
            db.add(instance)
            await db.commit()
            await db.refresh(instance)
            return instance
    
    async def update(self, id: UUID, data: dict) -> Optional[Any]:
        async with self._get_session() as db:
            query = select(self.model).where(self.model.id == id)
            result = await db.execute(query)
            instance = result.scalar_one_or_none()
            
            if not instance:
                return None
            
            for key, value in data.items():
                if hasattr(instance, key):
                    setattr(instance, key, value)
            
            await db.commit()
            await db.refresh(instance)
            return instance
    
    async def delete(self, id: UUID) -> bool:
        async with self._get_session() as db:
            query = select(self.model).where(self.model.id == id)
            result = await db.execute(query)
            instance = result.scalar_one_or_none()
            
            if instance:
                await db.delete(instance)
                await db.commit()
                return True
            return False


# Repository instances for each catalog
category_repo = CatalogRepository(CategoryModel)
brand_repo = CatalogRepository(BrandModel)
supplier_repo = CatalogRepository(SupplierModel)
location_repo = CatalogRepository(LocationModel)
color_repo = CatalogRepository(ColorModel)
material_repo = CatalogRepository(MaterialModel)
size_repo = CatalogRepository(SizeModel)
season_repo = CatalogRepository(SeasonModel)
gender_repo = CatalogRepository(GenderModel)
