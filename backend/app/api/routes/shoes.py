from fastapi import APIRouter, HTTPException, Query
from uuid import UUID
from typing import Optional
from app.application.dto.shoe_dto import (
    CreateShoeDTO, UpdateShoeDTO, ShoeDetailDTO, 
    ShoeListResponseDTO, ShoeFiltersDTO
)
from app.application.use_cases.shoes.create_shoe import CreateShoeUseCase
from app.application.use_cases.shoes.list_shoes import ListShoesUseCase
from app.application.use_cases.shoes.get_shoe import GetShoeUseCase
from app.application.use_cases.shoes.update_shoe import UpdateShoeUseCase
from app.application.use_cases.shoes.delete_shoe import DeleteShoeUseCase
from app.infrastructure.repositories.supabase_shoe_repository import SupabaseShoeRepository

router = APIRouter(prefix="/api/shoes", tags=["shoes"])

# Instancias de repositorio y use cases
shoe_repo = SupabaseShoeRepository()


@router.get("", response_model=ShoeListResponseDTO)
async def list_shoes(
    category_id: Optional[UUID] = None,
    brand_id: Optional[UUID] = None,
    gender_id: Optional[UUID] = None,
    size_id: Optional[UUID] = None,
    color_id: Optional[UUID] = None,
    material_id: Optional[UUID] = None,
    supplier_id: Optional[UUID] = None,
    location_id: Optional[UUID] = None,
    season_id: Optional[UUID] = None,
    search: Optional[str] = None,
    low_stock: bool = False,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    filters = ShoeFiltersDTO(
        category_id=category_id,
        brand_id=brand_id,
        gender_id=gender_id,
        size_id=size_id,
        color_id=color_id,
        material_id=material_id,
        supplier_id=supplier_id,
        location_id=location_id,
        season_id=season_id,
        search=search,
        low_stock=low_stock,
        page=page,
        limit=limit
    )
    use_case = ListShoesUseCase(shoe_repo)
    return await use_case.execute(filters)


@router.get("/{shoe_id}", response_model=ShoeDetailDTO)
async def get_shoe(shoe_id: UUID):
    use_case = GetShoeUseCase(shoe_repo)
    try:
        return await use_case.execute(shoe_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("", response_model=ShoeDetailDTO, status_code=201)
async def create_shoe(dto: CreateShoeDTO):
    use_case = CreateShoeUseCase(shoe_repo)
    try:
        return await use_case.execute(dto)
    except ValueError as e:
        error_msg = str(e)
        # Check if it's a validation error
        if "formato" in error_msg.lower() or "sku" in error_msg.lower():
            raise HTTPException(status_code=400, detail=error_msg)
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{shoe_id}", response_model=ShoeDetailDTO)
async def update_shoe(shoe_id: UUID, dto: UpdateShoeDTO):
    use_case = UpdateShoeUseCase(shoe_repo)
    try:
        return await use_case.execute(shoe_id, dto)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{shoe_id}")
async def delete_shoe(shoe_id: UUID):
    use_case = DeleteShoeUseCase(shoe_repo)
    try:
        await use_case.execute(shoe_id)
        return {"success": True, "message": "Zapato eliminado correctamente"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
