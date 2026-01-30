"""Progress Service - Tracks student mastery and learning progress.

Calculates mastery scores and tracks learning streaks.
Subscribes to exercise attempts and learning progress events.
"""

import os
import asyncio
import json
from datetime import datetime, timedelta
from typing import List, Optional
from uuid import uuid4
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse

from shared.models import (
    HealthResponse, ChatRequest, ChatResponse,
    ProgressData, MasteryLevel, ModuleProgress
)
from shared.dapr_client import get_dapr_client


SERVICE_NAME = "progress-service"
SERVICE_VERSION = "2.0.0"
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


# ============================================================================
# Teacher Dashboard Models
# ============================================================================

class Student(BaseModel):
    id: str
    name: str
    email: str
    role: str = "student"
    studentId: str
    level: str = "beginner"


class ClassOverview(BaseModel):
    totalStudents: int
    activeToday: int
    strugglingCount: int
    averageMastery: float
    topPerformers: List[Student]
    strugglingStudents: List[Student]


class StruggleAlert(BaseModel):
    id: str
    studentId: str
    studentName: str
    type: str  # 'repeated_error', 'time_spent', 'low_quiz_score'
    severity: str  # 'high', 'medium', 'low'
    message: str
    context: dict = {}
    createdAt: str
    resolved: bool = False


# Mock data for teacher dashboard
mock_students = [
    Student(id="1", name="Alice Johnson", email="alice@example.com", studentId="1", level="advanced"),
    Student(id="2", name="Bob Smith", email="bob@example.com", studentId="2", level="intermediate"),
    Student(id="3", name="Charlie Brown", email="charlie@example.com", studentId="3", level="intermediate"),
    Student(id="4", name="Diana Prince", email="diana@example.com", studentId="4", level="advanced"),
    Student(id="5", name="Eve Davis", email="eve@example.com", studentId="5", level="beginner"),
    Student(id="6", name="Frank Miller", email="frank@example.com", studentId="6", level="beginner"),
    Student(id="7", name="Grace Lee", email="grace@example.com", studentId="7", level="beginner"),
]

mock_struggle_alerts = [
    StruggleAlert(
        id="alert-1",
        studentId="student-1",
        studentName="John Doe",
        type="repeated_error",
        severity="high",
        message="Student has encountered the same error 5 times in the Functions module",
        context={"exerciseId": "functions-1", "error": "SyntaxError: invalid syntax", "attempts": 5},
        createdAt=(datetime.utcnow() - timedelta(minutes=30)).isoformat(),
        resolved=False,
    ),
    StruggleAlert(
        id="alert-2",
        studentId="student-2",
        studentName="Jane Smith",
        type="time_spent",
        severity="medium",
        message="Student has been stuck on an exercise for 25 minutes",
        context={"exerciseId": "loops-2", "timeSpent": 1500},
        createdAt=(datetime.utcnow() - timedelta(minutes=15)).isoformat(),
        resolved=False,
    ),
    StruggleAlert(
        id="alert-3",
        studentId="student-3",
        studentName="Bob Johnson",
        type="low_quiz_score",
        severity="medium",
        message="Student scored 35% on the Data Types quiz",
        createdAt=(datetime.utcnow() - timedelta(hours=1)).isoformat(),
        resolved=False,
    ),
]

# In-memory storage for alerts
alerts_storage = {alert.id: alert for alert in mock_struggle_alerts}


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


@app.post("/events")
async def handle_events(event_data: dict):
    """Handle events from Dapr pub/sub (exercise.attempt, learning.progress).

    This endpoint is called by Dapr when events are published to Kafka topics.
    """
    event_type = event_data.get("event_type", event_data.get("type", "unknown"))

    if event_type == "exercise_attempt":
        # Update progress based on exercise completion
        student_id = event_data.get("student_id")
        module_id = event_data.get("module_id", 1)
        passed = event_data.get("passed", False)

        if passed:
            score_delta = 5.0
        else:
            score_delta = 1.0  # Partial credit for attempt

        await update_progress(student_id, module_id, score_delta)

    elif event_type == "concept_learned":
        # Update progress based on concept learning
        student_id = event_data.get("student_id")
        module_id = 1  # Default to basics for concepts
        score_delta = 2.0

        await update_progress(student_id, module_id, score_delta)

    return {"status": "processed"}


# Dapr subscription endpoint (alternative to /events)
# Dapr can call this when events arrive on subscribed topics
@app.post("/exercise-attempt")
async def handle_exercise_attempt(event_data: dict):
    """Handle exercise attempt events from Dapr pub/sub."""
    student_id = event_data.get("student_id")
    module_id = event_data.get("module_id", 1)
    passed = event_data.get("passed", False)

    if passed:
        score_delta = 5.0
    else:
        score_delta = 1.0  # Partial credit for attempt

    await update_progress(student_id, module_id, score_delta)
    return {"status": "processed"}


@app.post("/learning-progress")
async def handle_learning_progress(event_data: dict):
    """Handle learning progress events from Dapr pub/sub."""
    student_id = event_data.get("student_id")
    module_id = 1  # Default to basics for concepts
    score_delta = 2.0

    await update_progress(student_id, module_id, score_delta)
    return {"status": "processed"}


# ============================================================================
# Teacher Dashboard API Endpoints (Dynamic data)
# ============================================================================

@app.get("/api/v1/class/{class_id}/overview", response_model=ClassOverview)
async def get_class_overview(class_id: str):
    """Get class overview for teacher dashboard."""
    # Calculate average mastery across all modules
    total_mastery = sum(m.mastery_score for m in student_modules.values())
    average_mastery = total_mastery / len(student_modules)

    # Get top performers (based on mock data for now)
    top_performers = mock_students[:5]

    # Get struggling students
    struggling_students = mock_students[-2:]

    # Count active students (those with progress in last 24 hours)
    active_today = sum(1 for s in student_progress.values()
                      if datetime.utcnow() - s.get("last_activity", datetime.min) < timedelta(hours=24))

    return ClassOverview(
        totalStudents=len(mock_students),
        activeToday=max(active_today, 30),  # Mock with some active students
        strugglingCount=len(struggling_students),
        averageMastery=round(average_mastery, 1),
        topPerformers=top_performers,
        strugglingStudents=struggling_students,
    )


@app.get("/api/v1/alerts")
async def get_struggle_alerts(
    classId: Optional[str] = None,
    resolved: bool = False,
    limit: int = 50,
    offset: int = 0,
):
    """Get struggle alerts for a class."""
    # Filter alerts by resolved status
    filtered_alerts = [alert for alert in alerts_storage.values() if alert.resolved == resolved]

    # Apply pagination
    paginated_alerts = filtered_alerts[offset:offset + limit]

    return {
        "alerts": [alert.model_dump() for alert in paginated_alerts],
        "total_count": len(filtered_alerts),
    }


@app.get("/api/v1/alerts/{alert_id}")
async def get_alert(alert_id: str):
    """Get a specific alert by ID."""
    alert = alerts_storage.get(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert.model_dump()


@app.patch("/api/v1/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    """Mark a struggle alert as resolved."""
    alert = alerts_storage.get(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.resolved = True
    return {"message": "Alert resolved successfully"}


@app.get("/api/v1/activity/{student_id}")
async def get_student_activity(student_id: str, limit: int = 20):
    """Get activity feed for a student."""
    # Mock activity data
    activities = [
        {
            "id": "act-1",
            "type": "exercise_completed",
            "message": "Completed 'Variables and Types' exercise",
            "timestamp": (datetime.utcnow() - timedelta(minutes=5)).isoformat(),
        },
        {
            "id": "act-2",
            "type": "concept_learned",
            "message": "Learned about 'Loops'",
            "timestamp": (datetime.utcnow() - timedelta(hours=1)).isoformat(),
        },
        {
            "id": "act-3",
            "type": "exercise_failed",
            "message": "Failed 'Functions Basics' exercise (2 attempts)",
            "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
        },
    ]

    return {
        "activities": activities[:limit],
        "total_count": len(activities),
    }


@app.get("/api/v1/activity")
async def get_all_activity(limit: int = 20):
    """Get activity feed for all students."""
    # Mock activity data
    activities = [
        {
            "id": "act-1",
            "student_id": "1",
            "student_name": "Alice Johnson",
            "type": "exercise_completed",
            "message": "Completed 'Advanced Functions' exercise",
            "timestamp": (datetime.utcnow() - timedelta(minutes=5)).isoformat(),
        },
        {
            "id": "act-2",
            "student_id": "2",
            "student_name": "Bob Smith",
            "type": "concept_learned",
            "message": "Learned about 'Data Structures'",
            "timestamp": (datetime.utcnow() - timedelta(hours=1)).isoformat(),
        },
    ]

    return {
        "activities": activities[:limit],
        "total_count": len(activities),
    }


# ============================================================================
# SSE (Server-Sent Events) Endpoints for real-time updates
# ============================================================================

@app.get("/api/v1/alerts/stream")
async def stream_alerts(classId: str = Query(...)):
    """Stream struggle alerts via SSE."""

    async def event_generator():
        try:
            # Send initial alerts
            for alert in alerts_storage.values():
                if not alert.resolved:
                    yield f"data: {alert.model_dump_json()}\n\n"

            # Keep connection alive and send new alerts every 30 seconds
            while True:
                await asyncio.sleep(30)
                # In a real implementation, this would check for new alerts
                # For now, just send a keepalive comment
                yield ": keepalive\n\n"
        except asyncio.CancelledError:
            pass

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/v1/class/{class_id}/stats/stream")
async def stream_class_stats(class_id: str):
    """Stream class statistics via SSE."""

    async def event_generator():
        try:
            # Send initial stats
            total_mastery = sum(m.mastery_score for m in student_modules.values())
            average_mastery = total_mastery / len(student_modules)

            initial_stats = ClassOverview(
                totalStudents=len(mock_students),
                activeToday=32,
                strugglingCount=2,
                averageMastery=round(average_mastery, 1),
                topPerformers=mock_students[:5],
                strugglingStudents=mock_students[-2:],
            )

            yield f"data: {initial_stats.model_dump_json()}\n\n"

            # Send updates every 10 seconds
            while True:
                await asyncio.sleep(10)
                # Simulate changing stats
                active_today = 30 + (datetime.utcnow().second % 15)
                updated_stats = ClassOverview(
                    totalStudents=len(mock_students),
                    activeToday=active_today,
                    strugglingCount=2,
                    averageMastery=round(average_mastery + (datetime.utcnow().second % 5), 1),
                    topPerformers=mock_students[:5],
                    strugglingStudents=mock_students[-2:],
                )
                yield f"data: {updated_stats.model_dump_json()}\n\n"
        except asyncio.CancelledError:
            pass

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
