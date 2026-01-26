"""Tests for Exercise Service."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestExerciseService:
    """Test suite for Exercise Service."""

    async def test_root_endpoint(self, exercise_client: AsyncClient):
        """Test root endpoint returns service info."""
        response = await exercise_client.get("/")
        assert response.status_code == 200

        data = response.json()
        assert data["service"] == "exercise-service"
        assert data["status"] == "running"

    async def test_health_endpoint(self, exercise_client: AsyncClient):
        """Test health check endpoint."""
        response = await exercise_client.get("/health")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "exercise-service"
