---
title: API Reference
---

# API Reference

Complete API documentation for all LearnFlow backend services.

## Authentication

Include `student_id` in request bodies:

```json
{
  "student_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

## Services Overview

| Service | Port | Endpoints |
|---------|------|-----------|
| Triage | 8001 | POST /triage |
| Concepts | 8002 | POST / |
| Debug | 8003 | POST / |
| Exercise | 8004 | POST /generate, POST /submit |
| Progress | 8005 | GET /progress/{id} |
| Code Review | 8006 | POST /review |

## Triage Service

### POST /triage

Route query to appropriate agent.

**Response:**
```json
{
  "agent_type": "concepts",
  "confidence": 0.85
}
```

## Exercise Service

### POST /generate

Generate new exercise.

**Response:**
```json
{
  "id": 1,
  "title": "Hello World",
  "instructions": "Write a program that prints 'Hello, World!'",
  "starter_code": "# Write your code here\n",
  "difficulty": "beginner"
}
```

### POST /submit

Submit solution.

**Response:**
```json
{
  "passed": true,
  "feedback": "Great job!"
}
```

## Progress Service

### GET /progress/{student_id}

Get student progress.

**Response:**
```json
{
  "student_id": "uuid",
  "overall_mastery": 25.0,
  "streak_days": 5
}
```

## MCP Servers

### Code Execution (9000)

#### POST /tools/execute_code

Execute Python code.

**Request:**
```json
{
  "code": "print('hello')",
  "timeout": 5
}
```

**Response:**
```json
{
  "success": true,
  "output": "hello\n"
}
```

### Database (9001)

#### GET /tools/get_exercises?module_id=1

Get exercises catalog.

**Response:**
```json
[{
  "id": 1,
  "title": "Hello World",
  "difficulty": "beginner"
}]
```

## Testing

```bash
# Test triage
curl -X POST http://localhost:8001/triage \
  -H "Content-Type: application/json" \
  -d '{"student_id":"uuid","message":"What is a variable?"}'

# Test exercise generation
curl -X POST http://localhost:8004/generate \
  -H "Content-Type: application/json" \
  -d '{"student_id":"uuid","module_id":1}'
```

## Error Codes

- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
