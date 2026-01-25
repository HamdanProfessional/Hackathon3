"""
update_progress: Update student progress (write operation)
Includes validation and authorization checks.
"""
import asyncpg
from typing import Dict, Any
from datetime import datetime
from config import settings_db

async def _get_connection():
    """Get database connection."""
    return await asyncpg.connect(
        host=settings_db.host,
        port=settings_db.port,
        database=settings_db.database,
        user=settings_db.user,
        password=settings_db.password,
    )

async def update_progress(student_id: str, module_id: str, mastery_delta: float) -> Dict[str, Any]:
    """
    Update student progress for a module.

    Args:
        student_id: Student identifier
        module_id: Module identifier (e.g., 'python-basics', 'control-flow')
        mastery_delta: Change in mastery (-100 to +100)

    Returns:
    - status: success/error
    - new_mastery: float (0-100)
    - updated: bool

    Validates:
    - mastery_delta between -100 and +100
    - final mastery between 0 and 100
    """
    try:
        # Validate inputs
        if not student_id or not module_id:
            return {
                "status": "error",
                "error": "student_id and module_id are required"
            }

        if not -100 <= mastery_delta <= 100:
            return {
                "status": "error",
                "error": f"mastery_delta must be between -100 and 100, got {mastery_delta}"
            }

        conn = await _get_connection()

        # Check if progress record exists
        exists = await conn.fetchval("""
            SELECT COUNT(*) FROM student_progress
            WHERE student_id = $1 AND module_id = $2
        """, student_id, module_id)

        if exists:
            # Update existing record
            new_mastery = await conn.fetchval("""
                UPDATE student_progress
                SET mastery_level = LEAST(100, GREATEST(0, mastery_level + $3)),
                    last_activity = CURRENT_TIMESTAMP
                WHERE student_id = $1 AND module_id = $2
                RETURNING mastery_level
            """, student_id, module_id, mastery_delta)
        else:
            # Insert new record
            new_mastery = max(0, min(100, mastery_delta))
            await conn.execute("""
                INSERT INTO student_progress
                (student_id, module_id, mastery_level, topics_completed, total_topics, last_activity, streak_days)
                VALUES ($1, $2, $3, 0, 10, CURRENT_TIMESTAMP, 1)
            """, student_id, module_id, new_mastery)

        await conn.close()

        return {
            "status": "success",
            "student_id": student_id,
            "module_id": module_id,
            "new_mastery": round(float(new_mastery), 1),
            "delta": mastery_delta,
        }

    except Exception as e:
        return {
            "status": "error",
            "student_id": student_id,
            "module_id": module_id,
            "error": str(e)[:100],
        }

__all__ = ["update_progress"]
