"""Progress Service - Tracks student mastery and learning progress.

Calculates mastery scores and tracks learning streaks.
"""

import os
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from shared.models import (
    HealthResponse, ChatRequest, ChatResponse,
    ProgressData, MasteryLevel, ModuleProgress
)


SERVICE_NAME = "progress-service"
SERVICE_VERSION = "1.0.0"
PORT = int(os.getenv("PORT", "8005"))

app = FastAPI(title="LearnFlow Progress Service", version=SERVICE_VERSION)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


# Mock database
student_progress = {}
student_modules = {
    1: ModuleProgress(module_id=1, module_name="Python Basics", mastery_score=25.0, mastery_level=MasteryLevel.BEGINNER, exercises_completed=3, total_exercises=10),
    2: ModuleProgress(module_id=2, module_name="Control Flow", mastery_score=0.0, mastery_level=MasteryLevel.BEGINNER, exercises_completed=0, total_exercises=8),
    3: ModuleProgress(module_id=3, module_name="Functions", mastery_score=0.0, mastery_level=MasteryLevel.BEGINNER, exercises_completed=0, total_exercises=12),
    4: ModuleProgress(module_id=4, module_name="Data Structures", mastery_score=0.0, mastery_level=MasteryLevel.BEGINNER, exercises_completed=0, total_exercises=14),
    5: ModuleProgress(module_id=5, module_name="File Operations", mastery_score=0.0, mastery_level=MasteryLevel.BEGINNER, exercises_completed=0, total_exercises=9),
    6: ModuleProgress(module_id=6, module_name="Error Handling", mastery_score=0.0, mastery_level=MasteryLevel.BEGINNER, exercises_completed=0, total_exercises=10),
    7: ModuleProgress(module_id=7, module_name="OOP", mastery_score=0.0, mastery_level=MasteryLevel.BEGINNER, exercises_completed=0, total_exercises=16),
    8: ModuleProgress(module_id=8, module_name="Advanced Python", mastery_score=0.0, mastery_level=MasteryLevel.BEGINNER, exercises_completed=0, total_exercises=15),
}


def get_mastery_level(score: float) -> MasteryLevel:
    """Convert mastery score to level."""
    if score >= 91: return MasteryLevel.MASTERED
    if score >= 71: return MasteryLevel.PROFICIENT
    if score >= 41: return MasteryLevel.LEARNING
    return MasteryLevel.BEGINNER


@app.get("/", response_model=dict)
async def root():
    return {"service": SERVICE_NAME, "version": SERVICE_VERSION, "status": "running"}


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", service=SERVICE_NAME, version=SERVICE_VERSION)


@app.get("/progress/{student_id}", response_model=list[ModuleProgress])
async def get_student_progress(student_id: str):
    """Get student progress across all modules."""
    return list(student_modules.values())


@app.post("/update")
async def update_progress(student_id: str, module_id: int, score_delta: float = 5.0):
    """Update student progress."""
    if student_id not in student_progress:
        student_progress[student_id] = {
            "streak_days": 1,
            "last_activity": datetime.utcnow(),
        }

    # Update module progress
    module = student_modules.get(module_id)
    if module:
        module.mastery_score = min(100, module.mastery_score + score_delta)
        module.mastery_level = get_mastery_level(module.mastery_score)
        module.exercises_completed += 1

    return {"status": "updated", "new_score": module.mastery_score if module else 0}


@app.post("/chat")
async def progress_chat(request: ChatRequest):
    """Handle progress queries."""
    progress = list(student_modules.values())
    total_completed = sum(m.exercises_completed for m in progress)
    total_exercises = sum(m.total_exercises for m in progress)
    overall_mastery = sum(m.mastery_score for m in progress) / len(progress)

    response = f"Your Progress:\n"
    response += f"Overall Mastery: {overall_mastery:.1f}%\n"
    response += f"Exercises: {total_completed}/{total_exercises} completed\n"
    response += f"Streak: {student_progress.get(str(request.student_id), {}).get('streak_days', 1)} days"

    return ChatResponse(response=response, agent_type="progress", confidence=1.0)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
