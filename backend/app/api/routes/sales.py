from fastapi import APIRouter, HTTPException, Query
from app.application.dto.sale_dto import CreateSaleDTO, SaleWithDetailsDTO, SaleListResponseDTO, CreateSaleBatchDTO, SaleBatchResponseDTO, SaleBatchListResponseDTO
from app.application.use_cases.sales.register_sale import RegisterSaleUseCase
from app.application.use_cases.sales.register_sale_batch import RegisterSaleBatchUseCase
from app.application.use_cases.sales.list_sales import ListSalesUseCase
from app.application.use_cases.sales.list_sale_batches import ListSaleBatchesUseCase

router = APIRouter(prefix="/api/sales", tags=["sales"])


@router.get("", response_model=SaleListResponseDTO)
async def list_sales(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Get list of sales with pagination.
    Returns most recent sales first.
    """
    use_case = ListSalesUseCase()
    return await use_case.execute(page=page, limit=limit)


@router.get("/batches", response_model=SaleBatchListResponseDTO)
async def list_sale_batches(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Get list of sale batches (invoices) with pagination.
    Returns most recent batches first.
    """
    use_case = ListSaleBatchesUseCase()
    return await use_case.execute(page=page, limit=limit)


@router.post("/batch", response_model=SaleBatchResponseDTO, status_code=201)
async def register_sale_batch(dto: CreateSaleBatchDTO):
    """
    Register a sale with multiple items (invoice-like).
    
    This endpoint:
    1. Validates all shoe/size combinations exist
    2. Checks sufficient stock for all items
    3. Creates a batch (invoice) and all sale items
    4. Atomically reduces stock for all items
    
    Returns the complete batch with all items.
    """
    use_case = RegisterSaleBatchUseCase()
    try:
        return await use_case.execute(dto)
    except ValueError as e:
        error_msg = str(e)
        if "Insufficient stock" in error_msg:
            raise HTTPException(status_code=400, detail=error_msg)
        elif "not found" in error_msg.lower() or "no encontrada" in error_msg.lower():
            raise HTTPException(status_code=404, detail=error_msg)
        elif "Debe agregar" in error_msg:
            raise HTTPException(status_code=400, detail=error_msg)
        raise HTTPException(status_code=400, detail=error_msg)


@router.post("", response_model=SaleWithDetailsDTO, status_code=201)
async def register_sale(dto: CreateSaleDTO):
    """
    Register a single sale (legacy).
    """
    use_case = RegisterSaleUseCase()
    try:
        return await use_case.execute(dto)
    except ValueError as e:
        error_msg = str(e)
        if "Insufficient stock" in error_msg:
            raise HTTPException(status_code=400, detail=error_msg)
        elif "not found" in error_msg.lower():
            raise HTTPException(status_code=404, detail=error_msg)
        raise HTTPException(status_code=400, detail=error_msg)
