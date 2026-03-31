from uuid import UUID
from decimal import Decimal
from datetime import datetime
from app.application.dto.sale_dto import SaleWithDetailsDTO, SaleBatchResponseDTO, SaleBatchListResponseDTO
from sqlalchemy import select, func
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import SaleModel, SaleBatchModel, ShoeModel, SizeModel


class ListSaleBatchesUseCase:
    """Use case for listing sale batches (invoices) with pagination"""
    
    async def execute(self, page: int = 1, limit: int = 20) -> SaleBatchListResponseDTO:
        async with AsyncSessionLocal() as db:
            offset = (page - 1) * limit
            
            # Get total count
            count_query = select(func.count(SaleBatchModel.id))
            total_result = await db.execute(count_query)
            total = total_result.scalar() or 0
            
            # Get batches with pagination
            query = (
                select(SaleBatchModel)
                .order_by(SaleBatchModel.created_at.desc())
                .offset(offset)
                .limit(limit)
            )
            result = await db.execute(query)
            batches = result.scalars().all()
            
            # Build response with items
            batches_data = []
            for batch in batches:
                # Get all items for this batch
                items_query = select(SaleModel).where(SaleModel.batch_id == batch.id)
                items_result = await db.execute(items_query)
                items = items_result.scalars().all()
                
                items_dto = []
                for item in items:
                    # Get shoe info
                    shoe_query = select(ShoeModel.name, ShoeModel.sku).where(ShoeModel.id == item.shoe_id)
                    shoe_result = await db.execute(shoe_query)
                    shoe_row = shoe_result.fetchone()
                    shoe_name = shoe_row[0] if shoe_row else "Unknown"
                    shoe_sku = shoe_row[1] if shoe_row else "N/A"
                    
                    # Get size number
                    size_query = select(SizeModel.number).where(SizeModel.id == item.size_id)
                    size_result = await db.execute(size_query)
                    size_row = size_result.fetchone()
                    size_number = size_row[0] if size_row else 0
                    
                    items_dto.append(SaleWithDetailsDTO(
                        id=item.id,
                        shoe_id=item.shoe_id,
                        shoe_name=shoe_name,
                        shoe_sku=shoe_sku,
                        size_id=item.size_id,
                        size_number=size_number,
                        quantity=item.quantity,
                        sale_price=item.sale_price,
                        subtotal=item.subtotal,
                        sale_date=item.sale_date,
                        created_at=item.created_at
                    ))
                
                batches_data.append(SaleBatchResponseDTO(
                    batch_id=batch.id,
                    invoice_number=batch.invoice_number,
                    items=items_dto,
                    total_amount=batch.total_amount,
                    sale_date=batch.sale_date,
                    notes=batch.notes
                ))
            
            return SaleBatchListResponseDTO(
                data=batches_data,
                total=total,
                page=page,
                limit=limit
            )
