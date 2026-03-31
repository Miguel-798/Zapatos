from fastapi import APIRouter
from app.application.dto.dashboard_dto import DashboardSummaryDTO, LowStockShoeDTO
from app.application.use_cases.dashboard.get_summary import GetDashboardSummaryUseCase
from app.application.use_cases.dashboard.get_low_stock import GetLowStockUseCase
from app.infrastructure.repositories.supabase_shoe_repository import PostgresShoeRepository

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

shoe_repo = PostgresShoeRepository()


@router.get("/summary", response_model=DashboardSummaryDTO)
async def get_summary():
    use_case = GetDashboardSummaryUseCase()
    return await use_case.execute()


@router.get("/low-stock", response_model=list[LowStockShoeDTO])
async def get_low_stock():
    use_case = GetLowStockUseCase(shoe_repo)
    return await use_case.execute()
