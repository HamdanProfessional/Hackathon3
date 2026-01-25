"""
mcp-code-exec-server - MCP Server for LearnFlow Code Execution
Follows Code Execution Pattern for token efficiency.
Provides sandboxed Python code execution with resource constraints.
"""
import sys
import os

# Add parent directory to path for direct execution
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mcp.server import FastMCP
from config import settings_exec, settings_security
from tools import execute_code, test_with_test_cases

# Create MCP server
mcp = FastMCP("mcp-code-exec-server")

# Register tools
@mcp.tool()
def execute_code_tool(code: str, timeout: int = 5, memory_limit: int = 50) -> dict:
    """Execute Python code in sandboxed environment."""
    return execute_code.execute_code(code, timeout, memory_limit)

@mcp.tool()
def test_with_test_cases_tool(code: str, test_cases: list) -> dict:
    """Test code against provided test cases."""
    return test_with_test_cases.test_with_test_cases(code, test_cases)

if __name__ == "__main__":
    mcp.run()
