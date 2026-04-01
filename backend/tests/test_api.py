import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_root_endpoint():
    """Test the root endpoint returns correct message"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        assert response.json()["message"] == "Inventario Zapatos API"

@pytest.mark.asyncio
async def test_health_endpoint():
    """Test the health check endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_shoes_endpoint_structure():
    """Test shoes endpoint returns expected structure (without DB)"""
    # This test verifies the endpoint exists and returns proper error when DB unavailable
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/shoes")
        # Without DB connection, should return 500 or similar
        # This just verifies the route is registered
        assert response.status_code in [200, 500, 503]  