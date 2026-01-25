"""MCP Database Server Tools"""
from . import get_student_progress
from . import get_code_submissions
from . import get_exercise_history
from . import get_struggling_students
from . import update_progress

__all__ = [
    "get_student_progress",
    "get_code_submissions",
    "get_exercise_history",
    "get_struggling_students",
    "update_progress",
]
