"""
Chat Service - Manages persistent conversations for the LearnFlow platform.

This service handles:
- Creating and managing conversations
- Storing and retrieving messages
- Conversation history for students
"""

from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database setup
DATABASE_URL = "postgresql://learnflow-user:learnflow-password@learnflow-postgresql:5432/learnflow"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


# Models
class Conversation(Base):
    """Conversation model for storing chat sessions."""
    __tablename__ = "conversations"

    conversation_id = Column(String, primary_key=True)
    student_id = Column(String, nullable=False, index=True)
    title = Column(String, default="New Chat")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Message(Base):
    """Message model for storing chat messages."""
    __tablename__ = "messages"

    message_id = Column(String, primary_key=True)
    conversation_id = Column(String, nullable=False, index=True)
    role = Column(String, nullable=False)  # 'user', 'assistant', 'system'
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)


# Create tables
Base.metadata.create_all(bind=engine)


# Pydantic models
class ConversationCreate(BaseModel):
    """Request model for creating a conversation."""
    student_id: str
    title: Optional[str] = "New Chat"


class ConversationResponse(BaseModel):
    """Response model for a conversation."""
    conversation_id: str
    student_id: str
    title: str
    created_at: str
    updated_at: str


class MessageCreate(BaseModel):
    """Request model for creating a message."""
    conversation_id: str
    role: str  # 'user', 'assistant', 'system'
    content: str


class MessageResponse(BaseModel):
    """Response model for a message."""
    message_id: str
    conversation_id: str
    role: str
    content: str
    timestamp: str


class ConversationWithMessages(ConversationResponse):
    """Response model for a conversation with its messages."""
    messages: List[MessageResponse]


class ConversationsListResponse(BaseModel):
    """Response model for listing conversations."""
    conversations: List[ConversationResponse]
    total_count: int


# FastAPI app
app = FastAPI(
    title="Chat Service",
    description="Manages persistent conversations for LearnFlow",
    version="1.0.0"
)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "chat"}


@app.post("/api/v1/conversations", response_model=ConversationResponse)
async def create_conversation(request: ConversationCreate):
    """Create a new conversation for a student."""
    db = SessionLocal()
    try:
        conversation = Conversation(
            conversation_id=str(uuid4()),
            student_id=request.student_id,
            title=request.title
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

        return ConversationResponse(
            conversation_id=conversation.conversation_id,
            student_id=conversation.student_id,
            title=conversation.title,
            created_at=conversation.created_at.isoformat(),
            updated_at=conversation.updated_at.isoformat()
        )
    finally:
        db.close()


@app.get("/api/v1/conversations/{student_id}", response_model=ConversationsListResponse)
async def list_conversations(student_id: str, limit: int = 50, offset: int = 0):
    """List all conversations for a student."""
    db = SessionLocal()
    try:
        query = db.query(Conversation).filter(
            Conversation.student_id == student_id
        ).order_by(Conversation.updated_at.desc())

        total_count = query.count()
        conversations = query.limit(limit).offset(offset).all()

        return ConversationsListResponse(
            conversations=[
                ConversationResponse(
                    conversation_id=c.conversation_id,
                    student_id=c.student_id,
                    title=c.title,
                    created_at=c.created_at.isoformat(),
                    updated_at=c.updated_at.isoformat()
                )
                for c in conversations
            ],
            total_count=total_count
        )
    finally:
        db.close()


@app.get("/api/v1/conversations/{conversation_id}/details", response_model=ConversationWithMessages)
async def get_conversation(conversation_id: str):
    """Get a conversation with all its messages."""
    db = SessionLocal()
    try:
        conversation = db.query(Conversation).filter(
            Conversation.conversation_id == conversation_id
        ).first()

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        messages = db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).order_by(Message.timestamp.asc()).all()

        return ConversationWithMessages(
            conversation_id=conversation.conversation_id,
            student_id=conversation.student_id,
            title=conversation.title,
            created_at=conversation.created_at.isoformat(),
            updated_at=conversation.updated_at.isoformat(),
            messages=[
                MessageResponse(
                    message_id=m.message_id,
                    conversation_id=m.conversation_id,
                    role=m.role,
                    content=m.content,
                    timestamp=m.timestamp.isoformat()
                )
                for m in messages
            ]
        )
    finally:
        db.close()


@app.post("/api/v1/messages", response_model=MessageResponse)
async def send_message(request: MessageCreate):
    """Send a message in a conversation."""
    db = SessionLocal()
    try:
        # Verify conversation exists
        conversation = db.query(Conversation).filter(
            Conversation.conversation_id == request.conversation_id
        ).first()

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Create message
        message = Message(
            message_id=str(uuid4()),
            conversation_id=request.conversation_id,
            role=request.role,
            content=request.content
        )
        db.add(message)

        # Update conversation timestamp
        conversation.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(message)

        return MessageResponse(
            message_id=message.message_id,
            conversation_id=message.conversation_id,
            role=message.role,
            content=message.content,
            timestamp=message.timestamp.isoformat()
        )
    finally:
        db.close()


@app.delete("/api/v1/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """Delete a conversation and all its messages."""
    db = SessionLocal()
    try:
        # Delete messages first
        db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).delete()

        # Delete conversation
        result = db.query(Conversation).filter(
            Conversation.conversation_id == conversation_id
        ).delete()

        if result == 0:
            raise HTTPException(status_code=404, detail="Conversation not found")

        db.commit()

        return {"message": "Conversation deleted successfully"}
    finally:
        db.close()


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "Chat Service",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "create_conversation": "POST /api/v1/conversations",
            "list_conversations": "GET /api/v1/conversations/{student_id}",
            "get_conversation": "GET /api/v1/conversations/{conversation_id}/details",
            "send_message": "POST /api/v1/messages",
            "delete_conversation": "DELETE /api/v1/conversations/{conversation_id}"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)
