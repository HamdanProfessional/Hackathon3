"""
mcp-database-server - MCP Server for LearnFlow Database Access
Follows Code Execution Pattern for token efficiency.
Provides tools for querying student progress, code submissions, and exercise history.
"""
import sys
import os

# Add parent directory to path for direct execution
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mcp.server import FastMCP
from config import settings_db
from tools import get_student_progress, get_code_submissions
from tools import get_exercise_history, get_struggling_students, update_progress

# Create MCP server using FastMCP
mcp = FastMCP("mcp-database-server")

# Register tools using the decorator pattern
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

if __name__ == "__main__":
    mcp.run()
