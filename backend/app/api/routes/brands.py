from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from app.infrastructure.repositories.catalog_repositories import brand_repo
from app.application.dto.catalog_dto import BrandDTO, CreateBrandDTO, UpdateBrandDTO

router = APIRouter(prefix="/api/brands", tags=["brands"])


def _to_dto(model) -> dict:
    """Convert model to dict for response"""
    return {
        'id': str(model.id),
        'name': model.name,
        'logo_url': model.logo_url,
        'created_at': model.created_at.isoformat() if model.created_at else None
    }


@router.get("", response_model=List[BrandDTO])
async def list_brands():
    results = await brand_repo.get_all()
    return [_to_dto(r) for r in results]


@router.get("/{brand_id}", response_model=BrandDTO)
async def get_brand(brand_id: UUID):
    result = await brand_repo.get_by_id(brand_id)
    if not result:
        raise HTTPException(status_code=404, detail="Marca no encontrada")
    return _to_dto(result)


@router.post("", response_model=BrandDTO, status_code=201)
async def create_brand(dto: CreateBrandDTO):
    data = dto.model_dump()
    result = await brand_repo.create(data)
    return _to_dto(result)


@router.put("/{brand_id}", response_model=BrandDTO)
async def update_brand(brand_id: UUID, dto: UpdateBrandDTO):
    data = dto.model_dump(exclude_unset=True)
    result = await brand_repo.update(brand_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Marca no encontrada")
    return _to_dto(result)


@router.delete("/{brand_id}")
async def delete_brand(brand_id: UUID):
    success = await brand_repo.delete(brand_id)
    return {"success": success}
