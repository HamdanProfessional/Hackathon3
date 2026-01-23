"""
LearnFlow Database MCP Server
Provides real-time access to LearnFlow database for AI agents.

This MCP server enables AI agents to:
- Query student progress and mastery scores
- Access code submissions and feedback
- Retrieve conversation history
- Detect learning struggles
- Search code patterns across submissions

Follows MCP Code Execution pattern for token efficiency.
"""
import asyncio
import json
import logging
import os
from typing import Any, Dict, List, Optional
from datetime import datetime

# Database connection
import asyncpg
from psycopg2 import pool

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LearnFlowDatabaseMCP:
    """MCP Server for LearnFlow database access."""

    def __init__(self):
        self.pool = None
        self.connection_string = os.getenv(
            "DATABASE_URL",
            "postgresql://learnflow:learnflow@localhost:5432/learnflow"
        )

    async def initialize(self):
        """Initialize database connection pool."""
        try:
            self.pool = await asyncpg.create_pool(
                self.connection_string,
                min_size=2,
                max_size=10
            )
            logger.info("Database connection pool created")
        except Exception as e:
            logger.error(f"Failed to create connection pool: {e}")
            # Fall back to mock data for demonstration
            self.pool = None

    async def close(self):
        """Close database connection pool."""
        if self.pool:
            await self.pool.close()
            logger.info("Database connection pool closed")

    # ============================================
    # MCP Tools Implementation
    # ============================================

    async def get_student_progress(self, student_id: str) -> Dict[str, Any]:
        """
        Retrieve comprehensive student progress data.

        Returns:
            Student progress including mastery scores, completion rates,
            recent activity, and learning patterns.
        """
        if not self.pool:
            return self._mock_student_progress(student_id)

        try:
            async with self.pool.acquire() as conn:
                # Get student info
                student = await conn.fetchrow(
                    "SELECT * FROM students WHERE id = $1",
                    student_id
                )

                if not student:
                    return {"error": "Student not found"}

                # Get mastery scores
                mastery = await conn.fetch(
                    """
                    SELECT
                        topic,
                        mastery_score,
                        exercises_completed,
                        exercises_total,
                        last_practiced
                    FROM student_progress
                    WHERE student_id = $1
                    ORDER BY last_practiced DESC
                    """,
                    student_id
                )

                # Get recent activity
                activity = await conn.fetch(
                    """
                    SELECT
                        event_type,
                        timestamp,
                        details
                    FROM learning_events
                    WHERE student_id = $1
                    ORDER BY timestamp DESC
                    LIMIT 10
                    """,
                    student_id
                )

                return {
                    "student_id": student_id,
                    "name": student["name"],
                    "enrolled_at": str(student["enrolled_at"]),
                    "mastery_by_topic": [
                        {
                            "topic": row["topic"],
                            "score": row["mastery_score"],
                            "completed": row["exercises_completed"],
                            "total": row["exercises_total"],
                            "last_practiced": str(row["last_practiced"])
                        }
                        for row in mastery
                    ],
                    "recent_activity": [
                        {
                            "event": row["event_type"],
                            "timestamp": str(row["timestamp"]),
                            "details": row["details"]
                        }
                        for row in activity
                    ],
                    "overall_mastery": self._calculate_overall_mastery(mastery)
                }

        except Exception as e:
            logger.error(f"Error fetching student progress: {e}")
            return {"error": str(e)}

    async def list_exercises(
        self,
        topic: Optional[str] = None,
        difficulty: Optional[str] = None,
        limit: int = 20
    ) -> Dict[str, Any]:
        """List available exercises with filters."""
        if not self.pool:
            return self._mock_exercises(topic, difficulty, limit)

        try:
            async with self.pool.acquire() as conn:
                query = "SELECT * FROM exercises WHERE 1=1"
                params = []
                param_idx = 1

                if topic:
                    query += f" AND topic = ${param_idx}"
                    params.append(topic)
                    param_idx += 1

                if difficulty:
                    query += f" AND difficulty = ${param_idx}"
                    params.append(difficulty)
                    param_idx += 1

                query += f" ORDER BY created_at DESC LIMIT ${param_idx}"
                params.append(limit)

                rows = await conn.fetch(query, *params)

                return {
                    "exercises": [
                        {
                            "id": str(row["id"]),
                            "title": row["title"],
                            "topic": row["topic"],
                            "difficulty": row["difficulty"],
                            "description": row["description"],
                            "starter_code": row["starter_code"],
                            "test_cases": json.loads(row["test_cases"]) if row["test_cases"] else []
                        }
                        for row in rows
                    ],
                    "count": len(rows)
                }

        except Exception as e:
            logger.error(f"Error listing exercises: {e}")
            return {"error": str(e)}

    async def get_code_submissions(
        self,
        student_id: str,
        exercise_id: Optional[str] = None,
        limit: int = 10
    ) -> Dict[str, Any]:
        """Retrieve student's code submissions."""
        if not self.pool:
            return self._mock_submissions(student_id, exercise_id, limit)

        try:
            async with self.pool.acquire() as conn:
                query = """
                    SELECT
                        s.*,
                        e.title as exercise_title,
                        cr.feedback,
                        cr.score,
                        cr.suggestions
                    FROM code_submissions s
                    JOIN exercises e ON s.exercise_id = e.id
                    LEFT JOIN code_reviews cr ON s.id = cr.submission_id
                    WHERE s.student_id = $1
                """
                params = [student_id]
                param_idx = 2

                if exercise_id:
                    query += f" AND s.exercise_id = ${param_idx}"
                    params.append(exercise_id)
                    param_idx += 1

                query += f" ORDER BY s.submitted_at DESC LIMIT ${param_idx}"
                params.append(limit)

                rows = await conn.fetch(query, *params)

                return {
                    "submissions": [
                        {
                            "id": str(row["id"]),
                            "exercise": row["exercise_title"],
                            "code": row["code"],
                            "submitted_at": str(row["submitted_at"]),
                            "status": row["status"],
                            "review": {
                                "feedback": row["feedback"],
                                "score": row["score"],
                                "suggestions": json.loads(row["suggestions"]) if row["suggestions"] else []
                            } if row["feedback"] else None
                        }
                        for row in rows
                    ],
                    "count": len(rows)
                }

        except Exception as e:
            logger.error(f"Error fetching submissions: {e}")
            return {"error": str(e)}

    async def get_conversation_history(
        self,
        student_id: str,
        limit: int = 20
    ) -> Dict[str, Any]:
        """Retrieve conversation history."""
        if not self.pool:
            return self._mock_conversation_history(student_id, limit)

        try:
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(
                    """
                    SELECT
                        role,
                        content,
                        agent_type,
                        timestamp
                    FROM conversations
                    WHERE student_id = $1
                    ORDER BY timestamp DESC
                    LIMIT $2
                    """,
                    student_id,
                    limit
                )

                return {
                    "student_id": student_id,
                    "messages": [
                        {
                            "role": row["role"],
                            "content": row["content"],
                            "agent": row["agent_type"],
                            "timestamp": str(row["timestamp"])
                        }
                        for row in reversed(rows)  # Chronological order
                    ],
                    "count": len(rows)
                }

        except Exception as e:
            logger.error(f"Error fetching conversation history: {e}")
            return {"error": str(e)}

    async def detect_struggles(self, student_id: str) -> Dict[str, Any]:
        """Detect learning struggles based on patterns."""
        if not self.pool:
            return self._mock_struggles(student_id)

        try:
            async with self.pool.acquire() as conn:
                # Get recent failed attempts
                failures = await conn.fetch(
                    """
                    SELECT
                        e.title,
                        e.topic,
                        s.submitted_at,
                        s.status
                    FROM code_submissions s
                    JOIN exercises e ON s.exercise_id = e.id
                    WHERE s.student_id = $1
                        AND s.status != 'passed'
                    ORDER BY s.submitted_at DESC
                    LIMIT 20
                    """,
                    student_id
                )

                # Get error patterns
                errors = await conn.fetch(
                    """
                    SELECT
                        error_message,
                        COUNT(*) as occurrence_count
                    FROM code_submissions
                    WHERE student_id = $1
                        AND error_message IS NOT NULL
                    GROUP BY error_message
                    ORDER BY occurrence_count DESC
                    LIMIT 5
                    """,
                    student_id
                )

                struggles = []
                if len(failures) > 5:
                    struggles.append({
                        "type": "high_failure_rate",
                        "severity": "high",
                        "description": "Multiple recent exercise failures",
                        "failed_count": len(failures)
                    })

                for error in errors:
                    if error["occurrence_count"] >= 3:
                        struggles.append({
                            "type": "recurring_error",
                            "severity": "medium",
                            "description": f"Repeated error: {error['error_message']}",
                            "occurrence_count": error["occurrence_count"]
                        })

                return {
                    "student_id": student_id,
                    "struggles_detected": struggles,
                    "struggle_count": len(struggles)
                }

        except Exception as e:
            logger.error(f"Error detecting struggles: {e}")
            return {"error": str(e)}

    async def search_code_patterns(
        self,
        pattern: str,
        limit: int = 50
    ) -> Dict[str, Any]:
        """Search for code patterns across submissions."""
        if not self.pool:
            return self._mock_code_patterns(pattern, limit)

        try:
            async with self.pool.acquire() as conn:
                # Simple pattern search using LIKE
                rows = await conn.fetch(
                    """
                    SELECT
                        s.id,
                        s.code,
                        s.student_id,
                        e.topic,
                        s.submitted_at
                    FROM code_submissions s
                    JOIN exercises e ON s.exercise_id = e.id
                    WHERE s.code ILIKE $1
                    ORDER BY s.submitted_at DESC
                    LIMIT $2
                    """,
                    f"%{pattern}%",
                    limit
                )

                return {
                    "pattern": pattern,
                    "matches": [
                        {
                            "submission_id": str(row["id"]),
                            "student_id": row["student_id"],
                            "topic": row["topic"],
                            "code_snippet": row["code"][:200],  # First 200 chars
                            "submitted_at": str(row["submitted_at"])
                        }
                        for row in rows
                    ],
                    "match_count": len(rows)
                }

        except Exception as e:
            logger.error(f"Error searching patterns: {e}")
            return {"error": str(e)}

    # ============================================
    # Mock Data (for demonstration)
    # ============================================

    def _mock_student_progress(self, student_id: str) -> Dict[str, Any]:
        """Mock student progress for demonstration."""
        return {
            "student_id": student_id,
            "name": f"Student {student_id}",
            "enrolled_at": "2024-01-15T00:00:00Z",
            "mastery_by_topic": [
                {"topic": "loops", "score": 85, "completed": 8, "total": 10, "last_practiced": "2024-01-20"},
                {"topic": "functions", "score": 72, "completed": 6, "total": 10, "last_practiced": "2024-01-19"},
                {"topic": "classes", "score": 45, "completed": 3, "total": 10, "last_practiced": "2024-01-18"}
            ],
            "recent_activity": [
                {"event": "exercise_completed", "timestamp": "2024-01-20T14:30:00Z", "details": "Loops exercise passed"},
                {"event": "code_submitted", "timestamp": "2024-01-20T14:25:00Z", "details": "Function exercise attempted"}
            ],
            "overall_mastery": 67
        }

    def _mock_exercises(self, topic, difficulty, limit) -> Dict[str, Any]:
        """Mock exercises for demonstration."""
        return {
            "exercises": [
                {
                    "id": "1",
                    "title": "For Loop Basics",
                    "topic": "loops",
                    "difficulty": "beginner",
                    "description": "Practice basic for loops in Python",
                    "starter_code": "# Write a for loop to iterate over numbers",
                    "test_cases": []
                },
                {
                    "id": "2",
                    "title": "Function Definition",
                    "topic": "functions",
                    "difficulty": "intermediate",
                    "description": "Define and call Python functions",
                    "starter_code": "# Define a function called greet",
                    "test_cases": []
                }
            ],
            "count": 2
        }

    def _mock_submissions(self, student_id, exercise_id, limit) -> Dict[str, Any]:
        """Mock submissions for demonstration."""
        return {
            "submissions": [
                {
                    "id": "101",
                    "exercise": "For Loop Basics",
                    "code": "for i in range(10):\n    print(i)",
                    "submitted_at": "2024-01-20T14:30:00Z",
                    "status": "passed",
                    "review": {
                        "feedback": "Great job! Loop is correct.",
                        "score": 100,
                        "suggestions": ["Consider using enumerate for index access"]
                    }
                }
            ],
            "count": 1
        }

    def _mock_conversation_history(self, student_id, limit) -> Dict[str, Any]:
        """Mock conversation history for demonstration."""
        return {
            "student_id": student_id,
            "messages": [
                {"role": "user", "content": "How do I write a for loop?", "agent": "triage", "timestamp": "2024-01-20T14:00:00Z"},
                {"role": "assistant", "content": "I'll route you to the Concepts agent for loop explanations.", "agent": "triage", "timestamp": "2024-01-20T14:00:01Z"},
                {"role": "assistant", "content": "A for loop in Python iterates over a sequence...", "agent": "concepts", "timestamp": "2024-01-20T14:00:05Z"}
            ],
            "count": 3
        }

    def _mock_struggles(self, student_id) -> Dict[str, Any]:
        """Mock struggles for demonstration."""
        return {
            "student_id": student_id,
            "struggles_detected": [
                {
                    "type": "recurring_error",
                    "severity": "medium",
                    "description": "IndentationError: unexpected indent",
                    "occurrence_count": 4
                }
            ],
            "struggle_count": 1
        }

    def _mock_code_patterns(self, pattern, limit) -> Dict[str, Any]:
        """Mock code patterns for demonstration."""
        return {
            "pattern": pattern,
            "matches": [
                {
                    "submission_id": "101",
                    "student_id": "student_1",
                    "topic": "loops",
                    "code_snippet": f"for i in range(10):",
                    "submitted_at": "2024-01-20T14:30:00Z"
                }
            ],
            "match_count": 1
        }

    def _calculate_overall_mastery(self, mastery_rows) -> float:
        """Calculate overall mastery score."""
        if not mastery_rows:
            return 0.0

        total_score = sum(row["mastery_score"] for row in mastery_rows)
        return round(total_score / len(mastery_rows), 1)


# ============================================
# MCP Server Entry Point
# ============================================

async def main():
    """Run the MCP server."""
    server = LearnFlowDatabaseMCP()
    await server.initialize()

    # Example usage
    print("=" * 60)
    print("LearnFlow Database MCP Server")
    print("=" * 60)
    print()

    # Test: Get student progress
    print("Test: get_student_progress")
    result = await server.get_student_progress("student_123")
    print(json.dumps(result, indent=2))
    print()

    # Test: List exercises
    print("Test: list_exercises")
    result = await server.list_exercises(topic="loops", limit=5)
    print(json.dumps(result, indent=2))
    print()

    # Test: Detect struggles
    print("Test: detect_struggles")
    result = await server.detect_struggles("student_123")
    print(json.dumps(result, indent=2))
    print()

    await server.close()


if __name__ == "__main__":
    asyncio.run(main())
