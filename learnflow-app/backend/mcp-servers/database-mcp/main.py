"""LearnFlow Database MCP Server

Provides real-time access to LearnFlow PostgreSQL database for AI agents.
Allows AI to query student progress, exercises, submissions, and analytics.
"""

import os
import asyncio
from typing import Any
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Mock data for now (would connect to PostgreSQL in production)
STUDENTS = {
    "123e4567-e89b-12d3-a456-426614174000": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Demo Student",
        "email": "student@example.com",
        "role": "student",
        "created_at": "2026-01-01T00:00:00Z"
    }
}

PROGRESS_DATA = {
    "123e4567-e89b-12d3-a456-426614174000": [
        {"module_id": 1, "module_name": "Python Basics", "mastery_score": 25.0, "mastery_level": "beginner", "exercises_completed": 3, "total_exercises": 10},
        {"module_id": 2, "module_name": "Control Flow", "mastery_score": 0.0, "mastery_level": "beginner", "exercises_completed": 0, "total_exercises": 8},
        {"module_id": 3, "module_name": "Functions", "mastery_score": 0.0, "mastery_level": "beginner", "exercises_completed": 0, "total_exercises": 12},
        {"module_id": 4, "module_name": "Data Structures", "mastery_score": 0.0, "mastery_level": "beginner", "exercises_completed": 0, "total_exercises": 14},
        {"module_id": 5, "module_name": "File Operations", "mastery_score": 0.0, "mastery_level": "beginner", "exercises_completed": 0, "total_exercises": 9},
        {"module_id": 6, "module_name": "Error Handling", "mastery_score": 0.0, "mastery_level": "beginner", "exercises_completed": 0, "total_exercises": 10},
        {"module_id": 7, "module_name": "OOP", "mastery_score": 0.0, "mastery_level": "beginner", "exercises_completed": 0, "total_exercises": 16},
        {"module_id": 8, "module_name": "Advanced Python", "mastery_score": 0.0, "mastery_level": "beginner", "exercises_completed": 0, "total_exercises": 15},
    ]
}

EXERCISES = {
    1: {"id": 1, "title": "Hello World", "description": "Your first Python program", "difficulty": "beginner", "module_id": 1},
    2: {"id": 2, "title": "Variables", "description": "Store and print a name", "difficulty": "beginner", "module_id": 1},
    3: {"id": 3, "title": "For Loop", "description": "Print numbers 1-5", "difficulty": "beginner", "module_id": 2},
    4: {"id": 4, "title": "Functions", "description": "Define a simple function", "difficulty": "intermediate", "module_id": 3},
}

STRUGGLE_ALERTS = [
    {"student_id": "123e4567-e89b-12d3-a456-426614174000", "alert_type": "repeated_errors", "topic": "SyntaxError", "message": "Same error 3 times", "timestamp": "2026-01-26T10:00:00Z"},
]

CLASS_OVERVIEW = {
    "total_students": 28,
    "active_students": 15,
    "struggling_students": 3,
    "average_mastery": 32.5,
}

# Create server
server = Server("learnflow-database")


async def get_student_progress(student_id: str) -> dict[str, Any]:
    """Get student progress across all modules."""
    return {
        "student_id": student_id,
        "modules": PROGRESS_DATA.get(student_id, []),
        "overall_mastery": sum(m["mastery_score"] for m in PROGRESS_DATA.get(student_id, [])) / 8,
        "streak_days": 5,
    }


async def get_exercises(module_id: int = None) -> list[dict[str, Any]]:
    """Get exercises by module."""
    exercises = list(EXERCISES.values())
    if module_id:
        exercises = [e for e in exercises if e["module_id"] == module_id]
    return exercises


async def submit_exercise(student_id: str, exercise_id: int, code: str) -> dict[str, Any]:
    """Submit exercise for grading."""
    exercise = EXERCISES.get(exercise_id)
    if not exercise:
        return {"error": "Exercise not found"}

    # Simple validation
    passed = len(code.strip()) > 10 and "print" in code

    # Update progress
    if passed:
        progress = PROGRESS_DATA.get(student_id, [])
        for mod in progress:
            if mod["module_id"] == exercise["module_id"]:
                mod["exercises_completed"] += 1
                mod["mastery_score"] = min(100, mod["mastery_score"] + 5)

    return {
        "exercise_id": exercise_id,
        "passed": passed,
        "feedback": "Great job!" if passed else "Keep trying!",
    }


async def get_class_overview() -> dict[str, Any]:
    """Get teacher dashboard data."""
    return CLASS_OVERVIEW


async def get_struggle_alerts() -> list[dict[str, Any]]:
    """Get students needing help."""
    return STRUGGLE_ALERTS


# Register tools
@server.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools."""
    return [
        Tool(
            name="get_student_progress",
            description="Get a student's progress across all modules including mastery scores and exercise completion",
            inputSchema={
                "type": "object",
                "properties": {
                    "student_id": {
                        "type": "string",
                        "description": "Student UUID"
                    }
                },
                "required": ["student_id"]
            }
        ),
        Tool(
            name="get_exercises",
            description="Get exercises catalog, optionally filtered by module ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "module_id": {
                        "type": "integer",
                        "description": "Optional module ID to filter exercises"
                    }
                }
            }
        ),
        Tool(
            name="submit_exercise",
            description="Submit an exercise for auto-grading",
            inputSchema={
                "type": "object",
                "properties": {
                    "student_id": {"type": "string"},
                    "exercise_id": {"type": "integer"},
                    "code": {"type": "string"}
                },
                "required": ["student_id", "exercise_id", "code"]
            }
        ),
        Tool(
            name="get_class_overview",
            description="Get teacher dashboard statistics for the entire class",
            inputSchema={"type": "object", "properties": {}}
        ),
        Tool(
            name="get_struggle_alerts",
            description="Get alerts for students who are struggling and need help",
            inputSchema={"type": "object", "properties": {}}
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """Handle tool calls."""
    if name == "get_student_progress":
        result = await get_student_progress(arguments["student_id"])
        return [TextContent(f"{result}")]

    elif name == "get_exercises":
        result = await get_exercises(arguments.get("module_id"))
        return [TextContent(f"{result}")]

    elif name == "submit_exercise":
        result = await submit_exercise(
            arguments["student_id"],
            arguments["exercise_id"],
            arguments["code"]
        )
        return [TextContent(f"{result}")]

    elif name == "get_class_overview":
        result = await get_class_overview()
        return [TextContent(f"{result}")]

    elif name == "get_struggle_alerts":
        result = await get_struggle_alerts()
        return [TextContent(f"{result}")]

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
