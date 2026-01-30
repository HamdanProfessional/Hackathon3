"""LearnFlow Kubernetes Operations MCP Server

Provides Kubernetes cluster operations for AI agents.
Allows AI agents to query pod status, service endpoints, and logs.
"""

import os
import asyncio
import json
import logging
from typing import Any, Optional
from datetime import datetime, timedelta
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Try to import kubernetes client, fall back to mock if unavailable
try:
    from kubernetes import client, config
    KUBERNETES_AVAILABLE = True
except ImportError:
    KUBERNETES_AVAILABLE = False
    logging.warning("Kubernetes client not available, using mock mode")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Mock data for when Kubernetes is unavailable
_mock_pods = {
    "learnflow": {
        "triage-service": {
            "name": "triage-service",
            "namespace": "learnflow",
            "ready": "1/1",
            "status": "Running",
            "restarts": 0,
            "age": "2h",
        },
        "concepts-service": {
            "name": "concepts-service",
            "namespace": "learnflow",
            "ready": "1/1",
            "status": "Running",
            "restarts": 0,
            "age": "2h",
        },
        "debug-service": {
            "name": "debug-service",
            "namespace": "learnflow",
            "ready": "1/1",
            "status": "Running",
            "restarts": 0,
            "age": "2h",
        },
        "exercise-service": {
            "name": "exercise-service",
            "namespace": "learnflow",
            "ready": "1/1",
            "status": "Running",
            "restarts": 0,
            "age": "2h",
        },
        "progress-service": {
            "name": "progress-service",
            "namespace": "learnflow",
            "ready": "1/1",
            "status": "Running",
            "restarts": 0,
            "age": "2h",
        },
        "code-review-service": {
            "name": "code-review-service",
            "namespace": "learnflow",
            "ready": "1/1",
            "status": "Running",
            "restarts": 0,
            "age": "2h",
        },
        "chat-service": {
            "name": "chat-service",
            "namespace": "learnflow",
            "ready": "1/1",
            "status": "Running",
            "restarts": 0,
            "age": "2h",
        },
    },
    "kafka": {
        "kafka-0": {
            "name": "kafka-0",
            "namespace": "kafka",
            "ready": "1/1",
            "status": "Running",
            "restarts": 0,
            "age": "2h",
        },
        "zookeeper-0": {
            "name": "zookeeper-0",
            "namespace": "kafka",
            "ready": "1/1",
            "status": "Running",
            "restarts": 0,
            "age": "2h",
        },
    },
    "postgres": {
        "postgres-0": {
            "name": "postgres-0",
            "namespace": "postgres",
            "ready": "1/1",
            "status": "Running",
            "restarts": 0,
            "age": "2h",
        },
    },
}

_mock_services = {
    "learnflow": [
        {"name": "triage-service", "type": "ClusterIP", "cluster_ip": "10.96.100.1", "port": 8001},
        {"name": "concepts-service", "type": "ClusterIP", "cluster_ip": "10.96.100.2", "port": 8002},
        {"name": "debug-service", "type": "ClusterIP", "cluster_ip": "10.96.100.3", "port": 8003},
        {"name": "exercise-service", "type": "ClusterIP", "cluster_ip": "10.96.100.4", "port": 8004},
        {"name": "progress-service", "type": "ClusterIP", "cluster_ip": "10.96.100.5", "port": 8005},
        {"name": "code-review-service", "type": "ClusterIP", "cluster_ip": "10.96.100.6", "port": 8006},
        {"name": "chat-service", "type": "ClusterIP", "cluster_ip": "10.96.100.7", "port": 8007},
    ],
    "kafka": [
        {"name": "kafka", "type": "ClusterIP", "cluster_ip": "10.96.200.1", "port": 9092},
    ],
    "postgres": [
        {"name": "postgres", "type": "ClusterIP", "cluster_ip": "10.96.200.2", "port": 5432},
    ],
}


async def get_pods(namespace: Optional[str] = None) -> dict[str, Any]:
    """Get all pods in the cluster, optionally filtered by namespace."""
    try:
        if KUBERNETES_AVAILABLE:
            config.load_kube_config()
            v1 = client.CoreV1Api()

            if namespace:
                pods = v1.list_namespaced_pod(namespace)
            else:
                pods = v1.list_pod_for_all_namespaces()

            pod_list = []
            for pod in pods.items:
                pod_list.append({
                    "name": pod.metadata.name,
                    "namespace": pod.metadata.namespace,
                    "ready": f"{sum(1 for cs in pod.status.container_statuses if cs.ready)}/{len(pod.status.container_statuses)}",
                    "status": pod.status.phase,
                    "restarts": sum(cs.restart_count for cs in (pod.status.container_statuses or [])),
                    "age": _calculate_age(pod.metadata.creation_timestamp.isoformat()),
                    "node": pod.spec.node_name,
                })

            return {"success": True, "pods": pod_list}
        else:
            # Mock mode
            if namespace:
                pods = _mock_pods.get(namespace, {})
            else:
                pods = {}
                for ns_pods in _mock_pods.values():
                    pods.update(ns_pods)

            return {
                "success": True,
                "pods": list(pods.values()),
                "mock": True,
                "note": "Running in mock mode - kubernetes client not available"
            }
    except Exception as e:
        logger.error(f"Failed to get pods: {e}")
        return {
            "success": False,
            "error": str(e),
            "pods": []
        }


async def get_services(namespace: Optional[str] = None) -> dict[str, Any]:
    """Get all services in the cluster, optionally filtered by namespace."""
    try:
        if KUBERNETES_AVAILABLE:
            config.load_kube_config()
            v1 = client.CoreV1Api()

            if namespace:
                services = v1.list_namespaced_service(namespace)
            else:
                services = v1.list_service_for_all_namespaces()

            service_list = []
            for svc in services.items:
                service_list.append({
                    "name": svc.metadata.name,
                    "namespace": svc.metadata.namespace,
                    "type": svc.spec.type,
                    "cluster_ip": svc.spec.cluster_ip,
                    "ports": [
                        {"port": p.port, "target_port": p.target_port, "protocol": p.protocol}
                        for p in (svc.spec.ports or [])
                    ],
                })

            return {"success": True, "services": service_list}
        else:
            # Mock mode
            if namespace:
                services = _mock_services.get(namespace, [])
            else:
                services = []
                for ns_services in _mock_services.values():
                    services.extend(ns_services)

            return {
                "success": True,
                "services": services,
                "mock": True,
                "note": "Running in mock mode - kubernetes client not available"
            }
    except Exception as e:
        logger.error(f"Failed to get services: {e}")
        return {
            "success": False,
            "error": str(e),
            "services": []
        }


async def get_pod_logs(
    pod_name: str,
    namespace: str,
    tail_lines: int = 100
) -> dict[str, Any]:
    """Get logs from a specific pod."""
    try:
        if KUBERNETES_AVAILABLE:
            config.load_kube_config()
            v1 = client.CoreV1Api()

            logs = v1.read_namespaced_pod_log(
                name=pod_name,
                namespace=namespace,
                tail_lines=tail_lines
            )

            return {
                "success": True,
                "pod": pod_name,
                "namespace": namespace,
                "logs": logs,
                "lines": len(logs.split('\n')) if logs else 0
            }
        else:
            # Mock mode - return sample logs
            sample_logs = f"""[Mock Logs for {pod_name}]
{datetime.utcnow().isoformat()} - Starting service...
{datetime.utcnow().isoformat()} - Dapr sidecar initialized
{datetime.utcnow().isoformat()} - Service listening on port 8000
{datetime.utcnow().isoformat()} - Health check passing
{datetime.utcnow().isoformat()} - Connected to Kafka
{datetime.utcnow().isoformat()} - Connected to PostgreSQL"""

            return {
                "success": True,
                "pod": pod_name,
                "namespace": namespace,
                "logs": sample_logs,
                "mock": True,
                "note": "Running in mock mode - kubernetes client not available"
            }
    except Exception as e:
        logger.error(f"Failed to get pod logs: {e}")
        return {
            "success": False,
            "error": str(e),
            "logs": ""
        }


async def get_cluster_info() -> dict[str, Any]:
    """Get cluster information and health status."""
    try:
        if KUBERNETES_AVAILABLE:
            config.load_kube_config()
            v1 = client.CoreV1Api()

            # Get nodes
            nodes = v1.list_node()
            node_info = []
            for node in nodes.items:
                node_info.append({
                    "name": node.metadata.name,
                    "status": "Ready" if any(cs.type == "Ready" and cs.status == "True" for cs in node.status.conditions) else "NotReady",
                    "version": node.status.node_info.kubelet_version,
                })

            # Get namespaces
            namespaces = [ns.metadata.name for ns in v1.list_namespace().items]

            return {
                "success": True,
                "nodes": node_info,
                "namespaces": namespaces,
                "total_nodes": len(node_info),
                "cluster_status": "Healthy" if node_info else "Unknown"
            }
        else:
            # Mock mode
            return {
                "success": True,
                "nodes": [
                    {"name": "minikube", "status": "Ready", "version": "v1.28.0"}
                ],
                "namespaces": ["learnflow", "kafka", "postgres", "default"],
                "total_nodes": 1,
                "cluster_status": "Healthy",
                "mock": True,
                "note": "Running in mock mode - kubernetes client not available"
            }
    except Exception as e:
        logger.error(f"Failed to get cluster info: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def _calculate_age(created_at: str) -> str:
    """Calculate a human-readable age from timestamp."""
    try:
        created = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        now = datetime.utcnow().replace(tzinfo=created.tzinfo)
        delta = now - created

        if delta < timedelta(minutes=1):
            return f"{delta.seconds}s"
        elif delta < timedelta(hours=1):
            return f"{delta.seconds // 60}m"
        elif delta < timedelta(days=1):
            return f"{delta.seconds // 3600}h"
        else:
            return f"{delta.days}d"
    except:
        return "unknown"


# Create server
server = Server("learnflow-k8s-operations")


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools."""
    return [
        Tool(
            name="get_pods",
            description="Get all pods in the cluster, optionally filtered by namespace",
            inputSchema={
                "type": "object",
                "properties": {
                    "namespace": {
                        "type": "string",
                        "description": "Optional namespace filter (e.g., 'learnflow', 'kafka', 'postgres')"
                    }
                }
            }
        ),
        Tool(
            name="get_services",
            description="Get all services in the cluster, optionally filtered by namespace",
            inputSchema={
                "type": "object",
                "properties": {
                    "namespace": {
                        "type": "string",
                        "description": "Optional namespace filter (e.g., 'learnflow', 'kafka', 'postgres')"
                    }
                }
            }
        ),
        Tool(
            name="get_pod_logs",
            description="Get logs from a specific pod",
            inputSchema={
                "type": "object",
                "properties": {
                    "pod_name": {
                        "type": "string",
                        "description": "The pod name"
                    },
                    "namespace": {
                        "type": "string",
                        "description": "The pod namespace"
                    },
                    "tail_lines": {
                        "type": "integer",
                        "description": "Number of recent log lines to retrieve (default: 100)",
                        "default": 100
                    }
                },
                "required": ["pod_name", "namespace"]
            }
        ),
        Tool(
            name="get_cluster_info",
            description="Get cluster information and health status",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="check_service_health",
            description="Check the health status of LearnFlow services",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """Handle tool calls."""
    if name == "get_pods":
        result = await get_pods(arguments.get("namespace"))
        return [TextContent(json.dumps(result, indent=2))]

    elif name == "get_services":
        result = await get_services(arguments.get("namespace"))
        return [TextContent(json.dumps(result, indent=2))]

    elif name == "get_pod_logs":
        result = await get_pod_logs(
            pod_name=arguments["pod_name"],
            namespace=arguments["namespace"],
            tail_lines=arguments.get("tail_lines", 100)
        )
        return [TextContent(json.dumps(result, indent=2))]

    elif name == "get_cluster_info":
        result = await get_cluster_info()
        return [TextContent(json.dumps(result, indent=2))]

    elif name == "check_service_health":
        # Combined health check for all LearnFlow services
        pods_result = await get_pods("learnflow")
        services_result = await get_services("learnflow")

        health_status = {
            "success": True,
            "timestamp": datetime.utcnow().isoformat(),
            "pods": pods_result.get("pods", []),
            "services": services_result.get("services", []),
            "summary": {
                "total_pods": len(pods_result.get("pods", [])),
                "running_pods": sum(1 for p in pods_result.get("pods", []) if p.get("status") == "Running"),
                "total_services": len(services_result.get("services", [])),
            }
        }

        return [TextContent(json.dumps(health_status, indent=2))]

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
