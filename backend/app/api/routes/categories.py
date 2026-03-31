from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from app.infrastructure.repositories.catalog_repositories import category_repo
from app.application.dto.catalog_dto import CategoryDTO, CreateCategoryDTO, UpdateCategoryDTO

router = APIRouter(prefix="/api/categories", tags=["categories"])


def _to_dto(model) -> dict:
    """Convert model to dict for response"""
    return {
        'id': str(model.id),
        'name': model.name,
        'description': model.description,
        'created_at': model.created_at.isoformat() if model.created_at else None
    }


@router.get("", response_model=List[CategoryDTO])
async def list_categories():
    results = await category_repo.get_all()
    return [_to_dto(r) for r in results]


@router.get("/{category_id}", response_model=CategoryDTO)
async def get_category(category_id: UUID):
    result = await category_repo.get_by_id(category_id)
    if not result:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return _to_dto(result)


@router.post("", response_model=CategoryDTO, status_code=201)
async def create_category(dto: CreateCategoryDTO):
    data = dto.model_dump()
    result = await category_repo.create(data)
    return _to_dto(result)


@router.put("/{category_id}", response_model=CategoryDTO)
async def update_category(category_id: UUID, dto: UpdateCategoryDTO):
    data = dto.model_dump(exclude_unset=True)
    result = await category_repo.update(category_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return _to_dto(result)


@router.delete("/{category_id}")
async def delete_category(category_id: UUID):
    success = await category_repo.delete(category_id)
    return {"success": success}
