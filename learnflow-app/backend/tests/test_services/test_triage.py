"""Tests for Triage Service."""

import pytest
from httpx import AsyncClient
from uuid import uuid4


@pytest.mark.asyncio
class TestTriageService:
    """Test suite for Triage Service."""

    async def test_root_endpoint(self, triage_client: AsyncClient):
        """Test root endpoint returns service info."""
        response = await triage_client.get("/")
        assert response.status_code == 200

        data = response.json()
        assert data["service"] == "triage-service"
        assert data["status"] == "running"
        assert "endpoints" in data

    async def test_health_endpoint(self, triage_client: AsyncClient):
        """Test health check endpoint."""
        response = await triage_client.get("/health")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "triage-service"
        assert "version" in data

    async def test_triage_concept_query(self, triage_client: AsyncClient, sample_student_id: str):
        """Test triage routes concept queries correctly."""
        response = await triage_client.post(
            "/triage",
            json={
                "student_id": sample_student_id,
                "message": "What is a variable in Python?"
            }
        )
        assert response.status_code == 200

        data = response.json()
        assert data["agent_type"] == "concepts"
        assert data["confidence"] > 0

    async def test_triage_debug_query(self, triage_client: AsyncClient, sample_student_id: str):
        """Test triage routes debug queries correctly."""
        response = await triage_client.post(
            "/triage",
            json={
                "student_id": sample_student_id,
                "message": "I have an error in my code: NameError"
            }
        )
        assert response.status_code == 200

        data = response.json()
        assert data["agent_type"] == "debug"
        assert data["confidence"] > 0

    async def test_triage_exercise_query(self, triage_client: AsyncClient, sample_student_id: str):
        """Test triage routes exercise queries correctly."""
        response = await triage_client.post(
            "/triage",
            json={
                "student_id": sample_student_id,
                "message": "Give me a new exercise"
            }
        )
        assert response.status_code == 200

        data = response.json()
        assert data["agent_type"] == "exercise"
        assert data["confidence"] > 0

    async def test_triage_progress_query(self, triage_client: AsyncClient, sample_student_id: str):
        """Test triage routes progress queries correctly."""
        response = await triage_client.post(
            "/triage",
            json={
                "student_id": sample_student_id,
                "message": "How am I doing in my learning?"
            }
        )
        assert response.status_code == 200

        data = response.json()
        assert data["agent_type"] == "progress"
        assert data["confidence"] > 0

    async def test_triage_code_review_query(self, triage_client: AsyncClient, sample_student_id: str):
        """Test triage routes code review queries correctly."""
        response = await triage_client.post(
            "/triage",
            json={
                "student_id": sample_student_id,
                "message": "Can you review my code and suggest improvements?"
            }
        )
        assert response.status_code == 200

        data = response.json()
        assert data["agent_type"] == "code_review"
        assert data["confidence"] > 0

    async def test_chat_endpoint(self, triage_client: AsyncClient, sample_student_id: str):
        """Test chat endpoint processes messages."""
        response = await triage_client.post(
            "/chat",
            json={
                "student_id": sample_student_id,
                "message": "Explain how functions work"
            }
        )
        assert response.status_code == 200

        data = response.json()
        assert "triage" in data
        assert "message" in data

    async def test_invalid_request_missing_field(self, triage_client: AsyncClient):
        """Test triage handles missing required fields."""
        response = await triage_client.post(
            "/triage",
            json={"message": "test"}
        )
        assert response.status_code == 422  # Validation error
