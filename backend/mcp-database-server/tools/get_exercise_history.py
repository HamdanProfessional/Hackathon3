"""
get_exercise_history: Query exercise attempt history
Returns summary of attempts for token efficiency.
"""
import asyncpg
from typing import Dict, Any, Optional
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

async def get_exercise_history(student_id: str, exercise_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Get exercise attempt history for a student.

    If exercise_id provided, returns history for that exercise only.
    Otherwise, returns summary across all exercises.

    Returns:
    - total_attempts: int
    - passed_count: int
    - best_score: float
    - last_attempt: ISO timestamp
    - attempts: list of recent attempts (max 5)
    """
    try:
        conn = await _get_connection()

        if exercise_id:
            # Query specific exercise
            rows = await conn.fetch("""
                SELECT
                    submitted_at,
                    passed,
                    test_cases_passed,
                    total_test_cases,
                    error_message
                FROM code_submissions
                WHERE student_id = $1 AND exercise_id = $2
                ORDER BY submitted_at DESC
                LIMIT 10
            """, student_id, exercise_id)

            total = await conn.fetchval("""
                SELECT COUNT(*)
                FROM code_submissions
                WHERE student_id = $1 AND exercise_id = $2
            """, student_id, exercise_id)

            passed = await conn.fetchval("""
                SELECT COUNT(*)
                FROM code_submissions
                WHERE student_id = $1 AND exercise_id = $2 AND passed = true
            """, student_id, exercise_id)

            best_score = await conn.fetchval("""
                SELECT MAX(test_cases_passed::float / NULLIF(total_test_cases, 0) * 100)
                FROM code_submissions
                WHERE student_id = $1 AND exercise_id = $2
            """, student_id, exercise_id) or 0

        else:
            # Query all exercises (summary)
            rows = await conn.fetch("""
                SELECT
                    exercise_id,
                    submitted_at,
                    passed,
                    test_cases_passed,
                    total_test_cases
                FROM code_submissions
                WHERE student_id = $1
                ORDER BY submitted_at DESC
                LIMIT 5
            """, student_id)

            total = await conn.fetchval("""
                SELECT COUNT(*)
                FROM code_submissions
                WHERE student_id = $1
            """, student_id)

            passed = await conn.fetchval("""
                SELECT COUNT(*)
                FROM code_submissions
                WHERE student_id = $1 AND passed = true
            """, student_id)

            best_score = await conn.fetchval("""
                SELECT MAX(test_cases_passed::float / NULLIF(total_test_cases, 0) * 100)
                FROM code_submissions
                WHERE student_id = $1
            """, student_id) or 0

        await conn.close()

        attempts = [
            {
                "timestamp": row['submitted_at'].isoformat(),
                "passed": row['passed'],
                "score": round(row['test_cases_passed'] / row['total_test_cases'] * 100, 1) if row['total_test_cases'] > 0 else 0,
                "error": row.get('error_message', '')[:80] if 'error_message' in row else None,
            }
            for row in rows
        ]

        return {
            "status": "success",
            "student_id": student_id,
            "exercise_id": exercise_id,
            "total_attempts": total,
            "passed_count": passed,
            "best_score": round(float(best_score), 1),
            "attempts": attempts[:5],  # Limit to 5 most recent
        }

    except Exception as e:
        return {
            "status": "error",
            "student_id": student_id,
            "exercise_id": exercise_id,
            "error": str(e)[:100],
        }

__all__ = ["get_exercise_history"]
