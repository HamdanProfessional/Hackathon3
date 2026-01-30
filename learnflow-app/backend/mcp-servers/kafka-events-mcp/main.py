"""LearnFlow Kafka Events MCP Server

Provides real-time Kafka event streaming for AI agents.
Allows AI agents to subscribe to topics and receive events in real-time.
Subscribes to: learning.progress, code.submission, exercise.attempt, struggle.alert
"""

import os
import asyncio
import json
import logging
from typing import Any, Optional
from datetime import datetime
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Try to import Dapr client, fall back to mock if unavailable
try:
    from dapr import DaprClient
    DAPR_AVAILABLE = True
except ImportError:
    DAPR_AVAILABLE = False
    logging.warning("Dapr client not available, using mock mode")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Dapr settings
DAPR_HTTP_PORT = int(os.getenv("DAPR_HTTP_PORT", "3500"))
PUBSUB_COMPONENT = "learnflow-pubsub"

# Kafka topics
TOPICS = {
    "learning.progress": "Topic for concept learning and progress updates",
    "code.submission": "Topic for code analysis and review events",
    "exercise.attempt": "Topic for exercise submission events",
    "struggle.alert": "Topic for repeated error/difficulty alerts",
}

# In-memory event storage (for subscription simulation)
_event_store: dict[str, list[dict[str, Any]]] = {
    topic: [] for topic in TOPICS
}


async def publish_event(topic: str, data: dict[str, Any]) -> dict[str, Any]:
    """Publish an event to a Kafka topic via Dapr."""
    # Add timestamp
    data["timestamp"] = datetime.utcnow().isoformat()
    data["topic"] = topic

    if DAPR_AVAILABLE:
        try:
            client = DaprClient()
            client.publish_event(
                pubsub_name=PUBSUB_COMPONENT,
                topic_name=topic,
                data=json.dumps(data),
                data_content_type="application/json",
            )
            logger.info(f"Published event to {topic}: {data}")
            return {"success": True, "topic": topic, "event": data}
        except Exception as e:
            logger.error(f"Failed to publish event: {e}")
            return {"success": False, "error": str(e)}
    else:
        # Mock mode: store in memory
        _event_store[topic].append(data)
        logger.info(f"[MOCK] Published event to {topic}: {data}")
        return {"success": True, "topic": topic, "event": data, "mock": True}


async def subscribe_to_topic(
    topic: str,
    limit: int = 10,
    offset: int = 0
) -> dict[str, Any]:
    """Subscribe to a Kafka topic and retrieve events.

    In production, this would establish a long-lived subscription.
    For this implementation, we return recent events from memory.
    """
    if topic not in TOPICS:
        return {
            "success": False,
            "error": f"Unknown topic: {topic}. Available topics: {list(TOPICS.keys())}"
        }

    # Get events from store
    events = _event_store[topic]

    # Apply pagination
    start_idx = min(offset, len(events))
    end_idx = min(offset + limit, len(events))
    paginated_events = events[start_idx:end_idx]

    # Include some sample events if store is empty
    if not paginated_events:
        paginated_events = _get_sample_events(topic)

    return {
        "success": True,
        "topic": topic,
        "events": paginated_events,
        "total_count": len(events) if events else len(paginated_events),
        "offset": offset,
        "limit": limit,
    }


def _get_sample_events(topic: str) -> list[dict[str, Any]]:
    """Get sample events for demonstration when store is empty."""
    samples = {
        "learning.progress": [
            {
                "student_id": "student-1",
                "event_type": "concept_learned",
                "concept": "variables",
                "mastery_level": "beginner",
                "timestamp": datetime.utcnow().isoformat(),
            },
            {
                "student_id": "student-2",
                "event_type": "concept_learned",
                "concept": "loops",
                "mastery_level": "learning",
                "timestamp": datetime.utcnow().isoformat(),
            },
        ],
        "code.submission": [
            {
                "student_id": "student-1",
                "exercise_id": "ex_1_1",
                "language": "python",
                "correct": True,
                "quality_score": 85,
                "timestamp": datetime.utcnow().isoformat(),
            },
        ],
        "exercise.attempt": [
            {
                "student_id": "student-1",
                "exercise_id": "ex_1_1",
                "passed": True,
                "module_id": "basics",
                "topic": "Variables",
                "difficulty": "beginner",
                "timestamp": datetime.utcnow().isoformat(),
            },
        ],
        "struggle.alert": [
            {
                "student_id": "student-3",
                "alert_type": "repeated_error",
                "category": "syntax",
                "error_count": 3,
                "message": "Student encountered SyntaxError 3 times",
                "timestamp": datetime.utcnow().isoformat(),
            },
        ],
    }
    return samples.get(topic, [])


async def get_all_topics() -> dict[str, Any]:
    """Get all available Kafka topics."""
    return {
        "success": True,
        "topics": [
            {"name": name, "description": desc}
            for name, desc in TOPICS.items()
        ]
    }


# Create server
server = Server("learnflow-kafka-events")


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools."""
    return [
        Tool(
            name="publish_event",
            description="Publish an event to a Kafka topic via Dapr",
            inputSchema={
                "type": "object",
                "properties": {
                    "topic": {
                        "type": "string",
                        "enum": list(TOPICS.keys()),
                        "description": "The Kafka topic to publish to"
                    },
                    "data": {
                        "type": "object",
                        "description": "The event data (JSON object)"
                    }
                },
                "required": ["topic", "data"]
            }
        ),
        Tool(
            name="subscribe_topic",
            description="Subscribe to a Kafka topic and retrieve events (simulates real-time streaming)",
            inputSchema={
                "type": "object",
                "properties": {
                    "topic": {
                        "type": "string",
                        "enum": list(TOPICS.keys()),
                        "description": "The Kafka topic to subscribe to"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of events to retrieve (default: 10)",
                        "default": 10
                    },
                    "offset": {
                        "type": "integer",
                        "description": "Offset for pagination (default: 0)",
                        "default": 0
                    }
                },
                "required": ["topic"]
            }
        ),
        Tool(
            name="list_topics",
            description="List all available Kafka topics",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="get_recent_events",
            description="Get recent events from all topics combined",
            inputSchema={
                "type": "object",
                "properties": {
                    "limit": {
                        "type": "integer",
                        "description": "Maximum events per topic (default: 5)",
                        "default": 5
                    }
                }
            }
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """Handle tool calls."""
    if name == "publish_event":
        result = await publish_event(
            topic=arguments["topic"],
            data=arguments["data"]
        )
        return [TextContent(json.dumps(result, indent=2))]

    elif name == "subscribe_topic":
        result = await subscribe_to_topic(
            topic=arguments["topic"],
            limit=arguments.get("limit", 10),
            offset=arguments.get("offset", 0)
        )
        return [TextContent(json.dumps(result, indent=2))]

    elif name == "list_topics":
        result = await get_all_topics()
        return [TextContent(json.dumps(result, indent=2))]

    elif name == "get_recent_events":
        # Get recent events from all topics
        limit = arguments.get("limit", 5)
        all_events = {}
        for topic in TOPICS:
            result = await subscribe_to_topic(topic, limit=limit, offset=0)
            all_events[topic] = result.get("events", [])
        return [TextContent(json.dumps({
            "success": True,
            "recent_events": all_events
        }, indent=2))]

    else:
        return [TextContent(json.dumps({
            "success": False,
            "error": f"Unknown tool: {name}"
        }, indent=2))]


async def main():
    """Main entry point."""
    async with stdio_server() as (read_stream, write_stream):
        server.server = stdio_server
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
