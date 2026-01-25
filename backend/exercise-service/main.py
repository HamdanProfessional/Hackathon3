"""
exercise-service - FastAPI service with Dapr integration
Agent Type: exercise
"""
from fastapi import FastAPI
from dapr.ext.fastapi import DaprApp
from .agent import ExerciseAgent
from .models import QueryRequest, QueryResponse

app = FastAPI(title="exercise-service", version="1.0.0")
dapr_app = DaprApp(app)
agent = ExerciseAgent()

@app.post("/", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    """Handle incoming query."""
    result = await agent.process(request.query, request.context)
    return QueryResponse(result=result)

@dapr_app.subscribe(pubsub="kafka-pubsub", topic="exercise.generate")
async def handle_event(event_data: dict):
    """Handle Kafka events."""
    await agent.process_event(event_data)

@app.get("/health")
async def health():
    return {"status": "healthy"}
