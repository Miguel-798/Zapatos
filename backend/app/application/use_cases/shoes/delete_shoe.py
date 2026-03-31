from uuid import UUID
from app.domain.repositories.interfaces import ShoeRepository


class DeleteShoeUseCase:
    """Use case for soft-deleting a shoe"""
    
    def __init__(self, shoe_repository: ShoeRepository):
        self.shoe_repository = shoe_repository
    
    async def execute(self, shoe_id: UUID) -> bool:
        success = await self.shoe_repository.delete(shoe_id)
        if not success:
            raise ValueError(f"Zapato no encontrado: {shoe_id}")
        return True
