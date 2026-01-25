"""
get_struggling_students: Query struggling students based on mastery threshold
Returns aggregated data for teacher intervention.
"""
import asyncpg
from typing import Dict, Any, List
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

async def get_struggling_students(class_id: str = None, threshold: float = 50.0) -> Dict[str, Any]:
    """
    Get list of struggling students based on mastery threshold.

    Args:
        class_id: Optional class filter (not implemented in schema yet)
        threshold: Mastery percentage threshold (default 50.0)

    Returns:
    - total_count: int
    - students: list with student_id, name, overall_mastery, struggling_modules

    Token-efficient: Only returns summary data, not full history.
    """
    try:
        conn = await _get_connection()

        # Get students below mastery threshold
        rows = await conn.fetch("""
            SELECT
                sp.student_id,
                COALESCE(u.name, 'Unknown') as name,
                COALESCE(u.email, '') as email,
                AVG(sp.mastery_level) as overall_mastery
            FROM student_progress sp
            LEFT JOIN users u ON sp.student_id = u.id
            GROUP BY sp.student_id, u.name, u.email
            HAVING AVG(sp.mastery_level) < $1
            ORDER BY overall_mastery ASC
            LIMIT 20
        """, threshold)

        students = []
        for row in rows:
            # Get struggling modules for each student
            modules = await conn.fetch("""
                SELECT module_id, mastery_level
                FROM student_progress
                WHERE student_id = $1 AND mastery_level < $2
                ORDER BY mastery_level ASC
                LIMIT 3
            """, row['student_id'], threshold)

            students.append({
                "student_id": row['student_id'],
                "name": row['name'],
                "email": row['email'][:50] if row['email'] else '',
                "overall_mastery": round(float(row['overall_mastery']), 1),
                "struggling_modules": [
                    {"module": m['module_id'], "mastery": round(m['mastery_level'], 1)}
                    for m in modules
                ]
            })

        await conn.close()

        return {
            "status": "success",
            "threshold": threshold,
            "total_count": len(students),
            "students": students,
        }

    except Exception as e:
        return {
            "status": "error",
            "threshold": threshold,
            "error": str(e)[:100],
        }

__all__ = ["get_struggling_students"]
