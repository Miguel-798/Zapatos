"""
DeleteSaleBatchUseCase - Delete a sale batch and restore stock

This use case handles:
1. Finding and validating the batch exists
2. Deleting all sale items in the batch
3. Deleting the batch itself
4. Restoring stock to shoes for each item deleted

Uses transaction to ensure atomicity - if any step fails, all changes are rolled back.
"""
from uuid import UUID
from sqlalchemy import select, delete
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import SaleBatchModel, SaleModel, ShoeModel


class DeleteSaleBatchUseCase:
    """Use case for deleting a sale batch and restoring stock"""
    
    async def execute(self, batch_id: UUID) -> dict:
        """
        Delete a sale batch and restore stock.
        
        Args:
            batch_id: UUID of the batch to delete
            
        Returns:
            dict with success message and deleted items count
            
        Raises:
            ValueError: If batch not found
        """
        async with AsyncSessionLocal() as db:
            # 1. Find the batch
            batch_query = select(SaleBatchModel).where(SaleBatchModel.id == batch_id)
            batch_result = await db.execute(batch_query)
            batch = batch_result.scalar_one_or_none()
            
            if not batch:
                raise ValueError(f"Lote de venta no encontrado: {batch_id}")
            
            # 2. Get all sale items for this batch
            items_query = select(SaleModel).where(SaleModel.batch_id == batch_id)
            items_result = await db.execute(items_query)
            items = items_result.scalars().all()
            
            # 3. Restore stock for each item
            for item in items:
                # Get current shoe stock
                shoe_query = select(ShoeModel.stock).where(ShoeModel.id == item.shoe_id)
                shoe_result = await db.execute(shoe_query)
                current_stock = shoe_result.scalar() or 0
                
                # Restore stock
                new_stock = current_stock + item.quantity
                await db.execute(
                    ShoeModel.__table__.update()
                    .where(ShoeModel.id == item.shoe_id)
                    .values(stock=new_stock)
                )
            
            # 4. Delete sale items (cascade)
            await db.execute(
                delete(SaleModel).where(SaleModel.batch_id == batch_id)
            )
            
            # 5. Delete the batch
            await db.execute(
                delete(SaleBatchModel).where(SaleBatchModel.id == batch_id)
            )
            
            # 6. Commit transaction
            await db.commit()
            
            return {
                "success": True,
                "message": f"Lote {batch.invoice_number} eliminado",
                "items_deleted": len(items),
                "stock_restored": sum(item.quantity for item in items)
            }