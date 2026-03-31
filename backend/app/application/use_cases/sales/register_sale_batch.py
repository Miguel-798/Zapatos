from uuid import UUID
from decimal import Decimal
from datetime import datetime, timezone
import random
import string
from app.application.dto.sale_dto import CreateSaleBatchDTO, SaleBatchResponseDTO, SaleWithDetailsDTO
from sqlalchemy import select
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import SaleModel, SaleBatchModel, ShoeModel, SizeModel, shoe_sizes as shoe_sizes_table


class RegisterSaleBatchUseCase:
    """Use case for registering a sale with multiple items (invoice-like)"""
    
    async def execute(self, dto: CreateSaleBatchDTO) -> SaleBatchResponseDTO:
        if not dto.items or len(dto.items) == 0:
            raise ValueError("Debe agregar al menos un producto")
        
        # Generate invoice number
        invoice_number = self._generate_invoice_number()
        
        async with AsyncSessionLocal() as db:
            # First, validate all items have sufficient stock
            for item in dto.items:
                stock_query = select(
                    shoe_sizes_table.c.stock_quantity
                ).where(
                    shoe_sizes_table.c.shoe_id == item.shoe_id,
                    shoe_sizes_table.c.size_id == item.size_id
                )
                result = await db.execute(stock_query)
                row = result.fetchone()
                
                if not row:
                    raise ValueError(f"Combinación zapato/talla no encontrada")
                
                current_stock = row[0]
                if current_stock < item.quantity:
                    raise ValueError(f"Stock insuficiente para {item.shoe_id}: disponible {current_stock}, solicitado {item.quantity}")
            
            # All validations passed, now create the batch and items
            from uuid import uuid4
            batch_id = uuid4()
            
            # Create batch
            batch = SaleBatchModel(
                id=batch_id,
                invoice_number=invoice_number,
                total_amount=0,  # Will update after items
                notes=dto.notes,
                sale_date=datetime.now(timezone.utc),
                created_at=datetime.now(timezone.utc)
            )
            db.add(batch)
            
            total_amount = Decimal('0')
            items_response = []
            
            # Create each sale item and reduce stock
            for item in dto.items:
                item_id = uuid4()
                subtotal = Decimal(str(item.sale_price)) * item.quantity
                total_amount += subtotal
                
                sale = SaleModel(
                    id=item_id,
                    batch_id=batch_id,
                    shoe_id=item.shoe_id,
                    size_id=item.size_id,
                    quantity=item.quantity,
                    sale_price=item.sale_price,
                    subtotal=subtotal,
                    sale_date=datetime.now(timezone.utc),
                    created_at=datetime.now(timezone.utc)
                )
                db.add(sale)
                
                # Reduce stock
                await db.execute(
                    shoe_sizes_table.update()
                    .where(
                        shoe_sizes_table.c.shoe_id == item.shoe_id,
                        shoe_sizes_table.c.size_id == item.size_id
                    )
                    .values(stock_quantity=shoe_sizes_table.c.stock_quantity - item.quantity)
                )
                
                # Get shoe info for response
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
                
                items_response.append(SaleWithDetailsDTO(
                    id=item_id,
                    shoe_id=item.shoe_id,
                    shoe_name=shoe_name,
                    shoe_sku=shoe_sku,
                    size_id=item.size_id,
                    size_number=size_number,
                    quantity=item.quantity,
                    sale_price=item.sale_price,
                    subtotal=subtotal,
                    sale_date=batch.sale_date,
                    created_at=batch.created_at
                ))
            
            # Update batch total
            batch.total_amount = total_amount
            
            await db.commit()
            
            return SaleBatchResponseDTO(
                batch_id=batch_id,
                invoice_number=invoice_number,
                items=items_response,
                total_amount=total_amount,
                sale_date=batch.sale_date,
                notes=dto.notes
            )
    
    def _generate_invoice_number(self) -> str:
        """Generate a unique invoice number"""
        # Format: VENTA-YYYYMMDD-XXXX
        from datetime import datetime
        now = datetime.now()
        date_str = now.strftime("%Y%m%d")
        random_part = ''.join(random.choices(string.digits, k=4))
        return f"VENTA-{date_str}-{random_part}"
