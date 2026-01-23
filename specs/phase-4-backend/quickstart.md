# Phase 4: Backend Services - Quickstart Scenarios

**Phase**: 4
**Status**: Draft

---

## Scenario 1: Student Asks About For Loops

### Flow

```
Student Frontend → Triage Service → Concepts Service → Progress Service
```

### Request

```http
POST /api/v1/triage
Content-Type: application/json

{
  "conversation_id": "conv-123",
  "student_id": "student-456",
  "message": "How do for loops work in Python?"
}
```

### Expected Sequence

1. **Triage Service** classifies as "concepts" query
   - Publishes `learning.triage` event
   - Returns: `{"agent": "concepts", "confidence": 0.95}`

2. **Concepts Service** receives event, processes explanation
   - Retrieves student mastery (Beginner: 35%)
   - Generates beginner-friendly explanation
   - Publishes `learning.concept_explained` event

3. **Progress Service** updates mastery
   - Calculates new mastery (+2 points for concept engagement)
   - Saves state to Dapr state store

### Final Response

```json
{
  "agent": "concepts",
  "response": "A for loop lets you repeat code for each item in a list. Think of it like: 'For each item in my shopping list, pick it up and put in cart.'",
  "code_example": "for item in ['apple', 'banana']:\n    print(item)",
  "mastery_update": {
    "topic": "control-flow:for-loops",
    "previous_score": 35,
    "new_score": 37
  }
}
```

---

## Scenario 2: Student Submits Code with SyntaxError

### Flow

```
Student Frontend → Triage Service → Debug Service → Code Review Service → Progress Service
```

### Request

```http
POST /api/v1/debug/analyze
Content-Type: application/json

{
  "student_id": "student-456",
  "code": "for i in range(10\n    print(i)",
  "language": "python"
}
```

### Expected Sequence

1. **Debug Service** parses error
   - Detects `SyntaxError: unexpected EOF`
   - Identifies missing closing parenthesis
   - Checks error frequency (first time for this student)
   - Returns progressive hint (not solution)

2. **Code Review Service** analyzes quality
   - Detects style issues (missing newline per PEP 8)
   - Calculates overall score
   - Returns detailed feedback

3. **Progress Service** tracks struggle
   - No alert yet (first occurrence)
   - Logs error type for frequency tracking

### Final Response

```json
{
  "error_analysis": {
    "type": "SyntaxError",
    "message": "unexpected EOF while parsing",
    "line": 1,
    "hint": "Check if you closed all opening parentheses and brackets. Count your opening and closing symbols."
  },
  "code_review": {
    "overall_score": 65,
    "correctness": 50,
    "style": 80,
    "efficiency": 75,
    "readability": 70,
    "feedback": {
      "correctness": {"issues": ["SyntaxError: missing closing parenthesis"]},
      "style": {"issues": ["Missing newline at end of file"]}
    }
  },
  "struggle_detected": false
}
```

---

## Scenario 3: Student Requests Exercise on Lists

### Flow

```
Student Frontend → Triage Service → Exercise Service → Progress Service
```

### Request

```http
POST /api/v1/exercise/generate
Content-Type: application/json

{
  "student_id": "student-456",
  "topic": "data-structures:lists",
  "difficulty": "beginner"
}
```

### Expected Sequence

1. **Exercise Service** generates exercise
   - Retrieves student mastery (Beginner: 37%)
   - Selects appropriate exercise from bank
   - Generates test cases
   - Returns exercise with starter code

2. **Progress Service** records activity
   - Updates last_active timestamp
   - Saves exercise request to state

### Final Response

```json
{
  "exercise": {
    "id": "ex-789",
    "title": "Sum List Elements",
    "description": "Write a function that returns the sum of all numbers in a list.",
    "starter_code": "def sum_list(numbers):\n    # Your code here\n    pass",
    "difficulty": "beginner"
  },
  "test_cases_visible": [
    {
      "input": "sum_list([1, 2, 3])",
      "expected": "6"
    }
  ],
  "hints_available": 3
}
```

---

## Scenario 4: Student Submits Exercise Solution

### Flow

```
Student Frontend → Exercise Service → Progress Service
```

### Request

```http
POST /api/v1/exercise/submit
Content-Type: application/json

{
  "student_id": "student-456",
  "exercise_id": "ex-789",
  "code": "def sum_list(numbers):\n    total = 0\n    for n in numbers:\n        total += n\n    return total"
}
```

### Expected Sequence

1. **Exercise Service** grades submission
   - Runs test cases
   - Calculates pass/fail
   - Records attempt in database
   - Publishes `exercise.completed` event

2. **Progress Service** updates mastery
   - Increases exercise_score (+15 points)
   - Recalculates overall mastery
   - Updates mastery_level if threshold crossed

### Final Response

```json
{
  "result": "passed",
  "test_results": {
    "total_cases": 5,
    "passed_cases": 5,
    "failed_cases": []
  },
  "mastery_update": {
    "topic": "data-structures:lists",
    "previous_score": 37,
    "new_score": 52,
    "previous_level": "Beginner",
    "new_level": "Learning"
  },
  "next_exercise_suggested": {
    "topic": "data-structures:dictionaries",
    "difficulty": "beginner"
  }
}
```

---

## Scenario 5: Teacher Views Struggle Alerts

### Flow

```
Teacher Frontend → Progress Service (Query)
```

### Request

```http
GET /api/v1/progress/struggles?class_id=class-101
Authorization: Bearer <teacher-token>
```

### Expected Sequence

1. **Progress Service** queries struggles
   - Filters by class (student roster lookup)
   - Returns active struggle alerts
   - Includes student details and struggle type

### Final Response

```json
{
  "struggles": [
    {
      "student_id": "student-789",
      "student_name": "James Wilson",
      "topic": "data-structures:list-comprehensions",
      "struggle_type": "repeated_error",
      "error_count": 3,
      "error_type": "SyntaxError",
      "first_seen": "2025-01-22T09:15:00Z",
      "last_seen": "2025-01-22T10:45:00Z",
      "suggested_action": "assign_practice_exercise"
    }
  ],
  "total_active_struggles": 1
}
```

---

## Scenario 6: Struggle Detection Triggered

### Flow

```
Student Activity → Debug Service → Progress Service → (Alert) Teacher Dashboard
```

### Context

Student has submitted code with `NameError` 3 times in the last 10 minutes on the same topic.

### Expected Sequence

1. **Debug Service** detects repeated error
   - Counts error frequency per student/topic
   - Triggers threshold (3+ same error type)
   - Publishes `struggle.alert` event

2. **Progress Service** receives alert
   - Creates struggle record in database
   - Links to student progress
   - Notifies teacher dashboard (via webhook)

### Event Published

```json
{
  "event_type": "struggle.alert",
  "timestamp": "2025-01-22T10:50:00Z",
  "student_id": "student-789",
  "topic": "basics:variables",
  "struggle_type": "repeated_error",
  "error_type": "NameError",
  "error_count": 3,
  "severity": "high"
}
```

---

## Test Setup

### Prerequisites

```bash
# Verify infrastructure
kubectl get pods -n kafka
kubectl get pods -n postgres

# Deploy services
kubectl apply -f backend/k8s/namespace.yaml
kubectl apply -f backend/triage-service/k8s/
kubectl apply -f backend/concepts-service/k8s/
# ... (all services)
```

### Create Test Data

```sql
-- Insert test student
INSERT INTO students (id, email, name, role)
VALUES ('student-456', 'test@example.com', 'Test Student', 'student');

-- Set initial progress
INSERT INTO student_progress (student_id, module, topic, mastery_score, mastery_level)
VALUES ('student-456', 'control-flow', 'for-loops', 35.0, 'Beginner');
```

### Run Scenarios

```bash
# Scenario 1: Query routing
curl -X POST http://localhost:8001/api/v1/triage \
  -H "Content-Type: application/json" \
  -d '{"conversation_id": "conv-123", "student_id": "student-456", "message": "How do for loops work?"}'

# Scenario 2: Debug analysis
curl -X POST http://localhost:8003/api/v1/debug/analyze \
  -H "Content-Type: application/json" \
  -d '{"student_id": "student-456", "code": "for i in range(10\n    print(i)", "language": "python"}'

# Scenario 3: Exercise generation
curl -X POST http://localhost:8004/api/v1/exercise/generate \
  -H "Content-Type: application/json" \
  -d '{"student_id": "student-456", "topic": "data-structures:lists", "difficulty": "beginner"}'

# Scenario 4: Exercise submission
curl -X POST http://localhost:8004/api/v1/exercise/submit \
  -H "Content-Type: application/json" \
  -d '{"student_id": "student-456", "exercise_id": "ex-789", "code": "def sum_list(numbers):\n    total = 0\n    for n in numbers:\n        total += n\n    return total"}'
```

---

## Validation Checklist

- [ ] All services respond to health checks
- [ ] Triage routes concepts → concepts-service
- [ ] Triage routes errors → debug-service
- [ ] Triage routes exercises → exercise-service
- [ ] Concepts service adapts explanations to mastery level
- [ ] Debug service provides progressive hints
- [ ] Exercise service generates appropriate challenges
- [ ] Exercise service auto-grades submissions
- [ ] Progress service updates mastery correctly
- [ ] Code review service analyzes quality
- [ ] Struggle alerts trigger after 3+ same errors
- [ ] Events flow between services via Kafka
- [ ] State persists across service restarts
