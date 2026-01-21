# Phase 4: Backend Services Specification

**Status**: Draft
**Phase**: 4
**Focus**: Build FastAPI microservices with Dapr sidecars and AI agent integration for LearnFlow

---

## Overview

Build the backend microservices architecture for the LearnFlow multi-agent learning platform. Each service is:
- **FastAPI-based**: RESTful API endpoints
- **Dapr-enabled**: Service mesh for state management, pub/sub, and service invocation
- **Agent-integrated**: AI agents for tutoring capabilities
- **Stateless**: All state managed by Dapr or PostgreSQL

### Services to Deploy

| Service | Port | Agent | Dapr Components |
|---------|---------|-------|-----------------|
| **triage-service** | 8001 | Triage Agent | Pub/Sub, Service Invocation |
| **concepts-service** | 8002 | Concepts Agent | State store, Pub/Sub |
| **debug-service** | 8003 | Debug Agent | State store, Pub/Sub |
| **exercise-service** | 8004 | Exercise Agent | State store, Pub/Sub |
| **progress-service** | 8005 | Progress Agent | State store, Pub/Sub |
| **code-review-service** | 8006 | Code Review Agent | State store, Pub/Sub |

---

## Success Criteria

- [ ] All 6 FastAPI services deployed to Minikube
- [ ] Each service has Dapr sidecar running
- [ ] Services communicate via Dapr service invocation
- [ ] Kafka pub/sub configured for event streaming
- [ ] AI agents integrated with OpenAI SDK
- [ ] PostgreSQL schemas created for each service
- [ ] Health endpoints responding on all services
- [ ] Zero manual intervention - autonomous deployment via Skills

---

## Architecture

### Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                         MINIKUBE CLUSTER                              │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  NAMESPACE: learnflow                                             │ │
│  │                                                                  │ │
│  │  ┌──────────────────┐         ┌──────────────────┐              │ │
│  │  │ triage-service   │         │ concepts-service │              │ │
│  │  │ + FastAPI        │◄────────┤ + FastAPI        │              │ │
│  │  │ + Dapr Sidecar   │ Invoke  │ + Dapr Sidecar   │              │ │
│  │  │ + Triage Agent   │         │ + Concepts Agent │              │ │
│  │  └────────┬─────────┘         └────────┬─────────┘              │ │
│  │           │                            │                          │ │
│  │           │ Pub/Sub                   │ Pub/Sub                  │ │
│  │           ▼                            ▼                          │ │
│  │  ┌──────────────────┐         ┌──────────────────┐              │ │
│  │  │ debug-service    │         │ exercise-service │              │ │
│  │  │ + FastAPI        │◄────────┤ + FastAPI        │              │ │
│  │  │ + Dapr Sidecar   │ Invoke  │ + Dapr Sidecar   │              │ │
│  │  │ + Debug Agent    │         │ + Exercise Agent │              │ │
│  │  └────────┬─────────┘         └────────┬─────────┘              │ │
│  │           │                            │                          │ │
│  │           │ Pub/Sub                   │ Pub/Sub                  │ │
│  │           ▼                            ▼                          │ │
│  │  ┌──────────────────┐         ┌──────────────────┐              │ │
│  │  │progress-service  │         │code-review-svc   │              │ │
│  │  │ + FastAPI        │◄────────┤ + FastAPI        │              │ │
│  │  │ + Dapr Sidecar   │ Invoke  │ + Dapr Sidecar   │              │ │
│  │  │ + Progress Agent │         │ + CodeReview Agnt │              │ │
│  │  └────────┬─────────┘         └────────┬─────────┘              │ │
│  │           │                            │                          │ │
│  │           │ Pub/Sub                   │ Pub/Sub                  │ │
│  │           ▼                            ▼                          │ │
│  │  ┌──────────────────┐         ┌──────────────────┐              │ │
│  │  │   KAFKA          │         │  POSTGRESQL      │              │ │
│  │  │  (Pub/Sub)      │         │  (State Store)   │              │ │
│  │  │                  │         │                  │              │ │
│  │  │ learning.*       │         │                  │              │ │
│  │  │ code.*           │         │                  │              │ │
│  │  │ exercise.*       │         │                  │              │ │
│  │  │ struggle.*       │         │                  │              │ │
│  │  └──────────────────┘         └──────────────────┘              │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **API Framework** | FastAPI 0.104+ | RESTful endpoints |
| **AI SDK** | OpenAI SDK (AsyncOpenAI) | Agent integration |
| **Service Mesh** | Dapr 1.12+ | Sidecar pattern |
| **Pub/Sub** | Kafka (via Dapr) | Event streaming |
| **State Store** | PostgreSQL (via Dapr) | Persistence |
| **Container** | Docker | Deployment |
| **Orchestration** | Kubernetes | Service management |

---

## Requirements

### Common Requirements (All Services)

**Minimum Configuration**:
- Python 3.11+
- FastAPI with async/await
- Dapr sidecar with default ports (3500 HTTP, 50001 gRPC)
- Health check endpoint: `/health`
- OpenAPI documentation at `/docs`
- Structured logging with JSON output

**Dapr Components**:
- `pubsub` component for Kafka
- `state` component for PostgreSQL
- `secret` component for environment variables

**Acceptance Criteria**:
- [ ] Service container running
- [ ] Dapr sidecar running
- [ ] Health endpoint returns 200
- [ ] Can invoke other services via Dapr
- [ ] Can publish/subscribe to Kafka topics

### 1. Triage Service

**Port**: 8001
**Dapr App ID**: `triage-service`

**Endpoints**:
```python
POST /api/v1/triage
"""
Analyzes student query and routes to appropriate specialist agent.

Request:
{
    "conversation_id": "uuid",
    "student_id": "uuid",
    "message": "How do for loops work in Python?"
}

Response:
{
    "agent": "concepts",
    "confidence": 0.95,
    "reasoning": "Query asks for explanation, not debugging"
}
"""
```

**Agent**: Triage Agent
- Classifies queries into: explain, debug, exercise, progress
- Uses keyword analysis + LLM classification
- Publishes `learning.triage` event with routing decision

**Events Published**:
- `learning.triage` - Routing decisions for analytics

**Events Subscribed**:
- `code.submission` - Code submissions requiring triage

---

### 2. Concepts Service

**Port**: 8002
**Dapr App ID**: `concepts-service`

**Endpoints**:
```python
POST /api/v1/concepts/explain
"""
Explains a Python concept with examples.

Request:
{
    "conversation_id": "uuid",
    "student_id": "uuid",
    "concept": "for loops",
    "level": "beginner"
}

Response:
{
    "explanation": "A for loop iterates over sequences...",
    "examples": ["for i in range(5):", "for item in list:"],
    "complexity": "beginner",
    "related_concepts": ["while loops", "range()"]
}
"""
```

**Agent**: Concepts Agent
- Explains Python concepts from 8-module curriculum
- Adapts explanation to student's mastery level
- Provides code examples and visualizations
- Tracks which concepts have been covered

**Python Curriculum (8 Modules)**:

| Module | Topics | Concepts | Difficulty |
|--------|--------|----------|------------|
| **1. Basics** | Variables, Data Types, Input/Output, Operators, Type Conversion | print(), input(), int, float, str, bool, arithmetic operators, type() | Beginner |
| **2. Control Flow** | Conditionals, Loops, Break/Continue | if/elif/else, for loops, while loops, range(), break, continue | Beginner |
| **3. Data Structures** | Lists, Tuples, Dictionaries, Sets | list[], tuple{}, dict{}, set(), indexing, slicing, methods | Intermediate |
| **4. Functions** | Defining Functions, Parameters, Return Values, Scope | def, return, args, kwargs, lambda, scope, nested functions | Intermediate |
| **5. OOP** | Classes & Objects, Attributes & Methods, Inheritance, Encapsulation | class, __init__, self, inheritance, super(), private attributes | Intermediate |
| **6. Files** | Reading/Writing Files, CSV Processing, JSON Handling | open(), read(), write(), with, csv module, json module, file paths | Advanced |
| **7. Errors** | Try/Except, Exception Types, Custom Exceptions, Debugging | try, except, finally, raise, Exception types, traceback, logging | Advanced |
| **8. Libraries** | Installing Packages, Working with APIs, Virtual Environments | pip, requests, virtualenv/venv, pipenv, PyPI, API calls | Advanced |

**State Management** (via Dapr):
- Student's current module
- Concepts explained per session
- Explanation history
- Module completion progress

**Events Published**:
- `learning.concept_explained` - When concept is explained

**Events Subscribed**:
- `learning.triage` - Routing requests for explanations

---

### 3. Debug Service

**Port**: 8003
**Dapr App ID**: `debug-service`

**Endpoints**:
```python
POST /api/v1/debug/analyze
"""
Analyzes code error and provides hints.

Request:
{
    "conversation_id": "uuid",
    "student_id": "uuid",
    "code": "for i in range(5",
    "error": "SyntaxError: unexpected EOF"
}

Response:
{
    "root_cause": "Missing closing parenthesis",
    "hints": [
        "Check that all opening parentheses have matching closing ones",
        "The range() function needs complete parentheses"
    ],
    "severity": "error",
    "suggestion": "for i in range(5):"
}
"""
```

**Agent**: Debug Agent
- Parses Python errors (SyntaxError, NameError, TypeError, etc.)
- Identifies root causes
- Provides progressive hints (not direct solutions)
- Tracks repeated errors for struggle detection

**Struggle Detection**:
- Same error type 3+ times → trigger alert
- 5+ failed executions → trigger alert

**Events Published**:
- `struggle.alert` - When struggle detected
- `code.error_analyzed` - Error analysis for analytics

**Events Subscribed**:
- `learning.triage` - Routing requests for debugging
- `code.submission` - Code with errors

---

### 4. Exercise Service

**Port**: 8004
**Dapr App ID**: `exercise-service`

**Endpoints**:
```python
POST /api/v1/exercise/generate
"""
Generates coding exercise for a topic.

Request:
{
    "student_id": "uuid",
    "topic": "for loops",
    "difficulty": "easy",
    "count": 3
}

Response:
{
    "exercises": [
        {
            "id": "uuid",
            "prompt": "Write a for loop that prints numbers 1-5",
            "starter_code": "# Your code here",
            "test_cases": [...],
            "hints": ["Use range(1, 6)"]
        }
    ]
}
"""

POST /api/v1/exercise/submit
"""
Submits solution and returns auto-grading result.

Request:
{
    "exercise_id": "uuid",
    "student_id": "uuid",
    "code": "for i in range(1, 6):\n    print(i)"
}

Response:
{
    "passed": true,
    "test_results": [...],
    "feedback": "Great job! Your solution works correctly.",
    "points_earned": 10
}
"""
```

**Agent**: Exercise Agent
- Generates exercises from template bank
- Auto-grades submissions using test cases
- Tracks exercise completion rates
- Provides hints on request

**Exercise Database**:
- 8 modules × 5 topics × 3 difficulties = 120+ exercises
- Template-based generation for infinite variety

**Events Published**:
- `exercise.attempt` - Exercise attempts for analytics
- `exercise.completed` - When exercise passed

**Events Subscribed**:
- `learning.triage` - Routing requests for exercises

---

### 5. Progress Service

**Port**: 8005
**Dapr App ID**: `progress-service`

**Endpoints**:
```python
GET /api/v1/progress/{student_id}
"""
Returns student's mastery progress.

Response:
{
    "student_id": "uuid",
    "overall_mastery": 0.68,
    "modules": [
        {
            "name": "Control Flow",
            "mastery": 0.60,
            "level": "learning",
            "exercises_completed": 4,
            "quiz_score": 0.80,
            "streak_days": 3
        }
    ],
    "next_recommendation": "Continue with while loops"
}
"""

POST /api/v1/progress/update
"""
Updates progress after activity.

Request:
{
    "student_id": "uuid",
    "activity_type": "exercise",
    "module": "Control Flow",
    "score": 1.0
}

Response:
{
    "updated": true,
    "new_mastery": 0.68,
    "level_changed": false
}
"""
```

**Agent**: Progress Agent
- Calculates mastery using weighted formula:
  - Exercise completion: 40%
  - Quiz scores: 30%
  - Code quality: 20%
  - Consistency (streak): 10%
- Determines mastery levels:
  - 0-40% → Beginner (Red)
  - 41-70% → Learning (Yellow)
  - 71-90% → Proficient (Green)
  - 91-100% → Mastered (Blue)

**State Management** (via Dapr):
- Student progress records
- Mastery scores per module
- Activity history

**Events Published**:
- `learning.progress` - Progress updates for analytics

**Events Subscribed**:
- `exercise.completed` - Update progress on completion
- `code.submission` - Track code quality

---

## Database Schema

### Tables

```sql
-- Students
CREATE TABLE students (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP
);

-- Progress Tracking
CREATE TABLE student_progress (
    student_id UUID REFERENCES students(id),
    module VARCHAR(100) NOT NULL,
    mastery_level DECIMAL(3,2) DEFAULT 0.0,
    exercise_score DECIMAL(3,2) DEFAULT 0.0,
    quiz_score DECIMAL(3,2) DEFAULT 0.0,
    code_quality_score DECIMAL(3,2) DEFAULT 0.0,
    streak_days INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (student_id, module)
);

-- Exercise Attempts
CREATE TABLE exercise_attempts (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    exercise_id UUID NOT NULL,
    code TEXT,
    passed BOOLEAN,
    attempts INTEGER,
    completed_at TIMESTAMP
);

-- Code Submissions
CREATE TABLE code_submissions (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    code TEXT NOT NULL,
    error_message TEXT,
    executed_at TIMESTAMP
);

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    agent_type VARCHAR(50),
    messages JSONB,
    started_at TIMESTAMP,
    ended_at TIMESTAMP
);
```

---

## Skills Used

### fastapi-dapr-agent

**Location**: `.claude/skills/fastapi-dapr-agent/`

**Scripts**:
- `scripts/generate.py` - Generates FastAPI + Dapr service scaffold
- `scripts/deploy.sh` - Deploys service to Kubernetes with Dapr sidecar

**Usage**:
```bash
# Generate service scaffold
python .claude/skills/fastapi-dapr-agent/scripts/generate.py \
    --name concepts-service \
    --port 8002 \
    --agent concepts

# Deploy to Kubernetes
./.claude/skills/fastapi-dapr-agent/scripts/deploy.sh
```

---

## Dapr Configuration

### Component: PubSub (Kafka)

**File**: `dapr/components/pubsub.yaml`

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: pubsub
  namespace: learnflow
spec:
  type: pubsub.kafka
  version: v1
  metadata:
    - name: brokers
      value: "kafka.kafka.svc.cluster.local:9092"
    - name: consumerGroup
      value: "learnflow-services"
    - name: authRequired
      value: "false"
```

### Component: State Store (PostgreSQL)

**File**: `dapr/components/statestore.yaml`

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
  namespace: learnflow
spec:
  type: state.postgresql
  version: v1
  metadata:
    - name: connectionString
      secretKeyRef:
        name: postgres-credentials
        key: connection-string
    - name: tableName
      value: "state"
```

---

## Validation

### Health Check Scripts

```bash
# Check all services
for service in triage concepts debug exercise progress; do
    echo "Checking $service-service..."
    curl -f http://$service-service:8000/health || echo "FAILED"
done

# Check Dapr sidecars
kubectl get pods -n learnflow -l dapr.io/enabled=true

# Check Kafka connectivity
kubectl exec -n learnflow triage-service-0 -- \
    dapr list --app-id triage-service
```

---

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Response time (health) | < 100ms |
| Response time (AI call) | < 5s |
| Memory per service | 256MB |
| CPU per service | 100m |
| Availability | 99% (dev) |
| Cold start time | < 10s |

---

## Dependencies

**Required**:
- Kafka deployed (from Phase 3)
- PostgreSQL deployed (from Phase 3)
- Helm installed (from Phase 1)
- fastapi-dapr-agent skill (available)

**Blocking**:
- Phase 3 must be complete
- `OPENAI_API_KEY` must be configured

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OpenAI API rate limits | Medium | High | Implement retry with exponential backoff |
| Dapr sidecar connection issues | Low | Medium | Use proper service discovery |
| Kafka consumer lag | Medium | Medium | Monitor consumer group offsets |
| Agent response timeout | Low | High | Set 30s timeout, fallback to cached response |

### 6. Code Review Service

**Port**: 8006
**Dapr App ID**: `code-review-service`

**Endpoints**:
```python
POST /api/v1/review/analyze
"""
Analyzes code for correctness, style (PEP 8), efficiency, and readability.

Request:
{
    "conversation_id": "uuid",
    "student_id": "uuid",
    "code": "for i in range(5):\nprint(i)"
}

Response:
{
    "correctness": {
        "has_errors": false,
        "issues": []
    },
    "style": {
        "pep8_compliant": true,
        "violations": [],
        "score": 95
    },
    "efficiency": {
        "rating": "good",
        "suggestions": [],
        "time_complexity": "O(n)"
    },
    "readability": {
        "score": 85,
        "suggestions": ["Add docstring", "Use more descriptive variable names"]
    },
    "overall_score": 90
}
"""
```

**Agent**: Code Review Agent
- Analyzes code for correctness (syntax errors, runtime errors)
- Checks PEP 8 style compliance
- Evaluates efficiency (time/space complexity)
- Assesses readability (naming, comments, structure)
- Provides constructive feedback
- Tracks code quality scores for mastery calculation

**Quality Metrics**:
- **Correctness** (40%): Code runs without errors, produces expected output
- **Style** (25%): PEP 8 compliance, formatting
- **Efficiency** (20%): Algorithmic complexity, best practices
- **Readability** (15%): Naming, comments, structure

**State Management** (via Dapr):
- Student code quality history
- Common mistakes per topic
- Style violation patterns
- Improvement tracking over time

**Events Published**:
- `code.reviewed` - When code is reviewed
- `code.quality_updated` - When quality score changes

**Events Subscribed**:
- `code.submission` - Auto-review on submission
- `learning.triage` - Routing requests for code review

---

## Deliverables

1. **6 FastAPI Services**
   - Deployed to `learnflow` namespace
   - Each with Dapr sidecar
   - All health endpoints responding

2. **Dapr Components**
   - PubSub configured for Kafka
   - State store configured for PostgreSQL
   - Components applied to cluster

3. **Database Schemas**
   - All tables created
   - Seed data loaded
   - Migrations documented

4. **Documentation**
   - API documentation at `/docs` for each service
   - Event schema documented
   - Deployment playbook

---

## Next Phase

After Phase 4 completion, proceed to **Phase 5: Frontend Development** where the Next.js application with Monaco editor will be built to consume these backend services.
