"""
code-review-service - FastAPI service with Dapr integration
Agent Type: code-review
"""
from fastapi import FastAPI
from dapr.ext.fastapi import DaprApp
from .agent import CodeReviewAgent
from .models import QueryRequest, QueryResponse

app = FastAPI(title="code-review-service", version="1.0.0")
dapr_app = DaprApp(app)
agent = CodeReviewAgent()

@app.post("/", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    """Handle incoming query."""
    result = await agent.process(request.query, request.context)
    return QueryResponse(result=result)

@dapr_app.subscribe(pubsub="kafka-pubsub", topic="code.review_request")
async def handle_event(event_data: dict):
    """Handle Kafka events."""
    await agent.process_event(event_data)

@app.get("/health")
async def health():
    return {"status": "healthy"}
