from fastapi import APIRouter, Query
from decimal import Decimal
from typing import Optional
from datetime import datetime
from app.application.dto.dashboard_dto import (
    DashboardSummaryDTO, 
    LowStockShoeDTO,
    FinanceKPIsDTO,
    FinanceAnalysisDTO,
    BreakEvenDTO,
    CashFlowResponseDTO,
    SalesChartResponseDTO,
    TopProductsResponseDTO,
    SettingsDTO,
    SettingsUpdateDTO
)
from app.application.use_cases.dashboard.get_summary import GetDashboardSummaryUseCase
from app.application.use_cases.dashboard.get_low_stock import GetLowStockUseCase
from app.application.use_cases.dashboard.get_finance_kpis import GetFinanceKPIsUseCase
from app.application.use_cases.dashboard.get_finance_analysis import GetFinanceAnalysisUseCase
from app.application.use_cases.dashboard.get_break_even import GetBreakEvenUseCase
from app.application.use_cases.dashboard.get_cash_flow import GetCashFlowUseCase
from app.application.use_cases.dashboard.get_sales_chart import GetSalesChartUseCase
from app.application.use_cases.dashboard.get_top_products import GetTopProductsUseCase
from app.application.use_cases.dashboard.settings import GetSettingsUseCase, UpdateSettingsUseCase
from app.infrastructure.repositories.supabase_shoe_repository import PostgresShoeRepository
from app.infrastructure.database.database import SessionLocal

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

shoe_repo = PostgresShoeRepository()


# Existing endpoints
@router.get("/summary", response_model=DashboardSummaryDTO)
async def get_summary():
    use_case = GetDashboardSummaryUseCase()
    return await use_case.execute()


@router.get("/low-stock", response_model=list[LowStockShoeDTO])
async def get_low_stock():
    use_case = GetLowStockUseCase(shoe_repo)
    return await use_case.execute()


# Finance endpoints
@router.get("/finance/kpis", response_model=FinanceKPIsDTO)
async def get_finance_kpis(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None)
):
    """Get finance KPIs: facturación, ventas, ticket promedio, margen bruto"""
    use_case = GetFinanceKPIsUseCase()
    return await use_case.execute(start_date, end_date)


@router.get("/finance/analysis", response_model=FinanceAnalysisDTO)
async def get_finance_analysis(
    fixed_costs: Decimal = Query(0, description="Costos fijos mensuales"),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None)
):
    """Get financial analysis: margen bruto, margen neto, utilidad neta"""
    use_case = GetFinanceAnalysisUseCase()
    return await use_case.execute(fixed_costs, start_date, end_date)


@router.get("/finance/break-even", response_model=BreakEvenDTO)
async def get_break_even(
    fixed_costs: Decimal = Query(..., description="Costos fijos mensuales")
):
    """Calculate break-even point"""
    use_case = GetBreakEvenUseCase()
    return await use_case.execute(fixed_costs)


@router.get("/finance/cash-flow", response_model=CashFlowResponseDTO)
async def get_cash_flow(
    months: int = Query(6, ge=1, le=24, description="Número de meses a mostrar"),
    fixed_costs_monthly: Decimal = Query(0, description="Costos fijos mensuales")
):
    """Get cash flow by period"""
    use_case = GetCashFlowUseCase()
    return await use_case.execute(months, fixed_costs_monthly)


@router.get("/finance/sales-chart", response_model=SalesChartResponseDTO)
async def get_sales_chart(
    months: int = Query(12, ge=1, le=36, description="Número de meses a mostrar")
):
    """Get sales chart data (monthly)"""
    use_case = GetSalesChartUseCase()
    return await use_case.execute(months)


@router.get("/finance/top-products", response_model=TopProductsResponseDTO)
async def get_top_products(
    limit: int = Query(5, ge=1, le=20, description="Número de productos")
):
    """Get top selling products"""
    use_case = GetTopProductsUseCase()
    return await use_case.execute(limit)


# Settings endpoints
@router.get("/settings/{setting_id}", response_model=SettingsDTO)
async def get_settings(setting_id: str):
    """Get a setting by ID"""
    db = SessionLocal()
    try:
        use_case = GetSettingsUseCase(db)
        return use_case.execute(setting_id)
    finally:
        db.close()


@router.put("/settings/{setting_id}", response_model=SettingsDTO)
async def update_settings(setting_id: str, dto: SettingsUpdateDTO):
    """Create or update a setting"""
    db = SessionLocal()
    try:
        use_case = UpdateSettingsUseCase(db)
        return use_case.execute(setting_id, dto)
    finally:
        db.close()