"""
Configuration for MCP Kubernetes Server
"""
import os
from dataclasses import dataclass

@dataclass
class K8sSettings:
    """Kubernetes client settings."""
    kubeconfig_path: str = os.getenv("KUBECONFIG", "~/.kube/config")
    default_namespace: str = os.getenv("DEFAULT_NAMESPACE", "learnflow")
    context_name: str = os.getenv("K8S_CONTEXT", "minikube")

@dataclass
class ServerSettings:
    """Server configuration."""
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    command_timeout: int = int(os.getenv("COMMAND_TIMEOUT", "10"))

settings_k8s = K8sSettings()
settings_server = ServerSettings()

__all__ = ["settings_k8s", "settings_server"]
