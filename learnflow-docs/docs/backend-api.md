---
slug: /backend-api
title: Backend API Reference
sidebar_position: 5
---

# Backend API Reference

Complete API documentation for all LearnFlow backend microservices.

## Base URL

- **Development**: `http://localhost:8001-8007`
- **Services**: Triage (8001), Concepts (8002), Debug (8003), Exercise (8004), Progress (8005), Code Review (8006)

---

## Triage Service (Port 8001)

Routes incoming chat messages and routes them to appropriate specialist agents.

### POST `/chat`

Route a student query to the appropriate specialist agent.

**Request:**
```json
{
  "message": "What is a variable?",
  "student_id": "00000000-0000-0000-0000-000000000001"
}
```

**Response:**
```json
{
  "triage": {
    "agent_type": "concepts|debug|exercise|code_review|progress",
    "confidence": 0.0-1.0,
    "reasoning": "Explanation of why this was routed to this agent"
  },
  "response": {
    "content": "The agent's response or suggested follow-up"
  },
  "message": "Error message if routing failed"
}
```

**Agent Types:**
- `concepts` - Questions about Python concepts
- `debug` - Code debugging help
- `exercise` - Exercise-related questions
- `code_review` - Code quality questions
- `progress` - Learning progress questions

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "triage-service",
  "version": "2.0.0"
}
```

---

## Concepts Service (Port 8002)

Explains Python concepts with adaptive responses based on student mastery level.

### POST `/chat`

Get explanations for Python concepts with appropriate complexity.

**Request:**
```json
{
  "message": "What is a variable?",
  "student_id": "00000000-0000-0000-0000-000000000001",
  "concept": "variables"
}
```

**Mastery Levels:**
- `beginner` (0-40%) - Simple explanations, basic examples
- `learning` (41-70%) - Detailed explanations, more context
- `proficient` (71-90%) - Concise explanations, advanced concepts
- `mastered` (91-100%) - Minimal explanations, best practices

**Response:**
```json
{
  "response": "Variable explanation with examples...",
  "agent_type": "concepts",
  "confidence": 0.9,
  "suggested_followup": ["Try using variables in...", "Practice with..."]
}
```

### POST `/explain`

Get detailed explanation of a specific concept.

**Request:**
```json
{
  "concept": "loops",
  "mastery_level": "learning"
}
```

**Response:**
```json
{
  "concept": "loops",
  "explanation": "Detailed explanation...",
  "examples": ["# Example code blocks..."],
  "resources": ["Documentation links..."]
}
```

### GET `/health`

Health check endpoint.

---

## Debug Service (Port 8003)

Provides progressive hints for debugging code without giving away the answer.

### POST `/debug`

Get debugging hints for code issues.

**Request:**
```json
{
  "code": "x = 5\nprint(x",
  "error": "NameError: name 'x' is not defined",
  "student_id": "00000000-0000-0000-0000-000000000001",
  "exercise_id": "ex_1_1"
}
```

**Response:**
```json
{
  "hint_1": "Check if variable is defined before use",
  "hint_2": "Look for typos in variable names",
  "hint_3": "Ensure proper indentation in Python",
  "explanation": "Debugging explanation without revealing answer"
}
```

### POST `/suggest

Get code suggestions for common issues.

**Response:**
```json
{
  "suggestions": [
    {
      "issue": "NameError",
      "suggestion": "Define the variable first: x = 5",
      "code": "x = 5\nprint(x)"
    }
  ]
}
```

### GET `/health`

Health check endpoint.

---

## Exercise Service (Port 8004)

Manages coding exercises, grading, and submissions.

### GET `/exercises`

List all available exercises.

**Response:**
```json
{
  "exercises": [
    {
      "id": "ex_1_1",
      "title": "Print Statement",
      "difficulty": "beginner",
      "module_id": "basics",
      "topic": "Output",
      "points": 10
    }
  ]
}
```

### GET `/exercises/{exercise_id}`

Get details for a specific exercise.

### POST `/submit`

Submit code for grading.

**Request:**
```json
{
  "exercise_id": "ex_1_1",
  "student_id": "00000000-0000-0000-0000-000000000001",
  "code": "print('Hello, World!')"
}
```

**Response:**
```json
{
  "passed": true,
  "feedback": "Great job! Your code works correctly.",
  "test_results": [
    {"test": "Output check", "passed": true}
  ],
  "next_exercise": "ex_1_2"
}
```

### GET `/health`

Health check endpoint.

---

## Progress Service (Port 8005)

Tracks student progress and mastery levels.

### GET `/progress/{student_id}`

Get student progress data.

**Response:**
```json
{
  "student_id": "00000000-0000-0000-0000-000000000001",
  "overall_mastery": 0.65,
  "module_progress": [
    {
      "module_id": "basics",
      "mastery": 0.8,
      "exercises_completed": 5,
      "total_exercises": 8,
      "streak_days": 5
    }
  ],
  "suggested_next": "Consider advancing to loops module"
}
```

### POST `/progress`

Update student progress.

### GET `/streak-alerts`

Get students who need help (for teachers).

**Response:**
```json
{
  "alerts": [
    {
      "student_id": "123",
      "alert_type": "repeated_error",
      "severity": "high",
      "error_count": 3,
      "concept": "loops",
      "last_error": "IndentationError"
    }
  ]
}
```

### GET `/health`

Health check endpoint.

---

## Code Review Service (Port 8006)

Analyzes code quality, PEP 8 compliance, and provides improvement suggestions.

### POST `/review`

Review code for quality and style.

**Request:**
```json
{
  "code": "def add(a,b):\nreturn a+b",
  "language": "python"
}
```

**Response:**
```json
{
  "quality_score": 85,
  "pep8_compliant": true,
  "issues": [
    {
      "line": 1,
      "issue": "Missing docstring",
      "severity": "low"
    }
  ],
  "suggestions": [
    "Add type hints: def add(a: int, b: int) -> int:"
  ]
}
```

### GET `/health

Health check endpoint.

---

## Error Responses

All services return consistent error responses:

### 400 Bad Request
```json
{
  "detail": "Validation error",
  "errors": ["field_name": "error message"]
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error",
  "error": "Error message"
}
```

---

## Common Headers

Include these headers in your requests:

```
Content-Type: application/json
Accept: application/json
```

For authenticated endpoints:
```
Authorization: Bearer <token>
```

---

## Rate Limiting

- **Triage Service**: 100 requests/minute
- **Other Services**: 200 requests/minute
- **Code Execution**: 10 requests/minute

---

## OpenAPI/Swagger

Each service has auto-generated OpenAPI documentation available at:

- `http://localhost:8001/docs` - Triage service docs
- `http://localhost:8002/docs` - Concepts service docs
- `http://localhost:8003/docs` - Debug service docs
- `http://localhost:8004/docs` - Exercise service docs
- `http://localhost:8005/docs` - Progress service docs
- `http://localhost:8006/docs` - Code review service docs

Visit these URLs in your browser for interactive API documentation.

---

## Next Steps

- [Frontend Overview](/frontend-overview)
- [Deployment Guide](/local-setup)
- [MCP Servers](/mcp-overview)
- [Student Guide](/student-guide)
- [Teacher Guide](/teacher-guide)
