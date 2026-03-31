from app.application.dto.dashboard_dto import LowStockShoeDTO
from app.domain.repositories.interfaces import ShoeRepository


class GetLowStockUseCase:
    """Use case for getting shoes with low stock"""
    
    def __init__(self, shoe_repository: ShoeRepository):
        self.shoe_repository = shoe_repository
    
    async def execute(self) -> list[LowStockShoeDTO]:
        shoes = await self.shoe_repository.get_low_stock()
        return shoes
