"""HTTP wrapper for Kubernetes Operations MCP Server

Allows backend services to call MCP tools via HTTP instead of stdio.
"""

import os
import asyncio
import json
from typing import Any, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="K8s Operations MCP Server")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Import the main module for k8s operations
from main import get_pods, get_services, get_pod_logs, get_cluster_info


@app.get("/")
async def root():
    return {
        "service": "k8s-operations-mcp",
        "status": "running",
        "endpoints": [
            "/health",
            "/tools/get_pods",
            "/tools/get_services",
            "/tools/get_pod_logs",
            "/tools/get_cluster_info",
            "/tools/check_service_health"
        ]
    }


@app.get("/health")
async def health():
    """Health check endpoint for Kubernetes probes."""
    return {"status": "healthy"}


@app.get("/tools/get_pods")
async def http_get_pods(namespace: Optional[str] = None):
    """HTTP endpoint for getting pods."""
    result = await get_pods(namespace)
    return result


@app.get("/tools/get_services")
async def http_get_services(namespace: Optional[str] = None):
    """HTTP endpoint for getting services."""
    result = await get_services(namespace)
    return result


@app.get("/tools/get_pod_logs")
async def http_get_pod_logs(pod_name: str, namespace: str, tail_lines: int = 100):
    """HTTP endpoint for getting pod logs."""
    result = await get_pod_logs(pod_name, namespace, tail_lines)
    return result


@app.get("/tools/get_cluster_info")
async def http_get_cluster_info():
    """HTTP endpoint for getting cluster info."""
    result = await get_cluster_info()
    return result


@app.get("/tools/check_service_health")
async def http_check_service_health():
    """HTTP endpoint for checking service health."""
    from main import get_pods, get_services

    pods_result = await get_pods("learnflow")
    services_result = await get_services("learnflow")

    from datetime import datetime
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

    return health_status


if __name__ == "__main__":
    import uvicorn
    PORT = int(os.getenv("PORT", "9003"))
    uvicorn.run(app, host="0.0.0.0", port=PORT)
