"""
Triage Service - FastAPI service
Routes student queries to appropriate specialist agents.
"""
from fastapi import FastAPI, HTTPException
from dapr.clients import DaprClient
import json
import logging
import os
import sys

# Add parent directory to path to import common modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from common.agent_base import TriageAgent
from common.models import TriageRequest, TriageResponse
from common.dapr_client import get_dapr

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Triage Service",
    description="Routes student queries to appropriate specialist agents",
    version="1.0.0"
)
agent = TriageAgent()

# Dapr configuration
PUBSUB_NAME = "kafka-pubsub"
TRIAGE_TOPIC = "learning.triage"
CODE_SUBMISSION_TOPIC = "code.submission"


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "triage-service",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "triage": "/api/v1/triage"
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "triage-service"}


@app.post("/api/v1/triage", response_model=TriageResponse)
async def triage_query(request: TriageRequest):
    """
    Route a student query to the appropriate specialist service.

    Uses AI to analyze the query and determine which service should handle it:
    - concepts: For explaining Python concepts
    - debug: For debugging errors
    - exercise: For generating exercises
    - progress: For checking progress
    - code-review: For reviewing code quality
    """
    try:
        logger.info(f"Triage request: {request.query[:100]}...")

        # Build context for the agent
        context = {"student_id": str(request.student_id)} if request.student_id else {}

        # Get routing decision from agent
        result = await agent.process(request.query, context)

        # Parse the JSON response
        try:
            routing = json.loads(result)
            return TriageResponse(**routing)
        except json.JSONDecodeError:
            # Fallback: parse from text response
            response = TriageResponse(
                target_service="concepts",
                confidence=0.5,
                reasoning=f"Raw response: {result}"
            )
            return response

    except Exception as e:
        logger.error(f"Error in triage: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/route")
async def route_and_invoke(request: TriageRequest):
    """
    Route a query and invoke the target service directly via Dapr.
    Returns the response from the target service.
    """
    try:
        # Get routing decision
        triage_result = await triage_query(request)

        # Map service names to Dapr app IDs
        service_map = {
            "concepts": "concepts-service",
            "debug": "debug-service",
            "exercise": "exercise-service",
            "progress": "progress-service",
            "code-review": "code-review-service"
        }

        target_app_id = service_map.get(triage_result.target_service)
        if not target_app_id:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown target service: {triage_result.target_service}"
            )

        # Invoke target service via Dapr
        with DaprClient() as dapr:
            response = dapr.invoke_method(
                app_id=target_app_id,
                method_name="/",
                data=json.dumps({
                    "query": request.query,
                    "student_id": str(request.student_id) if request.student_id else None
                }),
                http_verb="POST"
            )

            # Return the response with routing metadata
            result = json.loads(response.data)
            return {
                "routing": {
                    "target_service": triage_result.target_service,
                    "confidence": triage_result.confidence,
                    "reasoning": triage_result.reasoning
                },
                "response": result
            }

    except Exception as e:
        logger.error(f"Error in route_and_invoke: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/events/code_submission")
async def handle_code_submission(event_data: dict):
    """
    Handle code submission events from Kafka.
    Routes code submissions to code-review service.
    """
    try:
        logger.info(f"Received code submission event: {event_data}")

        # Publish to code review topic
        dapr = await get_dapr()
        await dapr.publish_event(
            "code.review_request",
            {
                "submission_id": event_data.get("submission_id"),
                "student_id": event_data.get("student_id"),
                "code": event_data.get("code")
            }
        )
        return {"status": "processed"}

    except Exception as e:
        logger.error(f"Error handling code submission: {e}")
        raise


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
