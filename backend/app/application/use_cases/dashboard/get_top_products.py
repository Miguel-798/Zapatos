"""
GetTopProductsUseCase - Get top selling products
"""
from decimal import Decimal
from uuid import UUID
from sqlalchemy import select, func
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import SaleModel, ShoeModel
from app.application.dto.dashboard_dto import TopProductsResponseDTO, TopProductDTO


class GetTopProductsUseCase:
    """Use case for getting top products by sales"""
    
    async def execute(self, limit: int = 5) -> TopProductsResponseDTO:
        async with AsyncSessionLocal() as db:
            # Get products grouped by shoe_id with totals
            top_query = select(
                SaleModel.shoe_id,
                func.count(SaleModel.id).label('cantidad_vendida'),
                func.coalesce(func.sum(SaleModel.subtotal), 0).label('facturacion'),
                func.coalesce(func.sum(SaleModel.quantity * func.coalesce(ShoeModel.price_cost, 0)), 0).label('costo_total')
            ).join(
                ShoeModel, ShoeModel.id == SaleModel.shoe_id
            ).group_by(
                SaleModel.shoe_id
            ).order_by(
                func.coalesce(func.sum(SaleModel.subtotal), 0).desc()
            ).limit(limit)
            
            result = await db.execute(top_query)
            rows = result.all()
            
            products = []
            for row in rows:
                shoe_id = row[0]
                cantidad_vendida = row[1]
                facturacion = Decimal(str(row[2]))
                costo_total = Decimal(str(row[3]))
                utilidad = facturacion - costo_total
                
                # Get shoe name and sku
                shoe_query = select(ShoeModel.name, ShoeModel.sku).where(ShoeModel.id == shoe_id)
                shoe_result = await db.execute(shoe_query)
                shoe_row = shoe_result.fetchone()
                name = shoe_row[0] if shoe_row else "Unknown"
                sku = shoe_row[1] if shoe_row else "N/A"
                
                products.append(TopProductDTO(
                    shoe_id=shoe_id,
                    name=name,
                    sku=sku,
                    cantidad_vendida=cantidad_vendida,
                    facturacion=facturacion.quantize(Decimal('0.01')),
                    costo_total=costo_total.quantize(Decimal('0.01')),
                    utilidad=utilidad.quantize(Decimal('0.01'))
                ))
            
            return TopProductsResponseDTO(data=products)