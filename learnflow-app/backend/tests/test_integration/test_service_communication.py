"""Integration tests for service communication via Dapr.

These tests verify that services can:
1. Communicate via Dapr service invocation
2. Publish events to Kafka via Dapr pub/sub
3. Store and retrieve state via Dapr state store
"""

import json
from uuid import uuid4
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import AsyncClient

from shared.dapr_client import (
    LearnFlowDaprClient,
    EventTopics,
    ServiceAppIds,
)


@pytest.mark.integration
class TestServiceInvocation:
    """Test cases for service-to-service communication via Dapr."""

    @pytest.fixture
    def dapr_client(self):
        """Create a Dapr client for testing."""
        return LearnFlowDaprClient()

    @pytest.fixture
    def mock_dapr(self):
        """Create a mock Dapr client."""
        mock = AsyncMock()
        return mock

    async def test_triage_to_concepts_service_invocation(self, dapr_client, mock_dapr):
        """Test that triage service can invoke concepts service."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.data = json.dumps({
            "response": "A variable is a labeled box...",
            "agent_type": "concepts",
            "confidence": 0.9,
        })
        mock_dapr.invoke_method.return_value = mock_response

        result = await dapr_client.invoke_service(
            app_id=ServiceAppIds.CONCEPTS,
            method="/chat",
            data={
                "student_id": str(uuid4()),
                "message": "What is a variable?",
                "topic": None,
                "conversation_history": [],
            },
        )

        assert result is not None
        assert result["agent_type"] == "concepts"
        assert "variable" in result["response"].lower()

    async def test_triage_to_debug_service_invocation(self, dapr_client, mock_dapr):
        """Test that triage service can invoke debug service."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.data = json.dumps({
            "response": "I found some issues...",
            "agent_type": "debug",
            "hints": ["Check for missing colons"],
        })
        mock_dapr.invoke_method.return_value = mock_response

        result = await dapr_client.invoke_service(
            app_id=ServiceAppIds.DEBUG,
            method="/chat",
            data={
                "student_id": str(uuid4()),
                "message": "I have a syntax error",
                "topic": None,
                "conversation_history": [],
            },
        )

        assert result is not None
        assert result["agent_type"] == "debug"

    async def test_triage_to_exercise_service_invocation(self, dapr_client, mock_dapr):
        """Test that triage service can invoke exercise service."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.data = json.dumps({
            "response": "I can help with exercises",
            "agent_type": "exercise",
        })
        mock_dapr.invoke_method.return_value = mock_response

        result = await dapr_client.invoke_service(
            app_id=ServiceAppIds.EXERCISE,
            method="/chat",
            data={
                "student_id": str(uuid4()),
                "message": "Give me an exercise",
                "topic": None,
                "conversation_history": [],
            },
        )

        assert result is not None
        assert result["agent_type"] == "exercise"

    async def test_triage_to_progress_service_invocation(self, dapr_client, mock_dapr):
        """Test that triage service can invoke progress service."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.data = json.dumps({
            "response": "Your Progress: Overall Mastery: 25.0%",
            "agent_type": "progress",
        })
        mock_dapr.invoke_method.return_value = mock_response

        result = await dapr_client.invoke_service(
            app_id=ServiceAppIds.PROGRESS,
            method="/chat",
            data={
                "student_id": str(uuid4()),
                "message": "How am I doing?",
                "topic": None,
                "conversation_history": [],
            },
        )

        assert result is not None
        assert result["agent_type"] == "progress"

    async def test_triage_to_code_review_service_invocation(self, dapr_client, mock_dapr):
        """Test that triage service can invoke code review service."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.data = json.dumps({
            "response": "Code Review (Score: 85/100)",
            "agent_type": "code_review",
        })
        mock_dapr.invoke_method.return_value = mock_response

        result = await dapr_client.invoke_service(
            app_id=ServiceAppIds.CODE_REVIEW,
            method="/chat",
            data={
                "student_id": str(uuid4()),
                "message": "Review this code",
                "topic": None,
                "conversation_history": [],
            },
        )

        assert result is not None
        assert result["agent_type"] == "code_review"


@pytest.mark.integration
class TestEventPublishing:
    """Test cases for event publishing to Kafka via Dapr."""

    @pytest.fixture
    def dapr_client(self):
        """Create a Dapr client for testing."""
        return LearnFlowDaprClient()

    @pytest.fixture
    def mock_dapr(self):
        """Create a mock Dapr client."""
        mock = AsyncMock()
        return mock

    async def test_concepts_publishes_learning_progress(self, dapr_client, mock_dapr):
        """Test that concepts service publishes learning progress events."""
        dapr_client._client = mock_dapr

        success = await dapr_client.publish_event(
            topic=EventTopics.LEARNING_PROGRESS,
            data={
                "student_id": str(uuid4()),
                "event_type": "concept_learned",
                "concept": "variable",
                "mastery_level": "learning",
            },
        )

        assert success is True
        mock_dapr.publish_event.assert_called_once()

        call_args = mock_dapr.publish_event.call_args
        assert call_args[1]["pubsub_name"] == "learnflow-pubsub"
        assert call_args[1]["topic_name"] == EventTopics.LEARNING_PROGRESS

    async def test_exercise_publishes_exercise_attempt(self, dapr_client, mock_dapr):
        """Test that exercise service publishes exercise attempt events."""
        dapr_client._client = mock_dapr

        success = await dapr_client.publish_event(
            topic=EventTopics.EXERCISE_ATTEMPT,
            data={
                "student_id": str(uuid4()),
                "exercise_id": 1,
                "passed": True,
                "module_id": 1,
                "topic": "basics",
                "difficulty": "beginner",
            },
        )

        assert success is True
        mock_dapr.publish_event.assert_called_once()

    async def test_debug_publishes_struggle_alert(self, dapr_client, mock_dapr):
        """Test that debug service publishes struggle alerts."""
        dapr_client._client = mock_dapr

        success = await dapr_client.publish_event(
            topic=EventTopics.STRUGGLE_ALERT,
            data={
                "student_id": str(uuid4()),
                "alert_type": "repeated_error",
                "category": "syntax",
                "error_count": 3,
                "message": "Student has encountered syntax errors 3 times",
            },
        )

        assert success is True
        mock_dapr.publish_event.assert_called_once()

    async def test_code_review_publishes_code_submission(self, dapr_client, mock_dapr):
        """Test that code review service publishes code submission events."""
        dapr_client._client = mock_dapr

        success = await dapr_client.publish_event(
            topic=EventTopics.CODE_SUBMISSION,
            data={
                "student_id": str(uuid4()),
                "exercise_id": 1,
                "language": "python",
                "correct": True,
                "quality_score": 85.0,
                "style_issues_count": 1,
                "efficiency_notes_count": 0,
            },
        )

        assert success is True
        mock_dapr.publish_event.assert_called_once()


@pytest.mark.integration
class TestStateManagement:
    """Test cases for state management via Dapr."""

    @pytest.fixture
    def dapr_client(self):
        """Create a Dapr client for testing."""
        return LearnFlowDaprClient()

    @pytest.fixture
    def mock_dapr(self):
        """Create a mock Dapr client."""
        mock = AsyncMock()
        return mock

    async def test_debug_saves_error_state(self, dapr_client, mock_dapr):
        """Test that debug service saves error state."""
        dapr_client._client = mock_dapr

        student_id = str(uuid4())
        error_key = f"error:{student_id}:syntax"

        success = await dapr_client.save_state(
            key=error_key,
            value={
                "count": 3,
                "category": "syntax",
                "last_code": "print('hello",
            },
            ttl_seconds=86400,
        )

        assert success is True
        mock_dapr.save_state.assert_called_once()

    async def test_debug_retrieves_error_state(self, dapr_client, mock_dapr):
        """Test that debug service retrieves error state."""
        dapr_client._client = mock_dapr
        mock_response = MagicMock()
        mock_response.data = json.dumps({
            "count": 3,
            "category": "syntax",
            "last_code": "print('hello",
        })
        mock_dapr.get_state.return_value = mock_response

        student_id = str(uuid4())
        error_key = f"error:{student_id}:syntax"

        result = await dapr_client.get_state(error_key)

        assert result is not None
        assert result["count"] == 3
        assert result["category"] == "syntax"

    async def test_progress_state_updates(self, dapr_client, mock_dapr):
        """Test that progress service can update state."""
        dapr_client._client = mock_dapr

        student_id = str(uuid4())
        progress_key = f"progress:{student_id}:1"

        # Save initial progress
        await dapr_client.save_state(
            key=progress_key,
            value={"mastery_score": 25.0, "exercises_completed": 3},
        )

        # Update progress
        mock_response = MagicMock()
        mock_response.data = json.dumps({"mastery_score": 30.0, "exercises_completed": 4})
        mock_dapr.get_state.return_value = mock_response

        updated = await dapr_client.get_state(progress_key)

        assert updated is not None
        assert updated["mastery_score"] == 30.0


@pytest.mark.integration
class TestEndToEndFlow:
    """Test cases for complete end-to-end flows."""

    @pytest.fixture
    def dapr_client(self):
        """Create a Dapr client for testing."""
        return LearnFlowDaprClient()

    @pytest.fixture
    def mock_dapr(self):
        """Create a mock Dapr client."""
        mock = AsyncMock()
        return mock

    async def test_complete_student_learning_flow(self, dapr_client, mock_dapr):
        """Test complete flow: Query → Triage → Concepts → Event → Progress.

        Flow:
        1. Student asks: "What is a variable?"
        2. Triage routes to concepts service
        3. Concepts explains and publishes learning.progress event
        4. Progress receives event and updates mastery
        """
        dapr_client._client = mock_dapr
        student_id = str(uuid4())

        # Step 1 & 2: Triage invokes concepts
        concepts_response = MagicMock()
        concepts_response.data = json.dumps({
            "response": "A variable is a labeled box...",
            "agent_type": "concepts",
            "confidence": 0.9,
        })
        mock_dapr.invoke_method.return_value = concepts_response

        result = await dapr_client.invoke_service(
            app_id=ServiceAppIds.CONCEPTS,
            method="/chat",
            data={
                "student_id": student_id,
                "message": "What is a variable?",
                "topic": None,
                "conversation_history": [],
            },
        )

        assert result is not None
        assert result["agent_type"] == "concepts"

        # Step 3: Concepts publishes event
        mock_dapr.publish_event.return_value = None
        await dapr_client.publish_event(
            topic=EventTopics.LEARNING_PROGRESS,
            data={
                "student_id": student_id,
                "event_type": "concept_learned",
                "concept": "variable",
                "mastery_level": "learning",
            },
        )

        # Step 4: Progress updates (simulated)
        mock_response = MagicMock()
        mock_response.data = json.dumps({
            "mastery_score": 27.0,
            "exercises_completed": 3,
            "streak_days": 1,
        })
        mock_dapr.get_state.return_value = mock_response

        progress = await dapr_client.get_state(f"progress:{student_id}:1")
        assert progress is not None
        assert progress["mastery_score"] == 27.0

    async def test_exercise_submission_flow(self, dapr_client, mock_dapr):
        """Test complete flow: Exercise → Event → Progress.

        Flow:
        1. Student submits exercise
        2. Exercise service grades and publishes exercise.attempt event
        3. Progress receives event and updates mastery
        """
        dapr_client._client = mock_dapr
        student_id = str(uuid4())

        # Step 1 & 2: Exercise submission and event
        mock_dapr.publish_event.return_value = None
        await dapr_client.publish_event(
            topic=EventTopics.EXERCISE_ATTEMPT,
            data={
                "student_id": student_id,
                "exercise_id": 1,
                "passed": True,
                "module_id": 1,
                "topic": "basics",
                "difficulty": "beginner",
            },
        )

        # Step 3: Progress updates (simulated)
        mock_response = MagicMock()
        mock_response.data = json.dumps({
            "mastery_score": 30.0,
            "exercises_completed": 4,
        })
        mock_dapr.get_state.return_value = mock_response

        progress = await dapr_client.get_state(f"progress:{student_id}:1")
        assert progress is not None
        assert progress["exercises_completed"] == 4

    async def test_struggle_detection_flow(self, dapr_client, mock_dapr):
        """Test complete flow: Repeated errors → Alert.

        Flow:
        1. Student encounters same error 3 times
        2. Debug service tracks errors in state
        3. After 3rd error, publishes struggle.alert event
        """
        dapr_client._client = mock_dapr
        student_id = str(uuid4())

        # Track 3 errors
        mock_response = MagicMock()
        mock_dapr.get_state.return_value = mock_response
        mock_dapr.publish_event.return_value = None

        for i in range(1, 4):
            # Get existing state
            if i == 1:
                mock_response.data = None  # First error
            else:
                mock_response.data = json.dumps({"count": i - 1, "category": "syntax"})

            # Save updated state
            await dapr_client.save_state(
                key=f"error:{student_id}:syntax",
                value={"count": i, "category": "syntax", "last_code": "print('hello"},
            )

        # After 3rd error, publish alert
        await dapr_client.publish_event(
            topic=EventTopics.STRUGGLE_ALERT,
            data={
                "student_id": student_id,
                "alert_type": "repeated_error",
                "category": "syntax",
                "error_count": 3,
                "message": "Student has encountered syntax errors 3 times",
            },
        )

        # Verify alert was published
        assert mock_dapr.publish_event.call_count >= 1
