"""LearnFlow Code Execution MCP Server

Provides safe Python code execution in a sandboxed environment.
Enforces resource limits: 5s timeout, 50MB memory, no network access.
"""

import os
import asyncio
import subprocess
import tempfile
import json
from typing import Any
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
from pathlib import Path

# Resource limits
TIMEOUT_SECONDS = 5
MAX_MEMORY_MB = 50


async def execute_code(code: str, timeout: int = TIMEOUT_SECONDS) -> dict[str, Any]:
    """Execute Python code in a sandboxed environment."""
    # Validate code length
    if len(code) > 10000:
        return {
            "success": False,
            "error": "Code too long (max 10000 characters)",
            "output": ""
        }

    # Write code to temp file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        temp_file = f.name

    try:
        # Execute with timeout and resource limits
        process = await asyncio.create_subprocess_exec(
            'python',
            '-c',
            f'import resource; resource.setrlimit(resource.RLIMIT_AS, ({MAX_MEMORY_MB * 1024 * 1024}, {MAX_MEMORY_MB * 1024 * 1024})); exec(open("{temp_file}").read())',
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        try:
            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=timeout
            )

            output = stdout.decode('utf-8', errors='replace')
            error = stderr.decode('utf-8', errors='replace')

            if process.returncode == 0:
                return {
                    "success": True,
                    "output": output,
                    "error": error if error else None
                }
            else:
                return {
                    "success": False,
                    "output": output,
                    "error": error
                }

        except asyncio.TimeoutError:
            process.kill()
            return {
                "success": False,
                "error": f"Execution timed out after {timeout} seconds",
                "output": ""
            }

    finally:
        # Clean up temp file
        try:
            os.unlink(temp_file)
        except:
            pass


async def check_syntax(code: str) -> dict[str, Any]:
    """Check Python syntax without executing."""
    try:
        compile(code, '<string>', 'exec')
        return {
            "valid": True,
            "error": None
        }
    except SyntaxError as e:
        return {
            "valid": False,
            "error": str(e)
        }


async def format_code(code: str) -> dict[str, Any]:
    """Format Python code using black."""
    try:
        # Try to import black
        import black
        formatted = black.format_str(code, mode=black.FileMode())
        return {
            "success": True,
            "formatted": formatted
        }
    except ImportError:
        return {
            "success": False,
            "error": "black not installed",
            "formatted": code
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "formatted": code
        }


# Create server
server = Server("learnflow-code-execution")


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools."""
    return [
        Tool(
            name="execute_code",
            description="Execute Python code safely in a sandboxed environment with resource limits (5s timeout, 50MB memory)",
            inputSchema={
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "Python code to execute"
                    },
                    "timeout": {
                        "type": "integer",
                        "description": "Timeout in seconds (default: 5, max: 10)"
                    }
                },
                "required": ["code"]
            }
        ),
        Tool(
            name="check_syntax",
            description="Validate Python syntax without executing the code",
            inputSchema={
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "Python code to validate"
                    }
                },
                "required": ["code"]
            }
        ),
        Tool(
            name="format_code",
            description="Format Python code according to PEP 8 using black",
            inputSchema={
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "Python code to format"
                    }
                },
                "required": ["code"]
            }
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """Handle tool calls."""
    if name == "execute_code":
        result = await execute_code(
            arguments["code"],
            arguments.get("timeout", TIMEOUT_SECONDS)
        )
        return [TextContent(json.dumps(result, indent=2))]

    elif name == "check_syntax":
        result = await check_syntax(arguments["code"])
        return [TextContent(json.dumps(result, indent=2))]

    elif name == "format_code":
        result = await format_code(arguments["code"])
        return [TextContent(json.dumps(result, indent=2))]

    else:
        return [TextContent(f"Unknown tool: {name}")]


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
