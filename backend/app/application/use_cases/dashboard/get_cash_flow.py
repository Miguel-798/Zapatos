"""
GetCashFlowUseCase - Get cash flow by period
"""
from decimal import Decimal
from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, func, extract
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import SaleModel, ShoeModel
from app.application.dto.dashboard_dto import CashFlowResponseDTO, CashFlowEntryDTO


class GetCashFlowUseCase:
    """Use case for getting cash flow data"""
    
    async def execute(self, months: int = 6, fixed_costs_monthly: Decimal = Decimal('0')) -> CashFlowResponseDTO:
        async with AsyncSessionLocal() as db:
            # Get sales grouped by month for last N months
            # Calculate month range
            # Use raw SQL for more complex grouping
            
            # Get monthly data: sum of subtotal, sum of quantity
            monthly_query = select(
                extract('year', SaleModel.sale_date).label('year'),
                extract('month', SaleModel.sale_date).label('month'),
                func.coalesce(func.sum(SaleModel.subtotal), 0).label('ingresos'),
                func.coalesce(func.sum(SaleModel.quantity), 0).label('cantidad')
            ).group_by(
                extract('year', SaleModel.sale_date),
                extract('month', SaleModel.sale_date)
            ).order_by(
                extract('year', SaleModel.sale_date).desc(),
                extract('month', SaleModel.sale_date).desc()
            ).limit(months)
            
            result = await db.execute(monthly_query)
            rows = result.all()
            
            entries = []
            month_names = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            
            for row in rows:
                year = int(row[0])
                month = int(row[1])
                ingresos = Decimal(str(row[2]))
                cantidad = row[3]
                
                # Calculate cost of goods for this period
                # Get cost for same period using date range
                month_start = datetime(year, month, 1)
                if month == 12:
                    month_end = datetime(year + 1, 1, 1)
                else:
                    month_end = datetime(year, month + 1, 1)
                
                cost_query = select(
                    func.coalesce(func.sum(SaleModel.quantity * func.coalesce(ShoeModel.price_cost, 0)), 0)
                ).join(
                    ShoeModel, ShoeModel.id == SaleModel.shoe_id
                ).where(
                    SaleModel.sale_date >= month_start,
                    SaleModel.sale_date < month_end
                )
                cost_result = await db.execute(cost_query)
                costo_mercancia = Decimal(str(cost_result.scalar() or 0))
                
                # Calculate balance
                balance_neto = ingresos - costo_mercancia - fixed_costs_monthly
                
                # Format period
                periodo = f"{year}-{month:02d}"
                periodo_nombre = f"{month_names[month-1]} {year}"
                
                entries.append(CashFlowEntryDTO(
                    periodo=periodo,
                    ingresos=ingresos.quantize(Decimal('0.01')),
                    costo_mercancia=costo_mercancia.quantize(Decimal('0.01')),
                    costos_fijos=fixed_costs_monthly,
                    balance_neto=balance_neto.quantize(Decimal('0.01'))
                ))
            
            return CashFlowResponseDTO(
                data=entries,
                total=Decimal(str(sum(e.balance_neto for e in entries))).quantize(Decimal('0.01'))
            )