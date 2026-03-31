from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from app.infrastructure.repositories.catalog_repositories import material_repo
from app.application.dto.catalog_dto import MaterialDTO, CreateMaterialDTO, UpdateMaterialDTO

router = APIRouter(prefix="/api/materials", tags=["materials"])


def _to_dto(model) -> dict:
    """Convert model to dict for response"""
    return {
        'id': str(model.id),
        'name': model.name,
        'created_at': model.created_at.isoformat() if model.created_at else None
    }


@router.get("", response_model=List[MaterialDTO])
async def list_materials():
    results = await material_repo.get_all()
    return [_to_dto(r) for r in results]


@router.get("/{material_id}", response_model=MaterialDTO)
async def get_material(material_id: UUID):
    result = await material_repo.get_by_id(material_id)
    if not result:
        raise HTTPException(status_code=404, detail="Material no encontrado")
    return _to_dto(result)


@router.post("", response_model=MaterialDTO, status_code=201)
async def create_material(dto: CreateMaterialDTO):
    data = dto.model_dump()
    result = await material_repo.create(data)
    return _to_dto(result)


@router.put("/{material_id}", response_model=MaterialDTO)
async def update_material(material_id: UUID, dto: UpdateMaterialDTO):
    data = dto.model_dump(exclude_unset=True)
    result = await material_repo.update(material_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Material no encontrado")
    return _to_dto(result)


@router.delete("/{material_id}")
async def delete_material(material_id: UUID):
    success = await material_repo.delete(material_id)
    return {"success": success}
