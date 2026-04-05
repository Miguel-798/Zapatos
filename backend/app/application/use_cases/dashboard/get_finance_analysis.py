"""
GetFinanceAnalysisUseCase - Get detailed financial analysis
Margen Bruto, Margen Neto, Utilidad Neta
"""
from decimal import Decimal
from datetime import datetime
from typing import Optional
from sqlalchemy import select, func
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import SaleModel, ShoeModel
from app.application.dto.dashboard_dto import FinanceAnalysisDTO


class GetFinanceAnalysisUseCase:
    """Use case for getting financial analysis"""
    
    async def execute(self, fixed_costs: Decimal = Decimal('0'), start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> FinanceAnalysisDTO:
        async with AsyncSessionLocal() as db:
            # Base query conditions
            conditions = []
            if start_date:
                conditions.append(SaleModel.sale_date >= start_date)
            if end_date:
                conditions.append(SaleModel.sale_date <= end_date)
            
            # Get ingresos (total revenue)
            ingresos_query = select(
                func.coalesce(func.sum(SaleModel.subtotal), 0)
            )
            if conditions:
                for cond in conditions:
                    ingresos_query = ingresos_query.where(cond)
            ingresos_result = await db.execute(ingresos_query)
            ingresos = Decimal(str(ingresos_result.scalar() or 0))
            
            # Get costo de mercancia (cost of goods sold)
            costo_query = select(
                func.coalesce(func.sum(SaleModel.quantity * func.coalesce(ShoeModel.price_cost, 0)), 0)
            ).join(
                ShoeModel, ShoeModel.id == SaleModel.shoe_id
            )
            if conditions:
                for cond in conditions:
                    costo_query = costo_query.where(cond)
            costo_result = await db.execute(costo_query)
            costo_mercancia = Decimal(str(costo_result.scalar() or 0))
            
            # Calculate margen bruto
            margen_bruto = ingresos - costo_mercancia
            
            # Margen neto = margen bruto - costos fijos
            margen_neto = margen_bruto - fixed_costs
            
            # Utilidad neta is same as margen neto in this context
            utilidad_neta = margen_neto
            
            return FinanceAnalysisDTO(
                ingresos=ingresos,
                costo_mercancia=costo_mercancia,
                margen_bruto=margen_bruto,
                costos_fijos=fixed_costs,
                margen_neto=margen_neto,
                utilidad_neta=utilidad_neta
            )