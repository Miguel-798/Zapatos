"""
GetBreakEvenUseCase - Calculate break-even point
"""
from decimal import Decimal
from typing import Optional
from datetime import datetime
from sqlalchemy import select, func
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import SaleModel, ShoeModel
from app.application.dto.dashboard_dto import BreakEvenDTO


class GetBreakEvenUseCase:
    """Use case for calculating break-even point"""
    
    async def execute(self, fixed_costs: Decimal) -> BreakEvenDTO:
        async with AsyncSessionLocal() as db:
            # Get average sale price per unit from recent sales (last 30 days or all if less)
            # Using total revenue / total quantity = average price per unit
            avg_price_query = select(
                func.coalesce(func.sum(SaleModel.subtotal), 0),
                func.coalesce(func.sum(SaleModel.quantity), 0)
            )
            avg_price_result = await db.execute(avg_price_query)
            row = avg_price_result.fetchone()
            total_revenue = Decimal(str(row[0] or 0))
            total_quantity = row[1] or 0
            
            precio_promedio_venta = Decimal('0') if total_quantity == 0 else total_revenue / total_quantity
            
            # Get average cost per unit
            avg_cost_query = select(
                func.coalesce(func.sum(SaleModel.quantity * func.coalesce(ShoeModel.price_cost, 0)), 0),
                func.coalesce(func.sum(SaleModel.quantity), 0)
            ).join(
                ShoeModel, ShoeModel.id == SaleModel.shoe_id
            ).where(
                ShoeModel.price_cost.isnot(None)
            )
            avg_cost_result = await db.execute(avg_cost_query)
            cost_row = avg_cost_result.fetchone()
            total_cost = Decimal(str(cost_row[0] or 0))
            cost_quantity = cost_row[1] or 0
            
            costo_promedio_unitario = Decimal('0') if cost_quantity == 0 else total_cost / cost_quantity
            
            # Calculate margin per unit (contribución)
            margen_contribucion_unitario = precio_promedio_venta - costo_promedio_unitario
            
            # Calculate break-even units: fixed_costs / contribution_margin
            if margen_contribucion_unitario > 0:
                unidades_equilibrio = int(fixed_costs / margen_contribucion_unitario)
            else:
                unidades_equilibrio = 0
            
            # Calculate break-even in COP
            ventas_minimas_cop = unidades_equilibrio * precio_promedio_venta
            
            return BreakEvenDTO(
                costos_fijos=fixed_costs,
                precio_promedio_venta=precio_promedio_venta.quantize(Decimal('0.01')),
                costo_promedio_unitario=costo_promedio_unitario.quantize(Decimal('0.01')),
                margen_contribucion_unitario=margen_contribucion_unitario.quantize(Decimal('0.01')),
                unidades_equilibrio=unidades_equilibrio,
                ventas_minimas_cop=ventas_minimas_cop.quantize(Decimal('0'))
            )