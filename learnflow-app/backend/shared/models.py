"""Shared data models for LearnFlow services."""

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from pydantic import BaseModel, Field
from enum import Enum


class Role(str, Enum):
    """User roles."""
    STUDENT = "student"
    TEACHER = "teacher"


class MasteryLevel(str, Enum):
    """Mastery levels."""
    BEGINNER = "beginner"
    LEARNING = "learning"
    PROFICIENT = "proficient"
    MASTERED = "mastered"


class MessageType(str, Enum):
    """Message types for chat."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


# Request/Response Models
class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "healthy"
    service: str
    version: str = "1.0.0"


class ChatMessage(BaseModel):
    """Chat message."""
    role: MessageType
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ChatRequest(BaseModel):
    """Chat request."""
    student_id: UUID
    message: str
    topic: Optional[str] = None
    conversation_history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    """Chat response."""
    response: str
    agent_type: str
    confidence: float = 1.0
    hints: list[str] = []


class CodeSubmission(BaseModel):
    """Code submission for review."""
    student_id: UUID
    code: str
    exercise_id: Optional[int] = None
    language: str = "python"


class CodeReviewResult(BaseModel):
    """Code review result."""
    correct: bool
    feedback: str
    hints: list[str] = []
    quality_score: Optional[float] = None
    style_issues: list[str] = []
    efficiency_notes: list[str] = []


class ExerciseRequest(BaseModel):
    """Exercise generation request."""
    student_id: UUID
    module_id: int
    topic: Optional[str] = None
    difficulty: Optional[str] = "medium"


class Exercise(BaseModel):
    """Exercise."""
    id: int
    title: str
    description: str
    instructions: str
    starter_code: str
    test_cases: list[dict]
    hints: list[str]
    difficulty: str
    module_id: int
    topic: str


class ExerciseSubmission(BaseModel):
    """Exercise submission."""
    student_id: UUID
    exercise_id: int
    code: str


class ExerciseResult(BaseModel):
    """Exercise result."""
    passed: bool
    feedback: str
    test_results: list[dict]
    hints: list[str] = []


class ProgressData(BaseModel):
    """Progress data."""
    student_id: UUID
    module_id: int
    mastery_score: float
    mastery_level: MasteryLevel
    exercises_completed: int = 0
    total_exercises: int = 0
    streak_days: int = 0
    last_activity: datetime = Field(default_factory=datetime.utcnow)


class StruggleAlert(BaseModel):
    """Struggle alert."""
    student_id: UUID
    alert_type: str
    topic: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ConceptExplanation(BaseModel):
    """Concept explanation."""
    concept: str
    explanation: str
    examples: list[str]
    mastery_adapted: bool = True


class TriageResult(BaseModel):
    """Triage routing result."""
    agent_type: str
    confidence: float
    reasoning: str


# User Models
class User(BaseModel):
    """User."""
    id: UUID = Field(default_factory=uuid4)
    name: str
    email: str
    role: Role
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(BaseModel):
    """User creation request."""
    name: str
    email: str
    password: str
    role: Role = Role.STUDENT


class UserResponse(BaseModel):
    """User response."""
    id: UUID
    name: str
    email: str
    role: Role
    created_at: datetime


class TokenResponse(BaseModel):
    """Token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class Module(BaseModel):
    """Learning module."""
    id: int
    name: str
    description: str
    difficulty: str
    topics_count: int
    exercises_count: int


class ModuleProgress(BaseModel):
    """Module progress."""
    module_id: int
    module_name: str
    mastery_score: float
    mastery_level: MasteryLevel
    exercises_completed: int
    total_exercises: int
