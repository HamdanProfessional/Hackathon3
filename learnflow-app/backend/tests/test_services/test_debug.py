"""Tests for Debug Service."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestDebugService:
    """Test suite for Debug Service."""

    async def test_root_endpoint(self, debug_client: AsyncClient):
        """Test root endpoint returns service info."""
        response = await debug_client.get("/")
        assert response.status_code == 200

        data = response.json()
        assert data["service"] == "debug-service"
        assert data["status"] == "running"

    async def test_health_endpoint(self, debug_client: AsyncClient):
        """Test health check endpoint."""
        response = await debug_client.get("/health")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "debug-service"
