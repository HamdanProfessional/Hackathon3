"""
describe_pod: Get detailed pod information
Returns pod details with container status summary.
"""
import subprocess
import json
from typing import Dict, Any

def describe_pod(pod_name: str, namespace: str = "learnflow") -> Dict[str, Any]:
    """
    Get detailed pod information.

    Args:
        pod_name: Name of the pod
        namespace: Kubernetes namespace (default: learnflow)

    Returns:
    - status: success/error
    - pod: dict with pod details
    - containers: list of container summaries

    Token-efficient: Returns summary, not full describe output.
    """
    try:
        cmd = ["kubectl", "get", "pod", pod_name, "-n", namespace, "-o", "json"]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)

        if result.returncode != 0:
            return {
                "status": "error",
                "pod_name": pod_name,
                "namespace": namespace,
                "error": result.stderr[:200] if result.stderr else "pod not found",
            }

        data = json.loads(result.stdout)
        metadata = data.get("metadata", {})
        spec = data.get("spec", {})
        status = data.get("status", {})

        # Get container statuses
        container_statuses = []
        for cs in status.get("containerStatuses", []):
            container_statuses.append({
                "name": cs.get("name", "unknown"),
                "ready": cs.get("ready", False),
                "restart_count": cs.get("restartCount", 0),
                "state": list(cs.get("state", {}).keys())[0] if cs.get("state") else "unknown",
                "image": cs.get("image", "unknown")[:50],  # Truncate long image names
            })

        return {
            "status": "success",
            "pod_name": pod_name,
            "namespace": namespace,
            "pod": {
                "name": metadata.get("name", "unknown"),
                "node": spec.get("nodeName", "unknown"),
                "phase": status.get("phase", "Unknown"),
                "pod_ip": status.get("podIP", "unknown"),
                "created_at": metadata.get("creationTimestamp", "unknown"),
                "labels": metadata.get("labels", {}),
            },
            "containers": container_statuses[:5],  # Limit to 5 containers
        }

    except Exception as e:
        return {
            "status": "error",
            "pod_name": pod_name,
            "namespace": namespace,
            "error": str(e)[:100],
        }

__all__ = ["describe_pod"]
