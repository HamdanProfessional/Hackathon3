"""Tests for Progress Service."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestProgressService:
    """Test suite for Progress Service."""

    async def test_root_endpoint(self, progress_client: AsyncClient):
        """Test root endpoint returns service info."""
        response = await progress_client.get("/")
        assert response.status_code == 200

        data = response.json()
        assert data["service"] == "progress-service"
        assert data["status"] == "running"

    async def test_health_endpoint(self, progress_client: AsyncClient):
        """Test health check endpoint."""
        response = await progress_client.get("/health")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "progress-service"
