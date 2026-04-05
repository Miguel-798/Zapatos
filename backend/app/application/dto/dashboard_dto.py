from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal


class DashboardSummaryDTO(BaseModel):
    """DTO for dashboard summary metrics"""
    total_products: int
    low_stock_count: int
    category_counts: List[dict]  # [{category_name, count}]
    gender_counts: List[dict]    # [{gender_name, count}]
    recent_products: List[dict]


class LowStockShoeDTO(BaseModel):
    """DTO for shoes with low stock"""
    id: UUID
    sku: str
    name: str
    brand_name: Optional[str] = None
    category_name: Optional[str] = None
    total_stock: int
    min_stock: int
    sizes_low: List[dict]  # [{size_number, stock}]


class LowStockResponseDTO(BaseModel):
    """DTO for low stock list response"""
    data: List[LowStockShoeDTO]
    total: int


# ============ Finance DTOs ============

class FinanceKPIsDTO(BaseModel):
    """DTO for finance KPIs"""
    facturacion_total: Decimal
    cantidad_ventas: int
    ticket_promedio: Decimal
    margen_bruto_porcentaje: Decimal


class FinanceAnalysisDTO(BaseModel):
    """DTO for financial analysis"""
    ingresos: Decimal
    costo_mercancia: Decimal
    margen_bruto: Decimal
    costos_fijos: Decimal
    margen_neto: Decimal
    utilidad_neta: Decimal


class BreakEvenDTO(BaseModel):
    """DTO for break-even analysis"""
    costos_fijos: Decimal
    precio_promedio_venta: Decimal
    costo_promedio_unitario: Decimal
    margen_contribucion_unitario: Decimal
    unidades_equilibrio: int
    ventas_minimas_cop: Decimal


class CashFlowEntryDTO(BaseModel):
    """DTO for cash flow table entry"""
    periodo: str  # "2026-01" format
    ingresos: Decimal
    costo_mercancia: Decimal
    costos_fijos: Decimal
    balance_neto: Decimal


class CashFlowResponseDTO(BaseModel):
    """DTO for cash flow response"""
    data: List[CashFlowEntryDTO]
    total: Decimal


class SalesChartEntryDTO(BaseModel):
    """DTO for sales chart data"""
    mes: str  # "2026-01" format
    mes_nombre: str  # "Enero 2026"
    facturacion: Decimal
    cantidad_ventas: int


class SalesChartResponseDTO(BaseModel):
    """DTO for sales chart response"""
    data: List[SalesChartEntryDTO]


class TopProductDTO(BaseModel):
    """DTO for top product"""
    shoe_id: UUID
    name: str
    sku: str
    cantidad_vendida: int
    facturacion: Decimal
    costo_total: Decimal
    utilidad: Decimal


class TopProductsResponseDTO(BaseModel):
    """DTO for top products response"""
    data: List[TopProductDTO]


class DateRangeDTO(BaseModel):
    """DTO for date range filter"""
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class SettingsDTO(BaseModel):
    """DTO for app settings"""
    id: str
    value: Optional[str] = None


class SettingsUpdateDTO(BaseModel):
    """DTO for updating settings"""
    value: str
