from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from app.infrastructure.repositories.catalog_repositories import size_repo
from app.application.dto.catalog_dto import SizeDTO, CreateSizeDTO, UpdateSizeDTO

router = APIRouter(prefix="/api/sizes", tags=["sizes"])


def _to_dto(model) -> dict:
    """Convert model to dict for response"""
    return {
        'id': str(model.id),
        'number': model.number,
        'created_at': model.created_at.isoformat() if model.created_at else None
    }


@router.get("", response_model=List[SizeDTO])
async def list_sizes():
    results = await size_repo.get_all()
    return [_to_dto(r) for r in results]


@router.get("/{size_id}", response_model=SizeDTO)
async def get_size(size_id: UUID):
    result = await size_repo.get_by_id(size_id)
    if not result:
        raise HTTPException(status_code=404, detail="Talla no encontrada")
    return _to_dto(result)


@router.post("", response_model=SizeDTO, status_code=201)
async def create_size(dto: CreateSizeDTO):
    data = dto.model_dump()
    result = await size_repo.create(data)
    return _to_dto(result)


@router.put("/{size_id}", response_model=SizeDTO)
async def update_size(size_id: UUID, dto: UpdateSizeDTO):
    data = dto.model_dump(exclude_unset=True)
    result = await size_repo.update(size_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Talla no encontrada")
    return _to_dto(result)


@router.delete("/{size_id}")
async def delete_size(size_id: UUID):
    success = await size_repo.delete(size_id)
    return {"success": success}
