"""
code-review-service - FastAPI service
Agent Type: code-review
"""
from fastapi import FastAPI
from agent import CodeReviewAgent
from models import QueryRequest, QueryResponse

app = FastAPI(title="code-review-service", version="1.0.0")
agent = CodeReviewAgent()

@app.post("/", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    """Handle incoming query."""
    result = await agent.process(request.query, request.context)
    return QueryResponse(result=result)

@app.post("/events/review_request")
async def handle_event(event_data: dict):
    """Handle Kafka events via Dapr endpoint."""
    await agent.process_event(event_data)
    return {"status": "processed"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
