"""
get_service_logs: Retrieve pod logs
Returns limited log lines for token efficiency.
"""
import subprocess
from typing import Dict, Any

def get_service_logs(pod_name: str, namespace: str = "learnflow", tail_lines: int = 50) -> Dict[str, Any]:
    """
    Get logs from a pod.

    Args:
        pod_name: Name of the pod
        namespace: Kubernetes namespace (default: learnflow)
        tail_lines: Number of lines to retrieve (default 50, max 500)

    Returns:
    - status: success/error
    - pod_name: str
    - logs: str (limited lines)
    - line_count: int

    Token-efficient: Returns only requested tail lines.
    """
    try:
        # Limit tail_lines to prevent token bloat
        tail_lines = min(tail_lines, 500)

        cmd = [
            "kubectl", "logs",
            pod_name,
            "-n", namespace,
            "--tail", str(tail_lines)
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode != 0:
            return {
                "status": "error",
                "pod_name": pod_name,
                "namespace": namespace,
                "error": result.stderr[:200] if result.stderr else "kubectl logs failed",
            }

        logs = result.stdout

        return {
            "status": "success",
            "pod_name": pod_name,
            "namespace": namespace,
            "line_count": len(logs.splitlines()),
            "logs": logs[-5000:] if len(logs) > 5000 else logs,  # Limit total characters
        }

    except subprocess.TimeoutExpired:
        return {
            "status": "error",
            "pod_name": pod_name,
            "namespace": namespace,
            "error": "kubectl command timed out",
        }
    except Exception as e:
        return {
            "status": "error",
            "pod_name": pod_name,
            "namespace": namespace,
            "error": str(e)[:100],
        }

__all__ = ["get_service_logs"]
