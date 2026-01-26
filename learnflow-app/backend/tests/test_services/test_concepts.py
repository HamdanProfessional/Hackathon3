"""Tests for Concepts Service."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestConceptsService:
    """Test suite for Concepts Service."""

    async def test_root_endpoint(self, concepts_client: AsyncClient):
        """Test root endpoint returns service info."""
        response = await concepts_client.get("/")
        assert response.status_code == 200

        data = response.json()
        assert data["service"] == "concepts-service"
        assert data["status"] == "running"

    async def test_health_endpoint(self, concepts_client: AsyncClient):
        """Test health check endpoint."""
        response = await concepts_client.get("/health")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "concepts-service"
