"""
get_code_submissions: Query recent code submissions for a student
Returns limited results for token efficiency.
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

async def get_code_submissions(student_id: str, limit: int = 10) -> Dict[str, Any]:
    """
    Get recent code submissions for a student.

    Returns limited submissions (default 10) with:
    - exercise_id: str
    - submitted_at: ISO timestamp
    - passed: bool
    - error_message: str (if failed)
    - code_snippet: first 200 chars only (token-efficient)

    Ordered by most recent first.
    """
    try:
        conn = await _get_connection()

        rows = await conn.fetch("""
            SELECT
                exercise_id,
                submitted_at,
                passed,
                error_message,
                SUBSTRING(code FROM 1 FOR 200) as code_snippet
            FROM code_submissions
            WHERE student_id = $1
            ORDER BY submitted_at DESC
            LIMIT $2
        """, student_id, min(limit, 50))  # Cap at 50 for token efficiency

        await conn.close()

        submissions = [
            {
                "exercise_id": row['exercise_id'],
                "submitted_at": row['submitted_at'].isoformat(),
                "passed": row['passed'],
                "error": row['error_message'][:100] if row['error_message'] else None,
                "code": row['code_snippet'] + ("..." if len(row['code_snippet']) >= 200 else ""),
            }
            for row in rows
        ]

        return {
            "status": "success",
            "student_id": student_id,
            "count": len(submissions),
            "submissions": submissions,
        }

    except Exception as e:
        return {
            "status": "error",
            "student_id": student_id,
            "error": str(e)[:100],
        }

__all__ = ["get_code_submissions"]
