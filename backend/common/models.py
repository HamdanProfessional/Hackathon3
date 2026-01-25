"""Shared Pydantic models for LearnFlow services."""
from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Literal
from datetime import datetime
from uuid import UUID, uuid4


class Student(BaseModel):
    """Student information."""
    student_id: UUID = Field(default_factory=uuid4)
    name: str
    email: str
    role: Literal["student", "teacher"] = "student"
    current_module: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)


class MasteryLevel(BaseModel):
    """Mastery level information."""
    level: Literal["Beginner", "Learning", "Proficient", "Mastered"]
    score: float = Field(ge=0, le=100)

    @classmethod
    def from_score(cls, score: float) -> "MasteryLevel":
        """Determine mastery level from score."""
        if score <= 40:
            return cls(level="Beginner", score=score)
        elif score <= 70:
            return cls(level="Learning", score=score)
        elif score <= 90:
            return cls(level="Proficient", score=score)
        else:
            return cls(level="Mastered", score=score)


class Progress(BaseModel):
    """Student progress tracking."""
    student_id: UUID
    module: int
    topic: str
    mastery_score: float = Field(ge=0, le=100)
    mastery_level: str
    last_updated: datetime = Field(default_factory=datetime.utcnow)


class Exercise(BaseModel):
    """Exercise definition."""
    exercise_id: UUID = Field(default_factory=uuid4)
    module: int
    topic: str
    difficulty: Literal["beginner", "intermediate", "advanced"]
    description: str
    starter_code: str = ""
    test_cases: List[Dict] = []
    hints: List[str] = []


class ExerciseSubmission(BaseModel):
    """Exercise submission."""
    submission_id: UUID = Field(default_factory=uuid4)
    exercise_id: UUID
    student_id: UUID
    code: str
    passed: bool = False
    feedback: str = ""
    hints_requested: int = 0
    submitted_at: datetime = Field(default_factory=datetime.utcnow)


class CodeSubmission(BaseModel):
    """Code submission for review."""
    submission_id: UUID = Field(default_factory=uuid4)
    student_id: UUID
    code: str
    language: str = "python"
    submitted_at: datetime = Field(default_factory=datetime.utcnow)


class CodeReview(BaseModel):
    """Code review results."""
    submission_id: UUID
    correctness_score: float = Field(ge=0, le=100)
    style_score: float = Field(ge=0, le=100)
    efficiency_score: float = Field(ge=0, le=100)
    readability_score: float = Field(ge=0, le=100)
    overall_score: float = Field(ge=0, le=100)
    feedback: str = ""
    suggestions: List[str] = []


class QueryRequest(BaseModel):
    """Base query request."""
    query: str
    student_id: Optional[UUID] = None
    context: Optional[Dict] = {}


class QueryResponse(BaseModel):
    """Base query response."""
    result: str
    metadata: Optional[Dict] = {}


class TriageRequest(BaseModel):
    """Triage service request."""
    query: str
    student_id: Optional[UUID] = None


class TriageResponse(BaseModel):
    """Triage service response."""
    target_service: Literal["concepts", "debug", "exercise", "progress", "code-review"]
    confidence: float = Field(ge=0, le=1)
    reasoning: str = ""


class ConceptExplanationRequest(BaseModel):
    """Concept explanation request."""
    concept: str
    student_id: UUID
    mastery_level: MasteryLevel


class DebugRequest(BaseModel):
    """Debug analysis request."""
    code: str
    error_message: str
    student_id: UUID
    hint_level: int = Field(ge=1, le=3, default=1)


class DebugResponse(BaseModel):
    """Debug analysis response."""
    error_type: str
    hint: str
    line_number: Optional[int] = None
    explanation: str = ""


class StruggleAlert(BaseModel):
    """Struggle detection alert."""
    student_id: UUID
    struggle_type: Literal["repeated_error", "stuck_too_long", "low_quiz_score", "explicit_help"]
    topic: str
    severity: Literal["low", "medium", "high"]
    details: str = ""
    detected_at: datetime = Field(default_factory=datetime.utcnow)


# Event models for Kafka
class LearningEvent(BaseModel):
    """Base learning event."""
    event_type: str
    student_id: UUID
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    data: Dict = {}


class CodeEvent(BaseModel):
    """Code-related event."""
    event_type: str
    student_id: UUID
    code: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict = {}


class ExerciseEvent(BaseModel):
    """Exercise-related event."""
    event_type: str
    student_id: UUID
    exercise_id: UUID
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    data: Dict = {}


# Chat persistence models for OpenAI ChatKit integration
class Conversation(BaseModel):
    """Chat conversation model."""
    conversation_id: UUID = Field(default_factory=uuid4)
    student_id: UUID
    title: str = "New Conversation"
    agent_type: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Message(BaseModel):
    """Chat message model."""
    message_id: UUID = Field(default_factory=uuid4)
    conversation_id: UUID
    role: Literal["user", "assistant", "system"]
    content: str
    agent_type: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    tokens_used: Optional[int] = None


class CreateConversationRequest(BaseModel):
    """Request to create a new conversation."""
    student_id: UUID
    title: Optional[str] = "New Conversation"
    agent_type: Optional[str] = None


class SendMessageRequest(BaseModel):
    """Request to send a message in a conversation."""
    conversation_id: UUID
    role: Literal["user", "assistant", "system"]
    content: str
    agent_type: Optional[str] = None
    tokens_used: Optional[int] = None


class ConversationResponse(BaseModel):
    """Response with conversation details and messages."""
    conversation_id: UUID
    student_id: UUID
    title: str
    agent_type: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    messages: List[Message] = []


class MessageResponse(BaseModel):
    """Response after sending a message."""
    message_id: UUID
    conversation_id: UUID
    role: Literal["user", "assistant", "system"]
    content: str
    agent_type: Optional[str] = None
    timestamp: datetime
    tokens_used: Optional[int] = None


class ListConversationsResponse(BaseModel):
    """Response listing all conversations for a student."""
    conversations: List[Conversation] = []
    total_count: int = 0
