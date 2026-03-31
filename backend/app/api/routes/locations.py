from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from app.infrastructure.repositories.catalog_repositories import location_repo
from app.application.dto.catalog_dto import LocationDTO, CreateLocationDTO, UpdateLocationDTO

router = APIRouter(prefix="/api/locations", tags=["locations"])


def _to_dto(model) -> dict:
    """Convert model to dict for response"""
    return {
        'id': str(model.id),
        'name': model.name,
        'description': model.description,
        'created_at': model.created_at.isoformat() if model.created_at else None
    }


@router.get("", response_model=List[LocationDTO])
async def list_locations():
    results = await location_repo.get_all()
    return [_to_dto(r) for r in results]


@router.get("/{location_id}", response_model=LocationDTO)
async def get_location(location_id: UUID):
    result = await location_repo.get_by_id(location_id)
    if not result:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    return _to_dto(result)


@router.post("", response_model=LocationDTO, status_code=201)
async def create_location(dto: CreateLocationDTO):
    data = dto.model_dump()
    result = await location_repo.create(data)
    return _to_dto(result)


@router.put("/{location_id}", response_model=LocationDTO)
async def update_location(location_id: UUID, dto: UpdateLocationDTO):
    data = dto.model_dump(exclude_unset=True)
    result = await location_repo.update(location_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    return _to_dto(result)


@router.delete("/{location_id}")
async def delete_location(location_id: UUID):
    success = await location_repo.delete(location_id)
    return {"success": success}
