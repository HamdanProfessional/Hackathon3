"""
mcp-kafka-server - MCP Server for LearnFlow Kafka Integration
Follows Code Execution Pattern for token efficiency.
Provides tools for publishing events, subscribing to topics, and event history.
"""
import sys
import os

# Add parent directory to path for direct execution
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mcp.server import FastMCP
from config import settings_kafka, LEARNING_TOPICS, STRUGGLE_TOPICS
from tools import publish_learning_event, subscribe_to_events
from tools import get_event_history, publish_struggle_alert

# Create MCP server
mcp = FastMCP("mcp-kafka-server")

# Register tools
@mcp.tool()
def publish_learning_event_tool(event_type: str, student_id: str, data: dict) -> dict:
    """Publish a learning event to Kafka."""
    return publish_learning_event.publish_learning_event(event_type, student_id, data)

@mcp.tool()
def subscribe_to_events_tool(topic: str, student_id: str = None, timeout: int = 5) -> dict:
    """Subscribe to Kafka events and return recent messages."""
    return subscribe_to_events.subscribe_to_events(topic, student_id, timeout)

@mcp.tool()
def get_event_history_tool(student_id: str = None, topic: str = None, limit: int = 10) -> dict:
    """Get event history from event store."""
    return get_event_history.get_event_history(student_id, topic, limit)

@mcp.tool()
def publish_struggle_alert_tool(student_id: str, alert_type: str, severity: str, message: str) -> dict:
    """Publish a struggle alert event."""
    return publish_struggle_alert.publish_struggle_alert(student_id, alert_type, severity, message)

if __name__ == "__main__":
    mcp.run()
