from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from app.domain.entities.shoe import Shoe


class ShoeRepository(ABC):
    @abstractmethod
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
        pass
    
    @abstractmethod
    async def get_by_id(self, id: UUID) -> Optional[Shoe]:
        pass
    
    @abstractmethod
    async def create(self, shoe: Shoe) -> Shoe:
        pass
    
    @abstractmethod
    async def update(self, id: UUID, shoe: Shoe) -> Optional[Shoe]:
        pass
    
    @abstractmethod
    async def delete(self, id: UUID) -> bool:
        pass
    
    @abstractmethod
    async def get_by_sku(self, sku: str) -> Optional[Shoe]:
        pass
    
    @abstractmethod
    async def count(self) -> int:
        """Count total active shoes"""
        pass
    
    @abstractmethod
    async def count_low_stock(self) -> int:
        """Count shoes with stock below minimum threshold"""
        pass
    
    @abstractmethod
    async def count_by_category(self, category_id: UUID) -> int:
        """Count shoes by category"""
        pass
    
    @abstractmethod
    async def count_by_gender(self, gender_id: UUID) -> int:
        """Count shoes by gender"""
        pass
    
    @abstractmethod
    async def get_recent(self, limit: int = 5) -> List[Shoe]:
        """Get most recently created shoes"""
        pass
    
    @abstractmethod
    async def get_low_stock(self) -> List[Shoe]:
        """Get all shoes with stock below minimum threshold"""
        pass


class CategoryRepository(ABC):
    @abstractmethod
    async def get_all(self) -> List:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: UUID):
        pass
    
    @abstractmethod
    async def create(self, data: dict):
        pass
    
    @abstractmethod
    async def update(self, id: UUID, data: dict):
        pass
    
    @abstractmethod
    async def delete(self, id: UUID) -> bool:
        pass


class BrandRepository(ABC):
    @abstractmethod
    async def get_all(self) -> List:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: UUID):
        pass
    
    @abstractmethod
    async def create(self, data: dict):
        pass
    
    @abstractmethod
    async def update(self, id: UUID, data: dict):
        pass
    
    @abstractmethod
    async def delete(self, id: UUID) -> bool:
        pass


class SupplierRepository(ABC):
    @abstractmethod
    async def get_all(self) -> List:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: UUID):
        pass
    
    @abstractmethod
    async def create(self, data: dict):
        pass
    
    @abstractmethod
    async def update(self, id: UUID, data: dict):
        pass
    
    @abstractmethod
    async def delete(self, id: UUID) -> bool:
        pass


class LocationRepository(ABC):
    @abstractmethod
    async def get_all(self) -> List:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: UUID):
        pass
    
    @abstractmethod
    async def create(self, data: dict):
        pass
    
    @abstractmethod
    async def update(self, id: UUID, data: dict):
        pass
    
    @abstractmethod
    async def delete(self, id: UUID) -> bool:
        pass


class ColorRepository(ABC):
    @abstractmethod
    async def get_all(self) -> List:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: UUID):
        pass
    
    @abstractmethod
    async def create(self, data: dict):
        pass
    
    @abstractmethod
    async def update(self, id: UUID, data: dict):
        pass
    
    @abstractmethod
    async def delete(self, id: UUID) -> bool:
        pass


class MaterialRepository(ABC):
    @abstractmethod
    async def get_all(self) -> List:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: UUID):
        pass
    
    @abstractmethod
    async def create(self, data: dict):
        pass
    
    @abstractmethod
    async def update(self, id: UUID, data: dict):
        pass
    
    @abstractmethod
    async def delete(self, id: UUID) -> bool:
        pass


class SizeRepository(ABC):
    @abstractmethod
    async def get_all(self) -> List:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: UUID):
        pass
    
    @abstractmethod
    async def create(self, data: dict):
        pass
    
    @abstractmethod
    async def update(self, id: UUID, data: dict):
        pass
    
    @abstractmethod
    async def delete(self, id: UUID) -> bool:
        pass


class SeasonRepository(ABC):
    @abstractmethod
    async def get_all(self) -> List:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: UUID):
        pass
    
    @abstractmethod
    async def create(self, data: dict):
        pass
    
    @abstractmethod
    async def update(self, id: UUID, data: dict):
        pass
    
    @abstractmethod
    async def delete(self, id: UUID) -> bool:
        pass


class GenderRepository(ABC):
    @abstractmethod
    async def get_all(self) -> List:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: UUID):
        pass
    
    @abstractmethod
    async def create(self, data: dict):
        pass
    
    @abstractmethod
    async def update(self, id: UUID, data: dict):
        pass
    
    @abstractmethod
    async def delete(self, id: UUID) -> bool:
        pass
