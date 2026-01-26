"""MCP requirements for LearnFlow servers."""

from mcp import types
from typing import Any
import os
import asyncio
import subprocess
import sys

# Check if mcp is installed
try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import Tool, TextContent
except ImportError:
    print("Installing MCP SDK...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "mcp", "-q"])
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import Tool, TextContent

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://learnflow:learnflow123@localhost:5432/learnflow"
)
