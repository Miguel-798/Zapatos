from uuid import UUID
from decimal import Decimal
from datetime import datetime
from app.application.dto.sale_dto import SaleWithDetailsDTO, SaleListResponseDTO
from sqlalchemy import select, func
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import SaleModel, ShoeModel, SizeModel


class ListSalesUseCase:
    """Use case for listing sales with pagination"""
    
    async def execute(self, page: int = 1, limit: int = 20) -> SaleListResponseDTO:
        async with AsyncSessionLocal() as db:
            offset = (page - 1) * limit
            
            # Get total count
            count_query = select(func.count(SaleModel.id))
            total_result = await db.execute(count_query)
            total = total_result.scalar() or 0
            
            # Get sales with pagination
            query = (
                select(SaleModel)
                .order_by(SaleModel.created_at.desc())
                .offset(offset)
                .limit(limit)
            )
            result = await db.execute(query)
            sales = result.scalars().all()
            
            # Build response with details
            sales_data = []
            for sale in sales:
                # Get shoe info
                shoe_query = select(ShoeModel.name, ShoeModel.sku).where(ShoeModel.id == sale.shoe_id)
                shoe_result = await db.execute(shoe_query)
                shoe_row = shoe_result.fetchone()
                shoe_name = shoe_row[0] if shoe_row else "Unknown"
                shoe_sku = shoe_row[1] if shoe_row else "N/A"
                
                # Get size number
                size_query = select(SizeModel.number).where(SizeModel.id == sale.size_id)
                size_result = await db.execute(size_query)
                size_row = size_result.fetchone()
                size_number = size_row[0] if size_row else 0
                
                total_price = Decimal(str(sale.sale_price)) * sale.quantity
                
                sales_data.append(SaleWithDetailsDTO(
                    id=sale.id,
                    shoe_id=sale.shoe_id,
                    shoe_name=shoe_name,
                    shoe_sku=shoe_sku,
                    size_id=sale.size_id,
                    size_number=size_number,
                    quantity=sale.quantity,
                    sale_price=sale.sale_price,
                    total=total_price,
                    sale_date=sale.sale_date,
                    created_at=sale.created_at
                ))
            
            return SaleListResponseDTO(
                data=sales_data,
                total=total,
                page=page,
                limit=limit
            )
