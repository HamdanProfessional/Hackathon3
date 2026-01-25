"""
debug-service - FastAPI service with Dapr integration
Agent Type: debug
"""
from fastapi import FastAPI
from dapr.ext.fastapi import DaprApp
from .agent import DebugAgent
from .models import QueryRequest, QueryResponse

app = FastAPI(title="debug-service", version="1.0.0")
dapr_app = DaprApp(app)
agent = DebugAgent()

@app.post("/", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    """Handle incoming query."""
    result = await agent.process(request.query, request.context)
    return QueryResponse(result=result)

@dapr_app.subscribe(pubsub="kafka-pubsub", topic="code.error")
async def handle_event(event_data: dict):
    """Handle Kafka events."""
    await agent.process_event(event_data)

@app.get("/health")
async def health():
    return {"status": "healthy"}
