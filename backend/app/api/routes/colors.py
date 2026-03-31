from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from app.infrastructure.repositories.catalog_repositories import color_repo
from app.application.dto.catalog_dto import ColorDTO, CreateColorDTO, UpdateColorDTO

router = APIRouter(prefix="/api/colors", tags=["colors"])


def _to_dto(model) -> dict:
    """Convert model to dict for response"""
    return {
        'id': str(model.id),
        'name': model.name,
        'hex_code': model.hex_code,
        'created_at': model.created_at.isoformat() if model.created_at else None
    }


@router.get("", response_model=List[ColorDTO])
async def list_colors():
    results = await color_repo.get_all()
    return [_to_dto(r) for r in results]


@router.get("/{color_id}", response_model=ColorDTO)
async def get_color(color_id: UUID):
    result = await color_repo.get_by_id(color_id)
    if not result:
        raise HTTPException(status_code=404, detail="Color no encontrado")
    return _to_dto(result)


@router.post("", response_model=ColorDTO, status_code=201)
async def create_color(dto: CreateColorDTO):
    data = dto.model_dump()
    result = await color_repo.create(data)
    return _to_dto(result)


@router.put("/{color_id}", response_model=ColorDTO)
async def update_color(color_id: UUID, dto: UpdateColorDTO):
    data = dto.model_dump(exclude_unset=True)
    result = await color_repo.update(color_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Color no encontrado")
    return _to_dto(result)


@router.delete("/{color_id}")
async def delete_color(color_id: UUID):
    success = await color_repo.delete(color_id)
    return {"success": success}
