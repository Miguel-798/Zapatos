from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from app.infrastructure.repositories.catalog_repositories import supplier_repo
from app.application.dto.catalog_dto import SupplierDTO, CreateSupplierDTO, UpdateSupplierDTO

router = APIRouter(prefix="/api/suppliers", tags=["suppliers"])


def _to_dto(model) -> dict:
    """Convert model to dict for response"""
    return {
        'id': str(model.id),
        'name': model.name,
        'contact_name': model.contact_name,
        'email': model.email,
        'phone': model.phone,
        'created_at': model.created_at.isoformat() if model.created_at else None
    }


@router.get("", response_model=List[SupplierDTO])
async def list_suppliers():
    results = await supplier_repo.get_all()
    return [_to_dto(r) for r in results]


@router.get("/{supplier_id}", response_model=SupplierDTO)
async def get_supplier(supplier_id: UUID):
    result = await supplier_repo.get_by_id(supplier_id)
    if not result:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return _to_dto(result)


@router.post("", response_model=SupplierDTO, status_code=201)
async def create_supplier(dto: CreateSupplierDTO):
    data = dto.model_dump()
    result = await supplier_repo.create(data)
    return _to_dto(result)


@router.put("/{supplier_id}", response_model=SupplierDTO)
async def update_supplier(supplier_id: UUID, dto: UpdateSupplierDTO):
    data = dto.model_dump(exclude_unset=True)
    result = await supplier_repo.update(supplier_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return _to_dto(result)


@router.delete("/{supplier_id}")
async def delete_supplier(supplier_id: UUID):
    success = await supplier_repo.delete(supplier_id)
    return {"success": success}
