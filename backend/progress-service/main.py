"""
progress-service - FastAPI service
Agent Type: progress
"""
from fastapi import FastAPI
from agent import ProgressAgent
from models import QueryRequest, QueryResponse

app = FastAPI(title="progress-service", version="1.0.0")
agent = ProgressAgent()

@app.post("/", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    """Handle incoming query."""
    result = await agent.process(request.query, request.context)
    return QueryResponse(result=result)

@app.post("/events/progress_update")
async def handle_event(event_data: dict):
    """Handle Kafka events via Dapr endpoint."""
    await agent.process_event(event_data)
    return {"status": "processed"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
