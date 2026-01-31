"""HTTP wrapper for Database MCP Server

Allows backend services to call MCP tools via HTTP instead of stdio.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Any

app = FastAPI(title="Database MCP Server")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Mock data (same as database-mcp/main.py)
PROGRESS_DATA = {
    "123e4567-e89b-12d3-a456-426614174000": [
        {"module_id": 1, "module_name": "Python Basics", "mastery_score": 25.0, "mastery_level": "beginner", "exercises_completed": 3, "total_exercises": 10},
        {"module_id": 2, "module_name": "Control Flow", "mastery_score": 0.0, "mastery_level": "beginner", "exercises_completed": 0, "total_exercises": 8},
    ],
}

EXERCISES = {
    1: {"id": 1, "title": "Hello World", "description": "Your first Python program", "difficulty": "beginner", "module_id": 1},
    2: {"id": 2, "title": "Variables", "description": "Store and print a name", "difficulty": "beginner", "module_id": 1},
    3: {"id": 3, "title": "For Loop", "description": "Print numbers 1-5", "difficulty": "beginner", "module_id": 2},
}

STRUGGLE_ALERTS = [
    {"student_id": "123e4567-e89b-12d3-a456-426614174000", "alert_type": "repeated_errors", "topic": "SyntaxError", "message": "Same error 3 times"},
]

CLASS_OVERVIEW = {
    "total_students": 28,
    "active_students": 15,
    "struggling_students": 3,
    "average_mastery": 32.5,
}


@app.get("/")
async def root():
    return {"service": "database-mcp", "status": "running", "endpoints": ["/health", "/tools/get_student_progress", "/tools/get_exercises", "/tools/submit_exercise", "/tools/get_class_overview"]}


@app.get("/health")
async def health():
    """Health check endpoint for Kubernetes probes."""
    return {"status": "healthy"}


@app.get("/tools/get_student_progress")
async def get_student_progress(student_id: str):
    """Get student progress across all modules."""
    return {
        "student_id": student_id,
        "modules": PROGRESS_DATA.get(student_id, []),
        "overall_mastery": sum(m["mastery_score"] for m in PROGRESS_DATA.get(student_id, [])) / 8,
        "streak_days": 5,
    }


@app.get("/tools/get_exercises")
async def get_exercises(module_id: int = None):
    """Get exercises catalog."""
    exercises = list(EXERCISES.values())
    if module_id:
        exercises = [e for e in exercises if e["module_id"] == module_id]
    return exercises


@app.post("/tools/submit_exercise")
async def submit_exercise(request: dict):
    """Submit exercise for grading."""
    exercise = EXERCISES.get(request.get("exercise_id"))
    if not exercise:
        return {"error": "Exercise not found"}

    # Simple validation
    code = request.get("code", "")
    passed = len(code.strip()) > 10 and "print" in code

    return {
        "exercise_id": request.get("exercise_id"),
        "passed": passed,
        "feedback": "Great job!" if passed else "Keep trying!",
    }


@app.get("/tools/get_class_overview")
async def get_class_overview():
    """Get teacher dashboard data."""
    return CLASS_OVERVIEW


@app.get("/tools/get_struggle_alerts")
async def get_struggle_alerts():
    """Get students needing help."""
    return STRUGGLE_ALERTS


if __name__ == "__main__":
    import uvicorn
    PORT = int(os.getenv("PORT", "9001"))
    uvicorn.run(app, host="0.0.0.0", port=PORT)
