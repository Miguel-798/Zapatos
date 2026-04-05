"""
GetFinanceKPIsUseCase - Get finance KPIs (facturación, ventas, ticket, margen)
"""
from decimal import Decimal
from datetime import datetime
from typing import Optional
from sqlalchemy import select, func
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import SaleModel, ShoeModel
from app.application.dto.dashboard_dto import FinanceKPIsDTO


class GetFinanceKPIsUseCase:
    """Use case for getting finance KPIs"""
    
    async def execute(self, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> FinanceKPIsDTO:
        async with AsyncSessionLocal() as db:
            # Base query conditions
            conditions = []
            if start_date:
                conditions.append(SaleModel.sale_date >= start_date)
            if end_date:
                conditions.append(SaleModel.sale_date <= end_date)
            
            # Get total facturacion (sum of subtotal)
            facturacion_query = select(
                func.coalesce(func.sum(SaleModel.subtotal), 0)
            )
            if conditions:
                for cond in conditions:
                    facturacion_query = facturacion_query.where(cond)
            facturacion_result = await db.execute(facturacion_query)
            facturacion_total = Decimal(str(facturacion_result.scalar() or 0))
            
            # Get cantidad de ventas (count of transactions)
            ventas_query = select(
                func.count(SaleModel.id)
            )
            if conditions:
                for cond in conditions:
                    ventas_query = ventas_query.where(cond)
            ventas_result = await db.execute(ventas_query)
            cantidad_ventas = ventas_result.scalar() or 0
            
            # Calculate ticket promedio
            ticket_promedio = Decimal('0') if cantidad_ventas == 0 else facturacion_total / cantidad_ventas
            
            # Get cost of goods sold (sum of price_cost * quantity where price_cost is not null)
            cost_query = select(
                func.coalesce(func.sum(SaleModel.quantity * ShoeModel.price_cost), 0)
            ).join(
                ShoeModel, ShoeModel.id == SaleModel.shoe_id
            ).where(
                ShoeModel.price_cost.isnot(None)
            )
            if conditions:
                for cond in conditions:
                    cost_query = cost_query.where(cond)
            cost_result = await db.execute(cost_query)
            costo_total = Decimal(str(cost_result.scalar() or 0))
            
            # Calculate margen bruto percentage: ((revenue - cost) / revenue) * 100
            if facturacion_total > 0:
                margen_bruto_porcentaje = ((facturacion_total - costo_total) / facturacion_total) * 100
            else:
                margen_bruto_porcentaje = Decimal('0')
            
            return FinanceKPIsDTO(
                facturacion_total=facturacion_total,
                cantidad_ventas=cantidad_ventas,
                ticket_promedio=ticket_promedio.quantize(Decimal('0.01')),
                margen_bruto_porcentaje=margen_bruto_porcentaje.quantize(Decimal('0.01'))
            )