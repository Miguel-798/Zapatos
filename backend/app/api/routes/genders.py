from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from app.infrastructure.repositories.catalog_repositories import gender_repo
from app.application.dto.catalog_dto import GenderDTO, CreateGenderDTO, UpdateGenderDTO

router = APIRouter(prefix="/api/genders", tags=["genders"])


def _to_dto(model) -> dict:
    """Convert model to dict for response"""
    return {
        'id': str(model.id),
        'name': model.name,
        'created_at': model.created_at.isoformat() if model.created_at else None
    }


@router.get("", response_model=List[GenderDTO])
async def list_genders():
    results = await gender_repo.get_all()
    return [_to_dto(r) for r in results]


@router.get("/{gender_id}", response_model=GenderDTO)
async def get_gender(gender_id: UUID):
    result = await gender_repo.get_by_id(gender_id)
    if not result:
        raise HTTPException(status_code=404, detail="Género no encontrado")
    return _to_dto(result)


@router.post("", response_model=GenderDTO, status_code=201)
async def create_gender(dto: CreateGenderDTO):
    data = dto.model_dump()
    result = await gender_repo.create(data)
    return _to_dto(result)


@router.put("/{gender_id}", response_model=GenderDTO)
async def update_gender(gender_id: UUID, dto: UpdateGenderDTO):
    data = dto.model_dump(exclude_unset=True)
    result = await gender_repo.update(gender_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Género no encontrado")
    return _to_dto(result)


@router.delete("/{gender_id}")
async def delete_gender(gender_id: UUID):
    success = await gender_repo.delete(gender_id)
    return {"success": success}
