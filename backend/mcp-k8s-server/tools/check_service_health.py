"""
check_service_health: Check if a Kubernetes service is healthy
Returns service endpoint and pod status.
"""
import subprocess
import json
from typing import Dict, Any

def check_service_health(service_name: str, namespace: str = "learnflow") -> Dict[str, Any]:
    """
    Check if a service is healthy.

    Args:
        service_name: Name of the service
        namespace: Kubernetes namespace (default: learnflow)

    Returns:
    - status: success/error
    - healthy: bool
    - endpoints: list of ready endpoints
    - pod_status: list of pod statuses

    Token-efficient: Returns summary only.
    """
    try:
        # Get service endpoints
        cmd = ["kubectl", "get", "endpoints", service_name, "-n", namespace, "-o", "json"]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)

        if result.returncode != 0:
            return {
                "status": "error",
                "service_name": service_name,
                "namespace": namespace,
                "error": result.stderr[:200] if result.stderr else "endpoints not found",
            }

        data = json.loads(result.stdout)

        # Get ready endpoints
        subsets = data.get("subsets", [])
        ready_endpoints = []
        for subset in subsets:
            for address in subset.get("addresses", []):
                ready_endpoints.append(address.get("ip", "unknown"))

        # Get selector from service
        cmd = ["kubectl", "get", "service", service_name, "-n", namespace, "-o", "json"]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)

        pod_status = []
        if result.returncode == 0:
            svc_data = json.loads(result.stdout)
            selector = svc_data.get("spec", {}).get("selector", {})

            if selector:
                # Get pods matching selector
                label_selector = ",".join([f"{k}={v}" for k, v in selector.items()])

                cmd = ["kubectl", "get", "pods", "-n", namespace, "-l", label_selector, "-o", "json"]
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)

                if result.returncode == 0:
                    pods_data = json.loads(result.stdout)
                    for item in pods_data.get("items", []):
                        metadata = item.get("metadata", {})
                        status = item.get("status", {})
                        pod_status.append({
                            "name": metadata.get("name", "unknown"),
                            "ready": status.get("phase", "Unknown") == "Running",
                            "phase": status.get("phase", "Unknown"),
                        })

        healthy = len(ready_endpoints) > 0 and any(p.get("ready", False) for p in pod_status)

        return {
            "status": "success",
            "service_name": service_name,
            "namespace": namespace,
            "healthy": healthy,
            "ready_endpoints": len(ready_endpoints),
            "pods_running": sum(1 for p in pod_status if p.get("ready")),
            "pod_status": pod_status[:10],  # Limit to 10 pods
        }

    except Exception as e:
        return {
            "status": "error",
            "service_name": service_name,
            "namespace": namespace,
            "error": str(e)[:100],
        }

__all__ = ["check_service_health"]
