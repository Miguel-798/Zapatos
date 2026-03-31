from uuid import UUID
from decimal import Decimal
from datetime import datetime, timezone
from app.application.dto.sale_dto import CreateSaleDTO, SaleResponseDTO, SaleWithDetailsDTO
from sqlalchemy import select, text
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import ShoeModel, SizeModel, SaleModel, shoe_sizes as shoe_sizes_table


class RegisterSaleUseCase:
    """Use case for registering a new sale with atomic stock reduction"""
    
    async def execute(self, dto: CreateSaleDTO) -> SaleWithDetailsDTO:
        async with AsyncSessionLocal() as db:
            # First check stock availability
            stock_query = select(
                shoe_sizes_table.c.stock_quantity
            ).where(
                shoe_sizes_table.c.shoe_id == dto.shoe_id,
                shoe_sizes_table.c.size_id == dto.size_id
            )
            result = await db.execute(stock_query)
            row = result.fetchone()
            
            if not row:
                raise ValueError("Shoe/size combination not found")
            
            current_stock = row[0]
            if current_stock < dto.quantity:
                raise ValueError(f"Insufficient stock: available {current_stock}, requested {dto.quantity}")
            
            # Insert sale record - use UTC timezone aware datetime
            from uuid import uuid4
            sale_id = uuid4()
            now = datetime.now(timezone.utc)  # UTC aware datetime
            sale = SaleModel(
                id=sale_id,
                shoe_id=dto.shoe_id,
                size_id=dto.size_id,
                quantity=dto.quantity,
                sale_price=dto.sale_price,
                sale_date=now,
                created_at=now
            )
            db.add(sale)
            
            # Reduce stock
            await db.execute(
                shoe_sizes_table.update()
                .where(
                    shoe_sizes_table.c.shoe_id == dto.shoe_id,
                    shoe_sizes_table.c.size_id == dto.size_id
                )
                .values(stock_quantity=shoe_sizes_table.c.stock_quantity - dto.quantity)
            )
            
            await db.commit()
            
            # Fetch sale details for response
            sale_details = await self._get_sale_details(sale_id)
            
            return sale_details
    
    async def _get_sale_details(self, sale_id: UUID) -> SaleWithDetailsDTO:
        """Fetch complete sale details including shoe and size info"""
        async with AsyncSessionLocal() as db:
            # Get sale record
            sale_query = select(SaleModel).where(SaleModel.id == sale_id)
            result = await db.execute(sale_query)
            sale = result.scalar_one_or_none()
            
            if not sale:
                raise ValueError("Sale not found after registration")
            
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
            
            total = Decimal(str(sale.sale_price)) * sale.quantity
            
            return SaleWithDetailsDTO(
                id=sale.id,
                shoe_id=sale.shoe_id,
                shoe_name=shoe_name,
                shoe_sku=shoe_sku,
                size_id=sale.size_id,
                size_number=size_number,
                quantity=sale.quantity,
                sale_price=sale.sale_price,
                total=total,
                sale_date=sale.sale_date,
                created_at=sale.created_at
            )
