"""
mcp-k8s-server - MCP Server for LearnFlow Kubernetes Operations
Follows Code Execution Pattern for token efficiency.
Provides tools for querying pods, logs, service health, and Kafka topics.
"""
import sys
import os

# Add parent directory to path for direct execution
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mcp.server import FastMCP
from config import settings_k8s
from tools import get_pod_status, get_service_logs
from tools import check_service_health, describe_pod, get_kafka_topics

# Create MCP server
mcp = FastMCP("mcp-k8s-server")

# Register tools
@mcp.tool()
def get_pod_status_tool(namespace: str = "learnflow", label_selector: str = None) -> dict:
    """Get pod status for a namespace."""
    return get_pod_status.get_pod_status(namespace, label_selector)

@mcp.tool()
def get_service_logs_tool(pod_name: str, namespace: str = "learnflow", tail_lines: int = 50) -> dict:
    """Get logs from a pod."""
    return get_service_logs.get_service_logs(pod_name, namespace, tail_lines)

@mcp.tool()
def check_service_health_tool(service_name: str, namespace: str = "learnflow") -> dict:
    """Check if a service is healthy."""
    return check_service_health.check_service_health(service_name, namespace)

@mcp.tool()
def describe_pod_tool(pod_name: str, namespace: str = "learnflow") -> dict:
    """Get detailed pod information."""
    return describe_pod.describe_pod(pod_name, namespace)

@mcp.tool()
def get_kafka_topics_tool() -> dict:
    """List Kafka topics from the cluster."""
    return get_kafka_topics.get_kafka_topics()

if __name__ == "__main__":
    mcp.run()
