"""Tests for Code Review Service."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestCodeReviewService:
    """Test suite for Code Review Service."""

    async def test_root_endpoint(self, code_review_client: AsyncClient):
        """Test root endpoint returns service info."""
        response = await code_review_client.get("/")
        assert response.status_code == 200

        data = response.json()
        assert data["service"] == "code-review-service"
        assert data["status"] == "running"

    async def test_health_endpoint(self, code_review_client: AsyncClient):
        """Test health check endpoint."""
        response = await code_review_client.get("/health")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "code-review-service"
