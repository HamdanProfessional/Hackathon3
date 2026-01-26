"""Tests for shared data models."""

import pytest
from datetime import datetime
from uuid import uuid4
from pydantic import ValidationError

from shared.models import (
    Role,
    MasteryLevel,
    MessageType,
    HealthResponse,
    ChatMessage,
    ChatRequest,
    ChatResponse,
    CodeSubmission,
    CodeReviewResult,
    ExerciseRequest,
    Exercise,
    ExerciseSubmission,
    ExerciseResult,
    ProgressData,
    StruggleAlert,
    ConceptExplanation,
    TriageResult,
    User,
    UserCreate,
    UserResponse,
    TokenResponse,
    Module,
    ModuleProgress,
)


class TestRoleEnum:
    """Test Role enum."""

    def test_role_values(self):
        """Test role enum has correct values."""
        assert Role.STUDENT == "student"
        assert Role.TEACHER == "teacher"


class TestMasteryLevelEnum:
    """Test MasteryLevel enum."""

    def test_mastery_levels(self):
        """Test mastery level enum has correct values."""
        assert MasteryLevel.BEGINNER == "beginner"
        assert MasteryLevel.LEARNING == "learning"
        assert MasteryLevel.PROFICIENT == "proficient"
        assert MasteryLevel.MASTERED == "mastered"


class TestMessageTypeEnum:
    """Test MessageType enum."""

    def test_message_types(self):
        """Test message type enum has correct values."""
        assert MessageType.USER == "user"
        assert MessageType.ASSISTANT == "assistant"
        assert MessageType.SYSTEM == "system"


class TestHealthResponse:
    """Test HealthResponse model."""

    def test_health_response_defaults(self):
        """Test HealthResponse has correct defaults."""
        response = HealthResponse(service="test-service")
        assert response.status == "healthy"
        assert response.service == "test-service"
        assert response.version == "1.0.0"


class TestChatMessage:
    """Test ChatMessage model."""

    def test_chat_message_creation(self):
        """Test creating a chat message."""
        message = ChatMessage(
            role=MessageType.USER,
            content="Hello, world!"
        )
        assert message.role == MessageType.USER
        assert message.content == "Hello, world!"
        assert isinstance(message.timestamp, datetime)


class TestChatRequest:
    """Test ChatRequest model."""

    def test_chat_request_creation(self):
        """Test creating a chat request."""
        student_id = uuid4()
        request = ChatRequest(
            student_id=student_id,
            message="What is Python?"
        )
        assert request.student_id == student_id
        assert request.message == "What is Python?"
        assert request.topic is None
        assert request.conversation_history == []

    def test_chat_request_with_optional_fields(self):
        """Test chat request with optional fields."""
        student_id = uuid4()
        request = ChatRequest(
            student_id=student_id,
            message="Explain loops",
            topic="control_flow",
            conversation_history=[
                ChatMessage(role=MessageType.USER, content="Hi")
            ]
        )
        assert request.topic == "control_flow"
        assert len(request.conversation_history) == 1


class TestTriageResult:
    """Test TriageResult model."""

    def test_triage_result_creation(self):
        """Test creating a triage result."""
        result = TriageResult(
            agent_type="concepts",
            confidence=0.95,
            reasoning="Query contains concept keywords"
        )
        assert result.agent_type == "concepts"
        assert result.confidence == 0.95
        assert result.reasoning == "Query contains concept keywords"


class TestCodeSubmission:
    """Test CodeSubmission model."""

    def test_code_submission_defaults(self):
        """Test code submission with defaults."""
        student_id = uuid4()
        submission = CodeSubmission(
            student_id=student_id,
            code="print('hello')"
        )
        assert submission.student_id == student_id
        assert submission.code == "print('hello')"
        assert submission.language == "python"
        assert submission.exercise_id is None


class TestCodeReviewResult:
    """Test CodeReviewResult model."""

    def test_code_review_result_defaults(self):
        """Test code review result with defaults."""
        result = CodeReviewResult(
            correct=True,
            feedback="Great job!"
        )
        assert result.correct is True
        assert result.feedback == "Great job!"
        assert result.hints == []
        assert result.quality_score is None


class TestExerciseRequest:
    """Test ExerciseRequest model."""

    def test_exercise_request_defaults(self):
        """Test exercise request with defaults."""
        student_id = uuid4()
        request = ExerciseRequest(
            student_id=student_id,
            module_id=1
        )
        assert request.student_id == student_id
        assert request.module_id == 1
        assert request.topic is None
        assert request.difficulty == "medium"


class TestProgressData:
    """Test ProgressData model."""

    def test_progress_data_defaults(self):
        """Test progress data with defaults."""
        student_id = uuid4()
        progress = ProgressData(
            student_id=student_id,
            module_id=1,
            mastery_score=0.75,
            mastery_level=MasteryLevel.LEARNING
        )
        assert progress.student_id == student_id
        assert progress.exercises_completed == 0
        assert progress.streak_days == 0
        assert isinstance(progress.last_activity, datetime)


class TestUserModels:
    """Test User-related models."""

    def test_user_creation(self):
        """Test creating a user."""
        user = User(
            name="Test User",
            email="test@example.com",
            role=Role.STUDENT
        )
        assert user.name == "Test User"
        assert user.email == "test@example.com"
        assert user.role == Role.STUDENT
        assert isinstance(user.id, type(uuid4()))

    def test_user_create(self):
        """Test user creation request."""
        user_create = UserCreate(
            name="New User",
            email="new@example.com",
            password="password123",
            role=Role.STUDENT
        )
        assert user_create.name == "New User"
        assert user_create.password == "password123"

    def test_user_response(self):
        """Test user response."""
        user_id = uuid4()
        user_response = UserResponse(
            id=user_id,
            name="Response User",
            email="response@example.com",
            role=Role.TEACHER,
            created_at=datetime.utcnow()
        )
        assert user_response.id == user_id
        assert user_response.role == Role.TEACHER


class TestModuleModels:
    """Test Module-related models."""

    def test_module_creation(self):
        """Test creating a module."""
        module = Module(
            id=1,
            name="Python Basics",
            description="Introduction to Python",
            difficulty="beginner",
            topics_count=10,
            exercises_count=25
        )
        assert module.id == 1
        assert module.name == "Python Basics"
        assert module.difficulty == "beginner"

    def test_module_progress(self):
        """Test module progress."""
        progress = ModuleProgress(
            module_id=1,
            module_name="Python Basics",
            mastery_score=0.8,
            mastery_level=MasteryLevel.PROFICIENT,
            exercises_completed=20,
            total_exercises=25
        )
        assert progress.module_id == 1
        assert progress.mastery_score == 0.8
        assert progress.exercises_completed == 20
