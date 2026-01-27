"""Code Review Service - Analyzes code quality and provides feedback.

Reviews code for correctness, style (PEP 8), efficiency, and readability.
"""

import os
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from shared.models import (
    HealthResponse, ChatRequest, ChatResponse,
    CodeSubmission, CodeReviewResult
)
from shared.dapr_client import get_dapr_client, EventTopics


SERVICE_NAME = "code-review-service"
SERVICE_VERSION = "2.0.0"
PORT = int(os.getenv("PORT", "8006"))

app = FastAPI(title="LearnFlow Code Review Service", version=SERVICE_VERSION)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


PEP8_PATTERNS = [
    (r"[a-z_][A-Z]", "Variable names should be snake_case, not camelCase"),
    (r"^\s{4}[^\s]", "Use 4 spaces per indentation level (PEP 8)"),
    (r".{80,}", "Lines should be under 80 characters for readability"),
]

EFFICIENCY_PATTERNS = [
    (r"for .* in range\(len\(", "Use direct iteration instead of range(len())"),
    (r"\+\= 1$", "Consider using enumerate() or appropriate data structure"),
]

READABILITY_PATTERNS = [
    (r"[a-z]\d+$", "Avoid single-letter variable names with numbers"),
    (r"tmp\d*", "Use descriptive names instead of 'tmp'"),
    (r"def [a-z]$", "Function names should be descriptive"),
]


def analyze_code_quality(code: str) -> tuple[bool, str, list[str], list[str], list[str], float]:
    """Analyze code and return review results."""
    style_issues = []
    efficiency_notes = []
    feedback = []

    # Check for syntax errors (basic)
    try:
        compile(code, '<string>', 'exec')
        correct = True
        feedback.append("Code has no syntax errors")
    except SyntaxError as e:
        correct = False
        feedback.append(f"Syntax error: {e.msg}")
        return False, "\n".join(feedback), [], [], [], 0.0

    # Check style
    for pattern, message in PEP8_PATTERNS:
        if re.search(pattern, code, re.MULTILINE):
            style_issues.append(message)

    # Check efficiency
    for pattern, message in EFFICIENCY_PATTERNS:
        if re.search(pattern, code):
            efficiency_notes.append(message)

    # Check readability
    readability_score = 100
    for pattern, message in READABILITY_PATTERNS:
        if re.search(pattern, code):
            style_issues.append(message)
            readability_score -= 10

    # Calculate overall quality score
    style_deduction = len(style_issues) * 5
    efficiency_deduction = len(efficiency_notes) * 5
    quality_score = max(0, min(100, 100 - style_deduction - efficiency_deduction))

    if correct:
        if quality_score >= 80:
            feedback.append("Great code quality!")
        elif quality_score >= 60:
            feedback.append("Good code with room for improvement")
        else:
            feedback.append("Code works but needs improvement")

    return correct, "\n".join(feedback), style_issues, efficiency_notes, [], quality_score


@app.get("/", response_model=dict)
async def root():
    return {"service": SERVICE_NAME, "version": SERVICE_VERSION, "status": "running"}


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", service=SERVICE_NAME, version=SERVICE_VERSION)


@app.post("/review", response_model=CodeReviewResult)
async def review_code(submission: CodeSubmission):
    """Review code submission and publish event."""
    correct, feedback, style_issues, efficiency_notes, hints, quality_score = analyze_code_quality(submission.code)

    # Publish code submission event to Kafka
    dapr = get_dapr_client()
    await dapr.publish_event(
        topic=EventTopics.CODE_SUBMISSION,
        data={
            "student_id": str(submission.student_id),
            "exercise_id": submission.exercise_id,
            "language": submission.language,
            "correct": correct,
            "quality_score": quality_score,
            "style_issues_count": len(style_issues),
            "efficiency_notes_count": len(efficiency_notes),
        },
    )

    return CodeReviewResult(
        correct=correct,
        feedback=feedback,
        hints=style_issues + efficiency_notes,
        quality_score=quality_score,
        style_issues=style_issues,
        efficiency_notes=efficiency_notes,
    )


@app.post("/chat")
async def review_chat(request: ChatRequest):
    """Handle code review chat."""
    if "```" in request.message:
        # Extract code from markdown
        code_match = re.search(r"```(?:python)?\n(.*?)```", request.message, re.DOTALL)
        if code_match:
            code = code_match.group(1)
            correct, feedback, style_issues, efficiency_notes, _, quality_score = analyze_code_quality(code)

            response = f"Code Review (Score: {quality_score:.0f}/100)\n\n{feedback}\n\n"
            if style_issues:
                response += "Style:\n" + "\n".join(f"• {i}" for i in style_issues[:3])
            if efficiency_notes:
                response += "\n\nEfficiency:\n" + "\n".join(f"• {n}" for n in efficiency_notes[:3])

            return ChatResponse(response=response, agent_type="code_review", confidence=0.9)

    return ChatResponse(
        response="Share your code wrapped in ```python``` code blocks for review!",
        agent_type="code_review",
        confidence=0.8,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
