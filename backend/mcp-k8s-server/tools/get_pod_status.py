"""
get_pod_status: Query Kubernetes pod status
Returns summarized pod information for token efficiency.
"""
import subprocess
import json
from typing import Dict, Any, List

def get_pod_status(namespace: str = "learnflow", label_selector: str = None) -> Dict[str, Any]:
    """
    Get pod status for a namespace.

    Args:
        namespace: Kubernetes namespace (default: learnflow)
        label_selector: Optional label selector to filter pods

    Returns:
    - status: success/error
    - namespace: str
    - pods: list of pod summaries (name, ready, status, age)

    Token-efficient: Returns minimal pod data only.
    """
    try:
        cmd = ["kubectl", "get", "pods", "-n", namespace, "-o", "json"]

        if label_selector:
            cmd.extend(["-l", label_selector])

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode != 0:
            return {
                "status": "error",
                "namespace": namespace,
                "error": result.stderr[:200] if result.stderr else "kubectl command failed",
            }

        data = json.loads(result.stdout)

        pods = []
        for item in data.get("items", []):
            metadata = item.get("metadata", {})
            status = item.get("status", {})

            # Get container statuses
            container_statuses = status.get("containerStatuses", [])
            ready_count = sum(1 for c in container_statuses if c.get("ready", False))
            total_count = len(container_statuses)

            pods.append({
                "name": metadata.get("name", "unknown"),
                "ready": f"{ready_count}/{total_count}",
                "status": status.get("phase", "Unknown"),
                "restarts": sum(c.get("restartCount", 0) for c in container_statuses),
            })

        return {
            "status": "success",
            "namespace": namespace,
            "pod_count": len(pods),
            "pods": pods[:50],  # Limit to 50 pods
        }

    except subprocess.TimeoutExpired:
        return {
            "status": "error",
            "namespace": namespace,
            "error": "kubectl command timed out",
        }
    except Exception as e:
        return {
            "status": "error",
            "namespace": namespace,
            "error": str(e)[:100],
        }

__all__ = ["get_pod_status"]
