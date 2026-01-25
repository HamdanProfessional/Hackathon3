"""
Configuration for MCP Code Execution Server
"""
import os
import tempfile
from dataclasses import dataclass, field

@dataclass
class ExecutionSettings:
    """Code execution settings."""
    default_timeout: int = int(os.getenv("DEFAULT_TIMEOUT", "5"))  # seconds
    max_timeout: int = int(os.getenv("MAX_TIMEOUT", "10"))  # seconds
    default_memory_limit: int = int(os.getenv("DEFAULT_MEMORY_LIMIT", "50"))  # MB
    max_memory_limit: int = int(os.getenv("MAX_MEMORY_LIMIT", "100"))  # MB
    temp_dir: str = tempfile.gettempdir()
    python_path: str = os.getenv("PYTHON_PATH", "python3")

@dataclass
class SecuritySettings:
    """Security constraints."""
    allow_network: bool = os.getenv("ALLOW_NETWORK", "false").lower() == "true"
    allow_file_access: bool = os.getenv("ALLOW_FILE_ACCESS", "false").lower() == "true"
    allowed_modules: list = field(default_factory=lambda: ["math", "random", "datetime", "json", "re"])

settings_exec = ExecutionSettings()
settings_security = SecuritySettings()

__all__ = ["settings_exec", "settings_security"]
