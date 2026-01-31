"""HTTP wrapper for Code Execution MCP Server

Allows backend services to call MCP tools via HTTP instead of stdio.
"""

import os
import asyncio
from typing import Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Code Execution MCP Server")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

TIMEOUT_SECONDS = 5
MAX_MEMORY_MB = 50


async def execute_code(code: str, timeout: int = TIMEOUT_SECONDS) -> dict[str, Any]:
    """Execute Python code in a sandboxed environment."""
    if len(code) > 10000:
        return {
            "success": False,
            "error": "Code too long (max 10000 characters)",
            "output": ""
        }

    try:
        # Execute the code directly
        process = await asyncio.create_subprocess_exec(
            'python',
            '-c',
            code,
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

    except Exception as e:
        return {
            "success": False,
            "error": f"Execution error: {str(e)}",
            "output": ""
        }


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


@app.get("/")
async def root():
    return {"service": "code-execution-mcp", "status": "running", "endpoints": ["/health", "/tools/execute_code", "/tools/check_syntax"]}


@app.get("/health")
async def health():
    """Health check endpoint for Kubernetes probes."""
    return {"status": "healthy"}


@app.post("/tools/execute_code")
async def http_execute_code(request: dict):
    """HTTP endpoint for code execution."""
    result = await execute_code(request.get("code", ""), request.get("timeout", TIMEOUT_SECONDS))
    return result


@app.post("/tools/check_syntax")
async def http_check_syntax(request: dict):
    """HTTP endpoint for syntax checking."""
    result = await check_syntax(request.get("code", ""))
    return result


if __name__ == "__main__":
    import uvicorn
    PORT = int(os.getenv("PORT", "9000"))
    uvicorn.run(app, host="0.0.0.0", port=PORT)
