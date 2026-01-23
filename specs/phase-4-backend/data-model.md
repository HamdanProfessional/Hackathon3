# Phase 4: Backend Services - Data Model

**Phase**: 4
**Status**: Draft

---

## Entity Definitions

### Student

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique student identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Student email |
| name | VARCHAR(255) | NOT NULL | Full name |
| role | VARCHAR(20) | NOT NULL, CHECK IN ('student', 'teacher') | User role |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| last_active | TIMESTAMP | | Last activity timestamp |

**Indexes**:
- `idx_student_email` on (email)
- `idx_student_last_active` on (last_active)

---

### StudentProgress

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| student_id | UUID | PRIMARY KEY, FOREIGN KEY → Student.id | Student reference |
| module | VARCHAR(50) | PRIMARY KEY | Module identifier (e.g., "basics", "control-flow") |
| topic | VARCHAR(100) | PRIMARY KEY | Topic within module (e.g., "for-loops") |
| mastery_score | DECIMAL(5,2) | CHECK 0-100 | Overall mastery (0-100) |
| exercise_score | DECIMAL(5,2) | CHECK 0-100 | Exercise contribution (40%) |
| quiz_score | DECIMAL(5,2) | CHECK 0-100 | Quiz contribution (30%) |
| code_quality_score | DECIMAL(5,2) | CHECK 0-100 | Code quality contribution (20%) |
| streak_days | INTEGER | DEFAULT 0, CHECK >=0 | Consistency contribution (10%) |
| mastery_level | VARCHAR(20) | CHECK IN ('Beginner', 'Learning', 'Proficient', 'Mastered') | Computed from score |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_progress_student` on (student_id)
- `idx_progress_module_topic` on (module, topic)

**Mastery Level Calculation**:
```
mastery_score = (exercise_score * 0.40) + (quiz_score * 0.30) + (code_quality_score * 0.20) + (streak_days * 2)

IF mastery_score <= 40 THEN mastery_level = 'Beginner'
ELSE IF mastery_score <= 70 THEN mastery_level = 'Learning'
ELSE IF mastery_score <= 90 THEN mastery_level = 'Proficient'
ELSE mastery_level = 'Mastered'
```

---

### Exercise

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique exercise identifier |
| module | VARCHAR(50) | NOT NULL | Module reference |
| topic | VARCHAR(100) | NOT NULL | Topic reference |
| difficulty | VARCHAR(20) | CHECK IN ('beginner', 'intermediate', 'advanced') | Difficulty level |
| title | VARCHAR(255) | NOT NULL | Exercise title |
| description | TEXT | NOT NULL | Exercise instructions |
| starter_code | TEXT | | Optional starter code |
| test_cases | JSONB | NOT NULL | Test case definitions |
| hints | JSONB | | Hint progression array |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- `idx_exercise_module_topic` on (module, topic)
- `idx_exercise_difficulty` on (difficulty)

**Test Cases Schema**:
```json
{
  "cases": [
    {
      "id": "tc1",
      "input": "test_function()",
      "expected": "expected_output",
      "hidden": false
    }
  ]
}
```

**Hints Schema**:
```json
{
  "hints": [
    {"level": 1, "text": "First hint: check loop syntax"},
    {"level": 2, "text": "Second hint: consider range()"},
    {"level": 3, "text": "Third hint: use for i in range(10):"}
  ]
}
```

---

### ExerciseAttempt

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique attempt identifier |
| student_id | UUID | FOREIGN KEY → Student.id, NOT NULL | Student reference |
| exercise_id | UUID | FOREIGN KEY → Exercise.id, NOT NULL | Exercise reference |
| code | TEXT | NOT NULL | Submitted code |
| passed | BOOLEAN | NOT NULL | Pass/fail result |
| test_results | JSONB | | Detailed test results |
| hints_shown | INTEGER | DEFAULT 0 | Number of hints requested |
| time_spent_seconds | INTEGER | | Time spent on exercise |
| submitted_at | TIMESTAMP | DEFAULT NOW() | Submission timestamp |

**Indexes**:
- `idx_attempt_student_exercise` on (student_id, exercise_id)
- `idx_attempt_student` on (student_id)

**Test Results Schema**:
```json
{
  "total_cases": 5,
  "passed_cases": 3,
  "failed_cases": [
    {
      "case_id": "tc3",
      "expected": "5",
      "actual": "Error: name 'x' not defined"
    }
  ]
}
```

---

### CodeSubmission

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique submission identifier |
| student_id | UUID | FOREIGN KEY → Student.id, NOT NULL | Student reference |
| conversation_id | UUID | | Associated conversation |
| code | TEXT | NOT NULL | Submitted code |
| error_message | TEXT | | Error if execution failed |
| executed | BOOLEAN | DEFAULT FALSE | Whether code executed |
| execution_output | TEXT | | Output from execution |
| submitted_at | TIMESTAMP | DEFAULT NOW() | Submission timestamp |

**Indexes**:
- `idx_submission_student` on (student_id)
- `idx_submission_conversation` on (conversation_id)

---

### CodeReview

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique review identifier |
| submission_id | UUID | FOREIGN KEY → CodeSubmission.id, NOT NULL | Submission reference |
| correctness_score | DECIMAL(5,2) | CHECK 0-100 | Correctness rating |
| style_score | DECIMAL(5,2) | CHECK 0-100 | PEP 8 compliance |
| efficiency_score | DECIMAL(5,2) | CHECK 0-100 | Time/space complexity |
| readability_score | DECIMAL(5,2) | CHECK 0-100 | Naming, comments, structure |
| overall_score | DECIMAL(5,2) | CHECK 0-100 | Weighted average |
| feedback | JSONB | | Detailed feedback |
| reviewed_at | TIMESTAMP | DEFAULT NOW() | Review timestamp |

**Indexes**:
- `idx_review_submission` on (submission_id)

**Feedback Schema**:
```json
{
  "correctness": {
    "score": 100,
    "issues": []
  },
  "style": {
    "score": 85,
    "issues": ["line 4: missing space after comma"]
  },
  "efficiency": {
    "score": 75,
    "issues": ["could use list comprehension"]
  },
  "readability": {
    "score": 90,
    "issues": []
  }
}
```

**Overall Score Formula**:
```
overall_score = (correctness_score * 0.40) + (style_score * 0.20) + (efficiency_score * 0.20) + (readability_score * 0.20)
```

---

### Conversation

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique conversation identifier |
| student_id | UUID | FOREIGN KEY → Student.id, NOT NULL | Student reference |
| topic | VARCHAR(100) | | Associated topic |
| messages | JSONB | NOT NULL | Message history |
| started_at | TIMESTAMP | DEFAULT NOW() | Start timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_conversation_student` on (student_id)
- `idx_conversation_topic` on (topic)

**Messages Schema**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "How do for loops work?",
      "timestamp": "2025-01-22T10:30:00Z"
    },
    {
      "role": "assistant",
      "content": "A for loop iterates over a sequence...",
      "agent": "concepts",
      "timestamp": "2025-01-22T10:30:02Z"
    }
  ]
}
```

---

## Relationships

```
Student (1) ----< (N) StudentProgress
Student (1) ----< (N) ExerciseAttempt
Student (1) ----< (N) CodeSubmission
Student (1) ----< (N) Conversation

Exercise (1) ----< (N) ExerciseAttempt

CodeSubmission (1) ----< (1) CodeReview
CodeSubmission (N) ----< (1) Conversation
```

---

## State Transitions

### Mastery Level Progression

```
Beginner (0-40%)
    |
    v (score increases)
Learning (41-70%)
    |
    v (score increases)
Proficient (71-90%)
    |
    v (score increases)
Mastered (91-100%)
```

### Exercise Attempt Flow

```
[Start] -> [In Progress] -> [Submitted] -> [Graded]
              |                |
              v                v
           [Hint 1]         [Pass]
              |                |
           [Hint 2]           v
              |            [Complete]
           [Hint 3]
```

---

## Data Access Patterns

### Read Patterns

1. **Get Student Progress**: `SELECT * FROM student_progress WHERE student_id = ?`
2. **Get Exercise by Topic**: `SELECT * FROM exercises WHERE module = ? AND topic = ? ORDER BY RANDOM() LIMIT 1`
3. **Get Conversation History**: `SELECT messages FROM conversations WHERE id = ?`
4. **Get Recent Submissions**: `SELECT * FROM code_submissions WHERE student_id = ? ORDER BY submitted_at DESC LIMIT 10`

### Write Patterns

1. **Update Mastery**: `INSERT INTO student_progress (...) ON CONFLICT DO UPDATE`
2. **Record Attempt**: `INSERT INTO exercise_attempts (...)`
3. **Append Message**: `UPDATE conversations SET messages = messages || ?, updated_at = NOW()`
4. **Create Review**: `INSERT INTO code_reviews (...)`

---

## Partitioning Strategy

**Dapr State Key Format**:
```
{student_prefix}:{student_id}:{entity_type}:{entity_id}

Example: a1:550e8400-e29b-41d4-a716-446655440000:progress:basics:for-loops
```

**Benefits**:
- Even distribution across state store partitions
- Efficient queries by student
- Supports future sharding by prefix range
