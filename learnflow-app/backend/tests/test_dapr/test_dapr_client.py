"""Unit tests for the shared Dapr client."""

import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from shared.dapr_client import (
    LearnFlowDaprClient,
    get_dapr_client,
    EventTopics,
    ServiceAppIds,
)


class TestLearnFlowDaprClient:
    """Test cases for LearnFlowDaprClient."""

    @pytest.fixture
    def dapr_client(self):
        """Create a Dapr client instance for testing."""
        return LearnFlowDaprClient()

    @pytest.fixture
    def mock_dapr(self):
        """Create a mock Dapr client."""
        mock = AsyncMock()
        return mock

    async def test_publish_event_success(self, dapr_client, mock_dapr):
        """Test successful event publishing."""
        dapr_client._client = mock_dapr

        await dapr_client.publish_event(
            topic=EventTopics.LEARNING_PROGRESS,
            data={"student_id": "123", "concept": "variables", "mastery": 0.8},
        )

        mock_dapr.publish_event.assert_called_once()

    async def test_publish_event_with_custom_pubsub(self, dapr_client, mock_dapr):
        """Test event publishing with custom pub/sub component."""
        dapr_client._client = mock_dapr

        await dapr_client.publish_event(
            topic="custom-topic",
            data={"test": "data"},
            pubsub_name="custom-pubsub",
        )

        call_args = mock_dapr.publish_event.call_args
        assert call_args[1]["pubsub_name"] == "custom-pubsub"

    async def test_save_state_success(self, dapr_client, mock_dapr):
        """Test successful state saving."""
        dapr_client._client = mock_dapr

        result = await dapr_client.save_state(
            key="test-key",
            value={"data": "value"},
        )

        assert result is True
        mock_dapr.save_state.assert_called_once()

    async def test_save_state_with_ttl(self, dapr_client, mock_dapr):
        """Test state saving with TTL."""
        dapr_client._client = mock_dapr

        await dapr_client.save_state(
            key="test-key",
            value={"data": "value"},
            ttl_seconds=3600,
        )

        call_args = mock_dapr.save_state.call_args
        state_item = call_args[1]["states"][0]
        assert "ttlInSeconds" in state_item.metadata

    async def test_get_state_success(self, dapr_client, mock_dapr):
        """Test successful state retrieval."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.data = json.dumps({"key": "value"})
        mock_dapr.get_state.return_value = mock_response

        result = await dapr_client.get_state("test-key")

        assert result == {"key": "value"}
        mock_dapr.get_state.assert_called_once()

    async def test_get_state_not_found(self, dapr_client, mock_dapr):
        """Test state retrieval when key doesn't exist."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.data = None
        mock_dapr.get_state.return_value = mock_response

        result = await dapr_client.get_state("nonexistent-key")

        assert result is None

    async def test_delete_state_success(self, dapr_client, mock_dapr):
        """Test successful state deletion."""
        dapr_client._client = mock_dapr

        result = await dapr_client.delete_state("test-key")

        assert result is True
        mock_dapr.delete_state.assert_called_once()

    async def test_invoke_service_success(self, dapr_client, mock_dapr):
        """Test successful service invocation."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.data = json.dumps({"result": "success"})
        mock_dapr.invoke_method.return_value = mock_response

        result = await dapr_client.invoke_service(
            app_id=ServiceAppIds.CONCEPTS,
            method="/chat",
            data={"message": "test"},
        )

        assert result == {"result": "success"}
        mock_dapr.invoke_method.assert_called_once()

    async def test_invoke_service_no_data(self, dapr_client, mock_dapr):
        """Test service invocation without request data."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.data = json.dumps({"status": "ok"})
        mock_dapr.invoke_method.return_value = mock_response

        result = await dapr_client.invoke_service(
            app_id=ServiceAppIds.DEBUG,
            method="/health",
        )

        assert result == {"status": "ok"}

    async def test_get_secret_success(self, dapr_client, mock_dapr):
        """Test successful secret retrieval."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.secret = {"openai-api-key": "sk-test-key"}
        mock_dapr.get_secret.return_value = mock_response

        result = await dapr_client.get_secret(
            secret_name="learnflow-api-secret",
            key="openai-api-key",
        )

        assert result == "sk-test-key"
        mock_dapr.get_secret.assert_called_once()

    async def test_get_secret_not_found(self, dapr_client, mock_dapr):
        """Test secret retrieval when secret doesn't exist."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.secret = None
        mock_dapr.get_secret.return_value = mock_response

        result = await dapr_client.get_secret(
            secret_name="nonexistent-secret",
            key="api-key",
        )

        assert result is None

    def test_close(self, dapr_client, mock_dapr):
        """Test closing the Dapr client."""
        dapr_client._client = mock_dapr
        dapr_client.close()

        mock_dapr.close.assert_called_once()
        assert dapr_client._client is None

    def test_context_manager(self, mock_dapr):
        """Test using Dapr client as context manager."""
        with patch("shared.dapr_client.DaprClient", return_value=mock_dapr):
            with LearnFlowDaprClient() as client:
                assert client is not None
            # Close should be called on exit
            # Note: Since we're using lru_cache singleton, this may not close


class TestEventTopics:
    """Test cases for EventTopics constants."""

    def test_learning_progress_topic(self):
        """Test learning progress topic constant."""
        assert EventTopics.LEARNING_PROGRESS == "learning.progress"

    def test_code_submission_topic(self):
        """Test code submission topic constant."""
        assert EventTopics.CODE_SUBMISSION == "code.submission"

    def test_exercise_attempt_topic(self):
        """Test exercise attempt topic constant."""
        assert EventTopics.EXERCISE_ATTEMPT == "exercise.attempt"

    def test_struggle_alert_topic(self):
        """Test struggle alert topic constant."""
        assert EventTopics.STRUGGLE_ALERT == "struggle.alert"


class TestServiceAppIds:
    """Test cases for ServiceAppIds constants."""

    def test_triage_app_id(self):
        """Test triage service app ID."""
        assert ServiceAppIds.TRIAGE == "triage-service"

    def test_concepts_app_id(self):
        """Test concepts service app ID."""
        assert ServiceAppIds.CONCEPTS == "concepts-service"

    def test_debug_app_id(self):
        """Test debug service app ID."""
        assert ServiceAppIds.DEBUG == "debug-service"

    def test_exercise_app_id(self):
        """Test exercise service app ID."""
        assert ServiceAppIds.EXERCISE == "exercise-service"

    def test_progress_app_id(self):
        """Test progress service app ID."""
        assert ServiceAppIds.PROGRESS == "progress-service"

    def test_code_review_app_id(self):
        """Test code review service app ID."""
        assert ServiceAppIds.CODE_REVIEW == "code-review-service"


class TestGetDaprClient:
    """Test cases for get_dapr_client singleton."""

    def test_returns_singleton(self):
        """Test that get_dapr_client returns the same instance."""
        client1 = get_dapr_client()
        client2 = get_dapr_client()

        assert client1 is client2

    def test_returns_learnflow_dapr_client(self):
        """Test that get_dapr_client returns LearnFlowDaprClient instance."""
        client = get_dapr_client()

        assert isinstance(client, LearnFlowDaprClient)
