"""
Chat Service - FastAPI service for chat persistence
Stores and retrieves conversations and messages for LearnFlow.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import sys
import json
from uuid import UUID
from datetime import datetime

# Add parent directory to path to import common modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from common.models import (
    Conversation,
    Message,
    CreateConversationRequest,
    SendMessageRequest,
    ConversationResponse,
    MessageResponse,
    ListConversationsResponse,
)
from common.database import Database, get_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Chat Service",
    description="Chat persistence service for LearnFlow",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db: Database = None


# Table creation SQL
CREATE_CONVERSATIONS_TABLE = """
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id UUID PRIMARY KEY,
    student_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
    agent_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_student_id ON conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
"""

CREATE_MESSAGES_TABLE = """
CREATE TABLE IF NOT EXISTS messages (
    message_id UUID PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    agent_type VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tokens_used INTEGER
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
"""


@app.on_event("startup")
async def startup():
    """Initialize database connection and create tables."""
    global db
    db = await get_db()

    try:
        # Create tables
        await db.execute(CREATE_CONVERSATIONS_TABLE)
        await db.execute(CREATE_MESSAGES_TABLE)
        logger.info("Chat service database tables created/verified")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")


@app.on_event("shutdown")
async def shutdown():
    """Close database connection."""
    if db:
        await db.disconnect()


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "chat-service",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "conversations": "/api/v1/conversations",
            "messages": "/api/v1/conversations/{id}/messages",
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "chat-service"}


@app.post("/api/v1/conversations", response_model=Conversation)
async def create_conversation(request: CreateConversationRequest):
    """
    Create a new conversation for a student.

    Args:
        request: CreateConversationRequest with student_id, optional title and agent_type

    Returns:
        The created Conversation object
    """
    try:
        # Check if student has any existing conversations
        existing = await db.fetch(
            "SELECT conversation_id FROM conversations WHERE student_id = $1 ORDER BY created_at DESC",
            request.student_id
        )

        # If this is the first conversation, use default title
        title = request.title
        if len(existing) == 0 and not title or title == "New Conversation":
            title = f"Chat {datetime.now().strftime('%b %d, %Y')}"

        conversation_id = await db.fetchval(
            """INSERT INTO conversations (student_id, title, agent_type)
               VALUES ($1, $2, $3)
               RETURNING conversation_id""",
            request.student_id, title, request.agent_type
        )

        conversation = await db.fetchrow(
            "SELECT * FROM conversations WHERE conversation_id = $1",
            conversation_id
        )

        return Conversation(
            conversation_id=conversation["conversation_id"],
            student_id=conversation["student_id"],
            title=conversation["title"],
            agent_type=conversation["agent_type"],
            created_at=conversation["created_at"],
            updated_at=conversation["updated_at"]
        )

    except Exception as e:
        logger.error(f"Error creating conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/conversations/{student_id}", response_model=ListConversationsResponse)
async def list_conversations(student_id: UUID, limit: int = 50, offset: int = 0):
    """
    List all conversations for a student.

    Args:
        student_id: UUID of the student
        limit: Maximum number of conversations to return
        offset: Number of conversations to skip

    Returns:
        ListConversationsResponse with conversations and total count
    """
    try:
        # Get total count
        total_count = await db.fetchval(
            "SELECT COUNT(*) FROM conversations WHERE student_id = $1",
            student_id
        )

        # Get conversations
        rows = await db.fetch(
            """SELECT * FROM conversations
               WHERE student_id = $1
               ORDER BY updated_at DESC
               LIMIT $2 OFFSET $3""",
            student_id, limit, offset
        )

        conversations = [
            Conversation(
                conversation_id=row["conversation_id"],
                student_id=row["student_id"],
                title=row["title"],
                agent_type=row["agent_type"],
                created_at=row["created_at"],
                updated_at=row["updated_at"]
            )
            for row in rows
        ]

        return ListConversationsResponse(
            conversations=conversations,
            total_count=total_count
        )

    except Exception as e:
        logger.error(f"Error listing conversations: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/conversations/{conversation_id}/details", response_model=ConversationResponse)
async def get_conversation(conversation_id: UUID):
    """
    Get a conversation with all its messages.

    Args:
        conversation_id: UUID of the conversation

    Returns:
        ConversationResponse with conversation details and messages
    """
    try:
        # Get conversation
        conv_row = await db.fetchrow(
            "SELECT * FROM conversations WHERE conversation_id = $1",
            conversation_id
        )

        if not conv_row:
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Get messages
        msg_rows = await db.fetch(
            """SELECT * FROM messages
               WHERE conversation_id = $1
               ORDER BY timestamp ASC""",
            conversation_id
        )

        messages = [
            Message(
                message_id=row["message_id"],
                conversation_id=row["conversation_id"],
                role=row["role"],
                content=row["content"],
                agent_type=row["agent_type"],
                timestamp=row["timestamp"],
                tokens_used=row["tokens_used"]
            )
            for row in msg_rows
        ]

        return ConversationResponse(
            conversation_id=conv_row["conversation_id"],
            student_id=conv_row["student_id"],
            title=conv_row["title"],
            agent_type=conv_row["agent_type"],
            created_at=conv_row["created_at"],
            updated_at=conv_row["updated_at"],
            messages=messages
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/messages", response_model=MessageResponse)
async def send_message(request: SendMessageRequest):
    """
    Send a message in a conversation.

    Args:
        request: SendMessageRequest with conversation_id, role, content, etc.

    Returns:
        The created Message object
    """
    try:
        # Verify conversation exists
        conv_exists = await db.fetchval(
            "SELECT conversation_id FROM conversations WHERE conversation_id = $1",
            request.conversation_id
        )

        if not conv_exists:
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Insert message
        message_id = await db.fetchval(
            """INSERT INTO messages (conversation_id, role, content, agent_type, tokens_used)
               VALUES ($1, $2, $3, $4, $5)
               RETURNING message_id""",
            request.conversation_id, request.role, request.content,
            request.agent_type, request.tokens_used
        )

        # Update conversation's updated_at timestamp
        await db.execute(
            "UPDATE conversations SET updated_at = NOW() WHERE conversation_id = $1",
            request.conversation_id
        )

        # Get the created message
        row = await db.fetchrow(
            "SELECT * FROM messages WHERE message_id = $1",
            message_id
        )

        return MessageResponse(
            message_id=row["message_id"],
            conversation_id=row["conversation_id"],
            role=row["role"],
            content=row["content"],
            agent_type=row["agent_type"],
            timestamp=row["timestamp"],
            tokens_used=row["tokens_used"]
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/conversations/{conversation_id}/messages")
async def get_messages(conversation_id: UUID, limit: int = 100, offset: int = 0):
    """
    Get messages from a conversation.

    Args:
        conversation_id: UUID of the conversation
        limit: Maximum number of messages to return
        offset: Number of messages to skip

    Returns:
        List of messages
    """
    try:
        # Verify conversation exists
        conv_exists = await db.fetchval(
            "SELECT conversation_id FROM conversations WHERE conversation_id = $1",
            conversation_id
        )

        if not conv_exists:
            raise HTTPException(status_code=404, detail="Conversation not found")

        rows = await db.fetch(
            """SELECT * FROM messages
               WHERE conversation_id = $1
               ORDER BY timestamp ASC
               LIMIT $2 OFFSET $3""",
            conversation_id, limit, offset
        )

        messages = [
            Message(
                message_id=row["message_id"],
                conversation_id=row["conversation_id"],
                role=row["role"],
                content=row["content"],
                agent_type=row["agent_type"],
                timestamp=row["timestamp"],
                tokens_used=row["tokens_used"]
            )
            for row in rows
        ]

        return {"messages": messages, "count": len(messages)}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/v1/conversations/{conversation_id}")
async def delete_conversation(conversation_id: UUID):
    """
    Delete a conversation and all its messages.

    Args:
        conversation_id: UUID of the conversation to delete

    Returns:
        Success message
    """
    try:
        # Delete conversation (messages will be cascade deleted)
        result = await db.execute(
            "DELETE FROM conversations WHERE conversation_id = $1",
            conversation_id
        )

        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Conversation not found")

        return {"message": "Conversation deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/v1/conversations/{conversation_id}/title")
async def update_conversation_title(conversation_id: UUID, title: str):
    """
    Update a conversation's title.

    Args:
        conversation_id: UUID of the conversation
        title: New title for the conversation

    Returns:
        Updated conversation
    """
    try:
        await db.execute(
            "UPDATE conversations SET title = $1, updated_at = NOW() WHERE conversation_id = $2",
            title, conversation_id
        )

        row = await db.fetchrow(
            "SELECT * FROM conversations WHERE conversation_id = $1",
            conversation_id
        )

        if not row:
            raise HTTPException(status_code=404, detail="Conversation not found")

        return Conversation(
            conversation_id=row["conversation_id"],
            student_id=row["student_id"],
            title=row["title"],
            agent_type=row["agent_type"],
            created_at=row["created_at"],
            updated_at=row["updated_at"]
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating conversation title: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)
