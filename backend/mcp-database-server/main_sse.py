"""
mcp-database-server - MCP Server for LearnFlow Database Access (SSE Transport)
Runs as HTTP service using FastAPI + uvicorn with SSE transport.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mcp.server import FastMCP
from mcp.server.sse import SseServerTransport
from mcp.server.stdio import stdio_server
import uvicorn
from config import settings_db
from tools import get_student_progress, get_code_submissions
from tools import get_exercise_history, get_struggling_students, update_progress

# Create MCP server
mcp = FastMCP("mcp-database-server")

# Register tools
@mcp.tool()
async def get_student_progress_tool(student_id: str) -> dict:
    """Get student learning progress summary (minimal data for token efficiency)."""
    return await get_student_progress.get_student_progress(student_id)

@mcp.tool()
async def get_code_submissions_tool(student_id: str, limit: int = 10) -> dict:
    """Get recent code submissions for a student."""
    return await get_code_submissions.get_code_submissions(student_id, limit)

@mcp.tool()
async def get_exercise_history_tool(student_id: str, exercise_id: str = None) -> dict:
    """Get exercise attempt history for a student."""
    return await get_exercise_history.get_exercise_history(student_id, exercise_id)

@mcp.tool()
async def get_struggling_students_tool(class_id: str = None, threshold: float = 50.0) -> dict:
    """Get list of struggling students based on mastery threshold."""
    return await get_struggling_students.get_struggling_students(class_id, threshold)

@mcp.tool()
async def update_progress_tool(student_id: str, module_id: str, mastery_delta: float) -> dict:
    """Update student progress (write operation with validation)."""
    return await update_progress.update_progress(student_id, module_id, mastery_delta)

# For local development: use stdio
# For production: use SSE (set via env)
if __name__ == "__main__":
    transport = os.getenv("MCP_TRANSPORT", "stdio")
    port = int(os.getenv("PORT", "3001"))

    if transport == "sse":
        # Run as SSE server (for production/Kubernetes)
        from starlette.applications import Starlette
        from starlette.routing import Route
        from starlette.responses import Response

        # Create SSE transport
        sse_transport = SseServerTransport("/messages")

        # Create Starlette app with MCP SSE endpoint
        app = Starlette(debug=False)

        # Mount SSE server
        app.mount("/sse", mcp.create_sse_server(sse_transport))

        # Health check
        @app.route("/health")
        async def health(request):
            return Response("OK")

        # Root
        @app.route("/")
        async def root(request):
            return Response({"server": "mcp-database-server", "transport": "sse", "tools": 5})

        print(f"Starting MCP Database Server with SSE transport on port {port}...")
        uvicorn.run(app, host="0.0.0.0", port=port)
    else:
        # Run as stdio server (for local testing)
        print("Starting MCP Database Server with stdio transport...")
        mcp.run()
