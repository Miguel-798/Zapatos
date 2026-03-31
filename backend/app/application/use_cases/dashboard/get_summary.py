from app.application.dto.dashboard_dto import DashboardSummaryDTO
from app.infrastructure.repositories.catalog_repositories import category_repo, gender_repo


class GetDashboardSummaryUseCase:
    """Use case for getting dashboard summary metrics"""
    
    async def execute(self) -> DashboardSummaryDTO:
        from app.infrastructure.repositories.supabase_shoe_repository import PostgresShoeRepository
        
        shoe_repo = PostgresShoeRepository()
        
        # Obtener totales
        total_products = await shoe_repo.count()
        low_stock_count = await shoe_repo.count_low_stock()
        
        # Obtener conteos por categoría
        categories = await category_repo.get_all()
        category_counts = []
        for cat in categories:
            count = await shoe_repo.count_by_category(cat.id)
            category_counts.append({
                "category_id": str(cat.id),
                "category_name": cat.name,
                "count": count
            })
        
        # Obtener conteos por género
        genders = await gender_repo.get_all()
        gender_counts = []
        for gen in genders:
            count = await shoe_repo.count_by_gender(gen.id)
            gender_counts.append({
                "gender_id": str(gen.id),
                "gender_name": gen.name,
                "count": count
            })
        
        # Obtener recientes
        recent = await shoe_repo.get_recent(5)
        
        return DashboardSummaryDTO(
            total_products=total_products,
            low_stock_count=low_stock_count,
            category_counts=category_counts,
            gender_counts=gender_counts,
            recent_products=recent
        )
