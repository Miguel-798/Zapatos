from app.application.dto.dashboard_dto import DashboardSummaryDTO
from app.infrastructure.repositories.catalog_repositories import category_repo, gender_repo
from app.infrastructure.repositories.supabase_shoe_repository import PostgresShoeRepository


class GetDashboardSummaryUseCase:
    """Use case for getting dashboard summary metrics - OPTIMIZED"""
    
    async def execute(self) -> DashboardSummaryDTO:
        shoe_repo = PostgresShoeRepository()
        
        # Get totals
        total_products = await shoe_repo.count()
        low_stock_count = await shoe_repo.count_low_stock()
        
        # Get category and gender counts in optimized way
        category_counts = await shoe_repo.get_counts_by_category()
        gender_counts = await shoe_repo.get_counts_by_gender()
        
        # Map category IDs to names
        categories = await category_repo.get_all()
        category_map = {str(cat.id): cat.name for cat in categories}
        
        # Map gender IDs to names
        genders = await gender_repo.get_all()
        gender_map = {str(g.id): g.name for g in genders}
        
        # Add names to counts
        for item in category_counts:
            item["category_name"] = category_map.get(str(item["category_id"]), "Sin categoría")
        
        for item in gender_counts:
            item["gender_name"] = gender_map.get(str(item["gender_id"]), "Sin género")
        
        # Get recent products
        recent = await shoe_repo.get_recent(5)
        
        return DashboardSummaryDTO(
            total_products=total_products,
            low_stock_count=low_stock_count,
            category_counts=category_counts,
            gender_counts=gender_counts,
            recent_products=recent
        )