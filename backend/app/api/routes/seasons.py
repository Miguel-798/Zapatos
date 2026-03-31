from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from app.infrastructure.repositories.catalog_repositories import season_repo
from app.application.dto.catalog_dto import SeasonDTO, CreateSeasonDTO, UpdateSeasonDTO

router = APIRouter(prefix="/api/seasons", tags=["seasons"])


def _to_dto(model) -> dict:
    """Convert model to dict for response"""
    return {
        'id': str(model.id),
        'name': model.name,
        'created_at': model.created_at.isoformat() if model.created_at else None
    }


@router.get("", response_model=List[SeasonDTO])
async def list_seasons():
    results = await season_repo.get_all()
    return [_to_dto(r) for r in results]


@router.get("/{season_id}", response_model=SeasonDTO)
async def get_season(season_id: UUID):
    result = await season_repo.get_by_id(season_id)
    if not result:
        raise HTTPException(status_code=404, detail="Temporada no encontrada")
    return _to_dto(result)


@router.post("", response_model=SeasonDTO, status_code=201)
async def create_season(dto: CreateSeasonDTO):
    data = dto.model_dump()
    result = await season_repo.create(data)
    return _to_dto(result)


@router.put("/{season_id}", response_model=SeasonDTO)
async def update_season(season_id: UUID, dto: UpdateSeasonDTO):
    data = dto.model_dump(exclude_unset=True)
    result = await season_repo.update(season_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Temporada no encontrada")
    return _to_dto(result)


@router.delete("/{season_id}")
async def delete_season(season_id: UUID):
    success = await season_repo.delete(season_id)
    return {"success": success}
