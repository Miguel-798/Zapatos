import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch
from app.main import app

# Mock database for tests
@pytest.fixture
def mock_db():
    """Mock database session"""
    mock = AsyncMock()
    return mock

@pytest.fixture
def sample_shoes():
    """Sample shoe data for tests"""
    return [
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "name": "Zapato Prueba",
            "sku": "TEST-001",
            "price_sale": 150000.00,
            "price_cost": 80000.00,
            "is_active": True,
            "category_id": "123e4567-e89b-12d3-a456-426614174001",
            "brand_id": "123e4567-e89b-12d3-a456-426614174002",
            "gender_id": "123e4567-e89b-12d3-a456-426614174003",
            "colors": [],
            "materials": [],
            "sizes": []
        }
    ]

@pytest.fixture
def sample_categories():
    """Sample category data"""
    return [
        {"id": "123e4567-e89b-12d3-a456-426614174001", "name": "Botas"},
        {"id": "123e4567-e89b-12d3-a456-426614174002", "name": "Zapatillas"},
    ]

@pytest.fixture
async def client():
    """Async HTTP client for API testing"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac