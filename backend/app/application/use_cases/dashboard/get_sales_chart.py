"""
GetSalesChartUseCase - Get sales by month for charts
"""
from decimal import Decimal
from typing import List
from sqlalchemy import select, func, extract
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import SaleModel
from app.application.dto.dashboard_dto import SalesChartResponseDTO, SalesChartEntryDTO


class GetSalesChartUseCase:
    """Use case for getting sales chart data (monthly)"""
    
    async def execute(self, months: int = 12) -> SalesChartResponseDTO:
        async with AsyncSessionLocal() as db:
            # Get sales grouped by month
            monthly_query = select(
                extract('year', SaleModel.sale_date).label('year'),
                extract('month', SaleModel.sale_date).label('month'),
                func.coalesce(func.sum(SaleModel.subtotal), 0).label('facturacion'),
                func.coalesce(func.sum(SaleModel.quantity), 0).label('cantidad_ventas')
            ).group_by(
                extract('year', SaleModel.sale_date),
                extract('month', SaleModel.sale_date)
            ).order_by(
                extract('year', SaleModel.sale_date).desc(),
                extract('month', SaleModel.sale_date).desc()
            ).limit(months)
            
            result = await db.execute(monthly_query)
            rows = result.all()
            
            month_names = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                          'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            
            entries = []
            for row in rows:
                year = int(row[0])
                month = int(row[1])
                facturacion = Decimal(str(row[2]))
                cantidad_ventas = row[3]
                
                periodo = f"{year}-{month:02d}"
                mes_nombre = f"{month_names[month-1]} {year}"
                
                entries.append(SalesChartEntryDTO(
                    mes=periodo,
                    mes_nombre=mes_nombre,
                    facturacion=facturacion.quantize(Decimal('0.01')),
                    cantidad_ventas=cantidad_ventas
                ))
            
            return SalesChartResponseDTO(data=entries)