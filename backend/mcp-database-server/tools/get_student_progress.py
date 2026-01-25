"""
get_student_progress: Query student progress from database
Returns minimal summary for token efficiency.
"""
import asyncpg
from typing import Dict, Any, Optional
from config import settings_db

async def _get_connection():
    """Get database connection from pool."""
    return await asyncpg.connect(
        host=settings_db.host,
        port=settings_db.port,
        database=settings_db.database,
        user=settings_db.user,
        password=settings_db.password,
    )

async def get_student_progress(student_id: str) -> Dict[str, Any]:
    """
    Get student learning progress summary.

    Returns minimal data:
    - overall_mastery: float (0-100)
    - streak_days: int
    - last_activity: ISO date string
    - module_progress: dict of module_id -> mastery_percentage

    Token-efficient: No large text fields, only summary data.
    """
    try:
        conn = await _get_connection()

        # Get overall progress summary
        row = await conn.fetchrow("""
            SELECT
                COALESCE(AVG(mastery_level), 0) as overall_mastery,
                COALESCE(streak_days, 0) as streak_days,
                COALESCE(last_activity::text, '1970-01-01') as last_activity
            FROM student_progress
            WHERE student_id = $1
        """, student_id)

        if not row or row['overall_mastery'] == 0:
            await conn.close()
            return {
                "status": "not_found",
                "student_id": student_id,
                "message": "No progress data found for student"
            }

        # Get per-module progress (only top modules by completion)
        modules = await conn.fetch("""
            SELECT module_id, mastery_level, topics_completed, total_topics
            FROM student_progress
            WHERE student_id = $1
            ORDER BY mastery_level DESC
            LIMIT 8
        """, student_id)

        module_progress = {
            m['module_id']: {
                "mastery": round(m['mastery_level'], 1),
                "topics": f"{m['topics_completed']}/{m['total_topics']}"
            }
            for m in modules
        }

        await conn.close()

        return {
            "status": "success",
            "student_id": student_id,
            "overall_mastery": round(float(row['overall_mastery']), 1),
            "streak_days": row['streak_days'],
            "last_activity": row['last_activity'][:10],  # Just the date
            "module_progress": module_progress,
        }

    except Exception as e:
        return {
            "status": "error",
            "student_id": student_id,
            "error": str(e)[:100],  # Limit error message length
        }

__all__ = ["get_student_progress"]
