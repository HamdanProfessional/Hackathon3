"""
concepts-service - FastAPI service
Agent Type: concepts
"""
from fastapi import FastAPI
from agent import ConceptsAgent
from models import QueryRequest, QueryResponse

app = FastAPI(title="concepts-service", version="1.0.0")
agent = ConceptsAgent()

@app.post("/", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    """Handle incoming query."""
    result = await agent.process(request.query, request.context)
    return QueryResponse(result=result)

# Dapr pub/sub is handled via sidecar, not via decorator in dapr 1.13+
# To subscribe, use Dapr HTTP API or Dapr Sidecar configuration
@app.post("/events/concept_request")
async def handle_event(event_data: dict):
    """Handle Kafka events via Dapr endpoint."""
    await agent.process_event(event_data)
    return {"status": "processed"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
