from app.application.dto.shoe_dto import ShoeFiltersDTO, ShoeListResponseDTO, ShoeDetailDTO
from app.domain.repositories.interfaces import ShoeRepository
from sqlalchemy import select
from app.infrastructure.database.database import AsyncSessionLocal
from app.infrastructure.database.models import ShoeModel, shoe_colors as shoe_colors_table, shoe_materials as shoe_materials_table, ColorModel, MaterialModel, BrandModel, CategoryModel, GenderModel


class ListShoesUseCase:
    """Use case for listing shoes with filters and pagination - OPTIMIZED FOR NETWORK LATENCY"""
    
    def __init__(self, shoe_repository: ShoeRepository):
        self.shoe_repository = shoe_repository
    
    async def execute(self, filters: ShoeFiltersDTO) -> ShoeListResponseDTO:
        offset = (filters.page - 1) * filters.limit
        
        # Use a single session for all queries to reduce connection overhead
        async with AsyncSessionLocal() as db:
            # Build base query
            from sqlalchemy import func, or_
            
            query = select(ShoeModel).where(ShoeModel.is_active == True)
            count_query = select(func.count(ShoeModel.id)).where(ShoeModel.is_active == True)
            
            # Apply filters
            if filters.category_id:
                query = query.where(ShoeModel.category_id == filters.category_id)
                count_query = count_query.where(ShoeModel.category_id == filters.category_id)
            if filters.brand_id:
                query = query.where(ShoeModel.brand_id == filters.brand_id)
                count_query = count_query.where(ShoeModel.brand_id == filters.brand_id)
            if filters.gender_id:
                query = query.where(ShoeModel.gender_id == filters.gender_id)
                count_query = count_query.where(ShoeModel.gender_id == filters.gender_id)
            
            # Color filter
            if filters.color_id:
                from app.infrastructure.database.models import shoe_colors
                query = query.join(shoe_colors).where(shoe_colors.c.color_id == filters.color_id)
                count_query = count_query.join(shoe_colors).where(shoe_colors.c.color_id == filters.color_id)
            
            # Material filter
            if filters.material_id:
                from app.infrastructure.database.models import shoe_materials
                query = query.join(shoe_materials).where(shoe_materials.c.material_id == filters.material_id)
                count_query = count_query.join(shoe_materials).where(shoe_materials.c.material_id == filters.material_id)
            
            # Search filter
            if filters.search:
                search_filter = or_(
                    ShoeModel.name.ilike(f'%{filters.search}%'),
                    ShoeModel.sku.ilike(f'%{filters.search}%')
                )
                query = query.where(search_filter)
                count_query = count_query.where(search_filter)
            
            # Low stock filter
            if filters.low_stock:
                from app.infrastructure.database.models import shoe_sizes
                query = query.join(shoe_sizes).where(shoe_sizes.c.stock_quantity < ShoeModel.min_stock)
                count_query = count_query.join(shoe_sizes).where(shoe_sizes.c.stock_quantity < ShoeModel.min_stock)
            
            # Get total count
            total_result = await db.execute(count_query)
            total = total_result.scalar() or 0
            
            # Execute main query
            query = query.limit(filters.limit).offset(offset)
            result = await db.execute(query)
            shoes = result.scalars().all()
            
            if not shoes:
                return ShoeListResponseDTO(
                    data=[],
                    total=total,
                    page=filters.page,
                    limit=filters.limit
                )
            
            # Fetch all related data in the SAME session (no new connections)
            shoe_ids = [shoe.id for shoe in shoes]
            
            # Get all colors
            colors_query = select(
                shoe_colors_table.c.shoe_id,
                ColorModel.name
            ).join(
                ColorModel, ColorModel.id == shoe_colors_table.c.color_id
            ).where(
                shoe_colors_table.c.shoe_id.in_(shoe_ids)
            )
            colors_result = await db.execute(colors_query)
            all_colors = self._group_by_shoe(colors_result.all(), 'shoe_id', 'name')
            
            # Get all materials
            materials_query = select(
                shoe_materials_table.c.shoe_id,
                MaterialModel.name
            ).join(
                MaterialModel, MaterialModel.id == shoe_materials_table.c.material_id
            ).where(
                shoe_materials_table.c.shoe_id.in_(shoe_ids)
            )
            materials_result = await db.execute(materials_query)
            all_materials = self._group_by_shoe(materials_result.all(), 'shoe_id', 'name')
            
            # Get brand names
            brand_ids = [s.brand_id for s in shoes if s.brand_id]
            brand_names = {}
            if brand_ids:
                brand_query = select(BrandModel.id, BrandModel.name).where(BrandModel.id.in_(brand_ids))
                brand_result = await db.execute(brand_query)
                brand_names = {str(row.id): row.name for row in brand_result.all()}
            
            # Get category names
            category_ids = [s.category_id for s in shoes if s.category_id]
            category_names = {}
            if category_ids:
                category_query = select(CategoryModel.id, CategoryModel.name).where(CategoryModel.id.in_(category_ids))
                category_result = await db.execute(category_query)
                category_names = {str(row.id): row.name for row in category_result.all()}
            
            # Get gender names
            gender_ids = [s.gender_id for s in shoes if s.gender_id]
            gender_names = {}
            if gender_ids:
                gender_query = select(GenderModel.id, GenderModel.name).where(GenderModel.id.in_(gender_ids))
                gender_result = await db.execute(gender_query)
                gender_names = {str(row.id): row.name for row in gender_result.all()}
            
            # Build DTOs
            shoes_dto = []
            for shoe in shoes:
                colors_data = all_colors.get(str(shoe.id), [])
                materials_data = all_materials.get(str(shoe.id), [])
                
                dto = ShoeDetailDTO(
                    id=shoe.id,
                    sku=shoe.sku,
                    name=shoe.name,
                    description=shoe.description,
                    category_id=shoe.category_id,
                    brand_id=shoe.brand_id,
                    gender_id=shoe.gender_id,
                    supplier_id=shoe.supplier_id,
                    location_id=shoe.location_id,
                    season_id=shoe.season_id,
                    image_url=shoe.image_url,
                    stock=getattr(shoe, 'stock', 0),
                    min_stock=shoe.min_stock,
                    price_cost=shoe.price_cost,
                    price_sale=shoe.price_sale,
                    is_active=shoe.is_active,
                    category_name=category_names.get(str(shoe.category_id)) if shoe.category_id else None,
                    brand_name=brand_names.get(str(shoe.brand_id)) if shoe.brand_id else None,
                    gender_name=gender_names.get(str(shoe.gender_id)) if shoe.gender_id else None,
                    supplier_name=None,
                    location_name=None,
                    season_name=None,
                    colors=colors_data,
                    materials=materials_data
                )
                shoes_dto.append(dto)
            
            return ShoeListResponseDTO(
                data=shoes_dto,
                total=total,
                page=filters.page,
                limit=filters.limit
            )
    
    def _group_by_shoe(self, rows, shoe_id_col, value_col):
        """Helper to group results by shoe_id"""
        result = {}
        for row in rows:
            shoe_id = str(getattr(row, shoe_id_col))
            if shoe_id not in result:
                result[shoe_id] = []
            result[shoe_id].append(getattr(row, value_col))
        return result