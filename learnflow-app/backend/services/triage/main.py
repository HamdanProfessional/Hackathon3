"""Triage Service - Routes student queries to appropriate specialist agents.

Handles intelligent query routing:
- Concept explanations → Concepts Agent
- Error debugging → Debug Agent
- Exercise generation → Exercise Agent
- Progress queries → Progress Agent
- Code review → Code Review Agent
"""

import os
import re
from typing import Literal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from shared.models import (
    HealthResponse,
    TriageResult,
    ChatRequest,
)


# Environment
SERVICE_NAME = "triage-service"
SERVICE_VERSION = "1.0.0"
PORT = int(os.getenv("PORT", "8001"))


# FastAPI app
app = FastAPI(
    title="LearnFlow Triage Service",
    description="Routes student queries to appropriate specialist agents",
    version=SERVICE_VERSION,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Triage routing logic
AGENT_PATTERNS = {
    "concept": [
        r"\b(explain|what is|how does|define|describe|tell me about|meaning of)\b",
        r"\b(variable|function|loop|list|dictionary|class|object|string|integer)\b",
        r"\b(syntax|concept|principle|theory)\b",
    ],
    "debug": [
        r"\b(error|bug|issue|problem|not working|fail|crash|exception)\b",
        r"\b(debug|fix|help|stuck|wrong|broken)\b",
        r"\b(SyntaxException|NameError|TypeError|ValueError|IndentationError)\b",
    ],
    "exercise": [
        r"\b(exercise|practice|challenge|quiz|test|problem)\b",
        r"\b(generate|create|new exercise)\b",
    ],
    "progress": [
        r"\b(progress|score|mastery|level|streak|achievement)\b",
        r"\b(how am i doing|my stats|track)\b",
    ],
    "code_review": [
        r"\b(review|check|analyze|improve|optimize)\b",
        r"\b(better|cleaner|efficient|refactor)\b",
    ],
}


def classify_query(query: str) -> tuple[Literal["concept", "debug", "exercise", "progress", "code_review", "general"], float]:
    """Classify query into agent type with confidence score."""
    query_lower = query.lower()
    scores = {}

    for agent, patterns in AGENT_PATTERNS.items():
        score = 0
        for pattern in patterns:
            matches = len(re.findall(pattern, query_lower))
            score += matches
        scores[agent] = score

    max_score = max(scores.values())
    if max_score == 0:
        return "general", 0.5

    best_agent = max(scores, key=scores.get)
    confidence = min(max_score / 3.0, 1.0)  # Cap at 1.0

    return best_agent, confidence  # type: ignore


@app.get("/", response_model=dict)
async def root():
    """Root endpoint."""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "status": "running",
        "endpoints": {
            "health": "/health",
            "triage": "/triage",
            "chat": "/chat",
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        service=SERVICE_NAME,
        version=SERVICE_VERSION
    )


@app.post("/triage", response_model=TriageResult)
async def triage_query(request: ChatRequest):
    """Route query to appropriate agent."""
    try:
        agent_type, confidence = classify_query(request.message)

        # Map internal agent names to service names
        agent_mapping = {
            "concept": "concepts",
            "debug": "debug",
            "exercise": "exercise",
            "progress": "progress",
            "code_review": "code_review",
            "general": "concepts",  # Default to concepts for general queries
        }

        service_name = agent_mapping.get(agent_type, "concepts")

        return TriageResult(
            agent_type=service_name,
            confidence=confidence,
            reasoning=f"Query classified as {agent_type} with {confidence:.1%} confidence"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
async def chat(request: ChatRequest):
    """Process chat through triage and return response."""
    # Triaging the query
    triage_result = await triage_query(request)

    # In a real implementation, this would call the appropriate service
    # For now, return the triage result
    return {
        "triage": triage_result,
        "message": f"Your question has been routed to the {triage_result.agent_type} agent.",
        "next_step": f"Contact {triage_result.agent_type}-service for actual response"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
