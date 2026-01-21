# Phase 4: Backend Services - Implementation Plan

**Phase**: 4
**Focus**: Build FastAPI microservices with Dapr sidecars and AI agent integration
**Status**: Draft

---

## Architecture Overview

Building 6 FastAPI microservices for LearnFlow:

1. **triage-service** (Port 8001) - Routes queries to specialist agents
2. **concepts-service** (Port 8002) - Explains Python concepts
3. **debug-service** (Port 8003) - Analyzes errors and provides hints
4. **exercise-service** (Port 8004) - Generates and auto-grades exercises
5. **progress-service** (Port 8005) - Tracks mastery and progress
6. **code-review-service** (Port 8006) - Analyzes code quality and style

Each service:
- Uses FastAPI with async/await
- Has Dapr sidecar for state management and pub/sub
- Integrates OpenAI SDK for AI agent
- Follows stateless service principles
- Has health check endpoint

---

## Implementation Strategy

### Approach: Skills-Based Autonomous Build

**Principle**: Use `fastapi-dapr-agent` skill to generate service scaffolds, then implement agent logic.

**Build Process**:
1. Use `fastapi-dapr-agent` skill to generate service scaffold
2. Implement AI agent with AsyncOpenAI SDK
3. Add Dapr integration for state/pubsub
4. Create database models and schemas
5. Write tests
6. Deploy to Kubernetes

---

## Step-by-Step Implementation

### Step 1: Prerequisites Verification

**Goal**: Ensure infrastructure from Phase 3 is ready.

**Actions**:
- [ ] Verify Kafka is running: `kubectl get pods -n kafka`
- [ ] Verify PostgreSQL is running: `kubectl get pods -n postgres`
- [ ] Verify namespaces exist: `kubectl get ns`
- [ ] Test database connectivity
- [ ] Test Kafka topic creation

**Commands**:
```bash
# Check Kafka
kubectl get pods -n kafka
kubectl exec -n kafka kafka-0 -- kafka-topics.sh --list --bootstrap-server localhost:9092

# Check PostgreSQL
kubectl get pods -n postgres
kubectl exec -n postgres postgres-0 -- psql -U learnflow_user -d learnflow -c "SELECT 1;"
```

---

### Step 2: Common Foundation Code

**Goal**: Create shared code for all services.

**Components**:
- `common/models.py` - Pydantic models
- `common/database.py` - Database connection
- `common/dapr_client.py` - Dapr client wrapper
- `common/agent_base.py` - Base agent class

**Implementation**:
```python
# common/models.py
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class StudentProgress(BaseModel):
    student_id: UUID
    module: str
    mastery_level: float
    exercise_score: float
    quiz_score: float
    streak_days: int

class CodeSubmission(BaseModel):
    id: UUID
    student_id: UUID
    code: str
    error_message: Optional[str]
    executed_at: datetime

# common/dapr_client.py
from dapr.clients import DaprClient
import json

class DaprClientWrapper:
    def __init__(self):
        self.client = DaprClient()

    async def publish_event(self, topic: str, data: dict):
        await self.client.publish_event(
            pubsub_name="pubsub",
            topic_name=topic,
            data=json.dumps(data),
        )

    async def get_state(self, key: str) -> dict:
        state = await self.client.get_state(
            store_name="statestore",
            key=key
        )
        return json.loads(state.data) if state.data else {}

    async def save_state(self, key: str, data: dict):
        await self.client.save_state(
            store_name="statestore",
            key=key,
            value=json.dumps(data)
        )
```

---

### Step 3: Triage Service

**Goal**: Create service that routes queries to appropriate specialists.

**Using fastapi-dapr-agent Skill**:
```bash
python .claude/skills/fastapi-dapr-agent/scripts/generate.py \
    --name triage-service \
    --port 8001 \
    --agent triage
```

**Implementation Tasks**:
1. **Triage Agent Logic**
   - Implement query classification
   - Use LLM for intent detection
   - Route to: concepts, debug, exercise, progress

2. **API Endpoint**
   - POST /api/v1/triage
   - Request: { conversation_id, student_id, message }
   - Response: { agent, confidence, reasoning }

3. **Dapr Integration**
   - Publish to `learning.triage` topic
   - Subscribe to `code.submission` topic

**Code Structure**:
```python
# agents/triage_agent.py
from openai import AsyncOpenAI
from typing import Literal

class TriageAgent:
    def __init__(self):
        self.client = AsyncOpenAI()

    async def route_query(self, message: str) -> dict:
        """Classify query and determine appropriate agent."""
        response = await self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Classify query into: concepts, debug, exercise, progress"},
                {"role": "user", "content": message}
            ],
            functions=[...],
            function_call="auto"
        )
        return self._parse_response(response)

# main.py
from fastapi import FastAPI
from agents.triage_agent import TriageAgent
from common.dapr_client import DaprClientWrapper

app = FastAPI(title="Triage Service")
agent = TriageAgent()
dapr = DaprClientWrapper()

@app.post("/api/v1/triage")
async def triage(request: TriageRequest):
    result = await agent.route_query(request.message)
    await dapr.publish_event("learning.triage", result)
    return result
```

---

### Step 4: Concepts Service

**Goal**: Create service that explains Python concepts with examples.

**Using fastapi-dapr-agent Skill**:
```bash
python .claude/skills/fastapi-dapr-agent/scripts/generate.py \
    --name concepts-service \
    --port 8002 \
    --agent concepts
```

**Implementation Tasks**:
1. **Concepts Agent Logic**
   - Explain Python concepts from 8-module curriculum
   - Adapt explanation to student's mastery level
   - Provide code examples

2. **API Endpoint**
   - POST /api/v1/concepts/explain
   - Request: { conversation_id, student_id, concept, level }
   - Response: { explanation, examples, complexity, related_concepts }

3. **State Management**
   - Track student's current module
   - Track concepts explained per session

**Curriculum Coverage**:
```python
# curriculum.py
CURRICULUM = {
    "basics": {
        "topics": ["variables", "data_types", "input_output", "operators", "type_conversion"],
        "level": "beginner"
    },
    "control_flow": {
        "topics": ["if_statements", "for_loops", "while_loops", "break_continue"],
        "level": "beginner"
    },
    "data_structures": {
        "topics": ["lists", "tuples", "dictionaries", "sets"],
        "level": "intermediate"
    },
    # ... 8 modules total
}
```

---

### Step 5: Debug Service

**Goal**: Create service that analyzes errors and provides hints.

**Using fastapi-dapr-agent Skill**:
```bash
python .claude/skills/fastapi-dapr-agent/scripts/generate.py \
    --name debug-service \
    --port 8003 \
    --agent debug
```

**Implementation Tasks**:
1. **Debug Agent Logic**
   - Parse Python errors
   - Identify root causes
   - Provide progressive hints (not solutions)

2. **API Endpoint**
   - POST /api/v1/debug/analyze
   - Request: { conversation_id, student_id, code, error }
   - Response: { root_cause, hints, severity, suggestion }

3. **Struggle Detection**
   - Track repeated errors (same error 3+ times)
   - Publish to `struggle.alert` topic when detected

**Error Handling**:
```python
# agents/debug_agent.py
class DebugAgent:
    ERROR_PATTERNS = {
        "SyntaxError": {
            "unexpected_eof": "Missing closing parenthesis or bracket",
            "invalid_syntax": "Check for typos or missing colons",
        },
        "NameError": {
            "not_defined": "Variable used before definition",
        },
        "TypeError": {
            "unsupported_operand": "Incompatible types for operation",
        },
        # ... more patterns
    }

    async def analyze_error(self, code: str, error: str) -> dict:
        """Analyze error and provide hints."""
        # Parse error type and message
        # Match against patterns
        # Generate progressive hints
        pass
```

---

### Step 6: Exercise Service

**Goal**: Create service that generates and auto-grades exercises.

**Using fastapi-dapr-agent Skill**:
```bash
python .claude/skills/fastapi-dapr-agent/scripts/generate.py \
    --name exercise-service \
    --port 8004 \
    --agent exercise
```

**Implementation Tasks**:
1. **Exercise Agent Logic**
   - Generate exercises from template bank
   - Auto-grade submissions using test cases
   - Track completion rates

2. **API Endpoints**
   - POST /api/v1/exercise/generate
   - POST /api/v1/exercise/submit

3. **Exercise Database**
   - 8 modules × 5 topics × 3 difficulties = 120+ exercises
   - Template-based generation

**Exercise Templates**:
```python
# templates/exercises.py
EXERCISE_TEMPLATES = {
    "for_loops_easy": {
        "prompt": "Write a for loop that prints numbers {start} to {end}",
        "starter_code": "# Your code here",
        "test_cases": [
            {"input": {"start": 1, "end": 5}, "output": "1\n2\n3\n4\n5"},
            # ... more test cases
        ],
        "hints": ["Use range({start}, {end + 1})", "Remember to call print()"]
    },
    # ... more templates
}
```

---

### Step 7: Progress Service

**Goal**: Create service that tracks mastery and progress.

**Using fastapi-dapr-agent Skill**:
```bash
python .claude/skills/fastapi-dapr-agent/scripts/generate.py \
    --name progress-service \
    --port 8005 \
    --agent progress
```

**Implementation Tasks**:
1. **Progress Agent Logic**
   - Calculate mastery using weighted formula
   - Determine mastery levels (Beginner/Learning/Proficient/Mastered)

2. **API Endpoints**
   - GET /api/v1/progress/{student_id}
   - POST /api/v1/progress/update

3. **Mastery Calculation**
   - Exercise completion: 40%
   - Quiz scores: 30%
   - Code quality: 20%
   - Consistency (streak): 10%

**Progress Tracking**:
```python
# agents/progress_agent.py
class ProgressAgent:
    WEIGHTS = {
        "exercise": 0.40,
        "quiz": 0.30,
        "code_quality": 0.20,
        "streak": 0.10,
    }

    def calculate_mastery(self, student_id: str, module: str) -> float:
        """Calculate weighted mastery level."""
        scores = self.get_scores(student_id, module)
        mastery = (
            scores["exercise"] * self.WEIGHTS["exercise"] +
            scores["quiz"] * self.WEIGHTS["quiz"] +
            scores["code_quality"] * self.WEIGHTS["code_quality"] +
            scores["streak"] * self.WEIGHTS["streak"]
        )
        return round(mastery, 2)

    def get_level(self, mastery: float) -> str:
        """Determine mastery level."""
        if mastery <= 0.40:
            return "beginner"
        elif mastery <= 0.70:
            return "learning"
        elif mastery <= 0.90:
            return "proficient"
        else:
            return "mastered"
```

---

### Step 8: Code Review Service

**Goal**: Create service that analyzes code quality, style, and efficiency.

**Using fastapi-dapr-agent Skill**:
```bash
python .claude/skills/fastapi-dapr-agent/scripts/generate.py \
    --name code-review-service \
    --port 8006 \
    --agent code_review
```

**Implementation Tasks**:
1. **Code Review Agent Logic**
   - Analyze code for correctness (syntax errors, runtime errors)
   - Check PEP 8 style compliance using pycodestyle or flake8
   - Evaluate efficiency (time/space complexity analysis)
   - Assess readability (naming, comments, structure)
   - Provide constructive feedback

2. **API Endpoint**
   - POST /api/v1/review/analyze
   - Request: { conversation_id, student_id, code }
   - Response: { correctness, style, efficiency, readability, overall_score }

3. **Quality Metrics**:
   - **Correctness** (40%): Code runs without errors
   - **Style** (25%): PEP 8 compliance
   - **Efficiency** (20%): Algorithmic complexity
   - **Readability** (15%): Naming, comments, structure

**Implementation**:
```python
# agents/code_review_agent.py
class CodeReviewAgent:
    def __init__(self):
        self.client = AsyncOpenAI()

    async def analyze_code(self, code: str) -> dict:
        """Analyze code quality across multiple dimensions."""
        # Correctness check
        correctness = await self._check_correctness(code)

        # Style check (PEP 8)
        style = await self._check_style(code)

        # Efficiency analysis
        efficiency = await self._analyze_efficiency(code)

        # Readability assessment
        readability = await self._assess_readability(code)

        # Calculate overall score
        overall = (
            correctness["score"] * 0.40 +
            style["score"] * 0.25 +
            efficiency["score"] * 0.20 +
            readability["score"] * 0.15
        )

        return {
            "correctness": correctness,
            "style": style,
            "efficiency": efficiency,
            "readability": readability,
            "overall_score": round(overall, 2)
        }

    async def _check_correctness(self, code: str) -> dict:
        """Check for syntax and runtime errors."""
        try:
            compile(code, '<string>', 'exec')
            return {"has_errors": False, "issues": [], "score": 100}
        except SyntaxError as e:
            return {"has_errors": True, "issues": [str(e)], "score": 0}

    async def _check_style(self, code: str) -> dict:
        """Check PEP 8 compliance."""
        # Use pycodestyle or similar
        import pycodestyle
        style_guide = pycodestyle.StyleGuide(quiet=True)
        result = style_guide.input_code(code)
        violations = list(result)

        score = max(0, 100 - len(violations) * 5)
        return {
            "pep8_compliant": len(violations) == 0,
            "violations": [f"{v[2]}:{v[1]}" for v in violations[:5]],
            "score": score
        }

    async def _analyze_efficiency(self, code: str) -> dict:
        """Analyze time/space complexity."""
        # Use AI to analyze patterns
        response = await self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Analyze Python code efficiency"},
                {"role": "user", "content": f"Analyze this code:\n{code}"}
            ]
        )
        return {"rating": "good", "suggestions": [], "score": 85}

    async def _assess_readability(self, code: str) -> dict:
        """Assess code readability."""
        lines = code.split('\n')
        has_comments = any(line.strip().startswith('#') for line in lines)
        has_docstring = '"""' in code or "'''" in code

        score = 50
        if has_comments: score += 20
        if has_docstring: score += 20
        if len(lines) > 5: score += 10

        suggestions = []
        if not has_docstring:
            suggestions.append("Add docstring")
        if not has_comments:
            suggestions.append("Add inline comments")

        return {"score": min(100, score), "suggestions": suggestions}

# main.py
from fastapi import FastAPI
from agents.code_review_agent import CodeReviewAgent
from common.dapr_client import DaprClientWrapper

app = FastAPI(title="Code Review Service")
agent = CodeReviewAgent()
dapr = DaprClientWrapper()

@app.post("/api/v1/review/analyze")
async def review_code(request: ReviewRequest):
    result = await agent.analyze_code(request.code)

    # Publish code review event
    await dapr.publish_event("code.reviewed", {
        "student_id": request.student_id,
        "overall_score": result["overall_score"]
    })

    # Update code quality score in progress
    # (this affects mastery calculation)

    return result
```

---

### Step 9: Database Setup

**Goal**: Create database schemas and run migrations.

**Tables to Create**:
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

### Step 10: Dapr Configuration

**Goal**: Configure Dapr components for all services.

**Components to Create**:

1. **PubSub Component** (Kafka):
```yaml
# dapr/components/pubsub.yaml
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

2. **State Store Component** (PostgreSQL):
```yaml
# dapr/components/statestore.yaml
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
```

3. **Secret Store**:
```yaml
# dapr/components/secretstore.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: secretstore
  namespace: learnflow
spec:
  type: secretstores.kubernetes
  version: v1
  metadata:
  - name: namespaces
    value: "learnflow"
```

---

### Step 11: Kubernetes Deployment

**Goal**: Deploy all 6 services to Minikube with Dapr sidecars.

**Deployment Pattern**:
```yaml
# deployments/Service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: SERVICE-NAME
  namespace: learnflow
spec:
  replicas: 1
  selector:
    matchLabels:
      app: SERVICE-NAME
  template:
    metadata:
      labels:
        app: SERVICE-NAME
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "SERVICE-NAME"
        dapr.io/app-port: "8000"
    spec:
      containers:
      - name: SERVICE-NAME
        image: SERVICE-NAME:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: connection-string
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-credentials
              key: api-key
        - name: KAFKA_BROKERS
          value: "kafka.kafka.svc.cluster.local:9092"
```

---

## Testing Strategy

### Unit Tests
```bash
# Test each agent
pytest tests/agents/test_triage_agent.py
pytest tests/agents/test_concepts_agent.py
pytest tests/agents/test_debug_agent.py
pytest tests/agents/test_exercise_agent.py
pytest tests/agents/test_progress_agent.py
```

### Integration Tests
```bash
# Test service endpoints
pytest tests/integration/test_triage_service.py
pytest tests/integration/test_concepts_service.py
# ... etc

# Test Dapr integration
pytest tests/integration/test_dapr_pubsub.py
pytest tests/integration/test_dapr_state.py
```

### Health Check Tests
```bash
# Test all health endpoints
for service in triage concepts debug exercise progress; do
  curl -f http://$service-service:8000/health || echo "FAILED: $service"
done
```

---

## Success Criteria Validation

- [ ] All 5 services deployed to `learnflow` namespace
- [ ] Each service has Dapr sidecar running
- [ ] Health endpoints return 200 OK
- [ ] Services can invoke each other via Dapr
- [ ] Services can publish/subscribe to Kafka topics
- [ ] Database tables created and accessible
- [ ] OpenAI agents responding to queries
- [ ] Zero manual intervention in deployment

---

## Rollback Plan

If deployment fails:
1. Check pod logs: `kubectl logs -n learnflow <pod-name>`
2. Check Dapr sidecar logs: `kubectl logs -n learnflow <pod-name> -c daprd`
3. Rollback to previous version: `kubectl rollout undo deployment/<service-name>`
4. Verify database state: Check migrations applied

---

## Dependencies

**Required**:
- Kafka deployed (Phase 3)
- PostgreSQL deployed (Phase 3)
- Minikube running (Phase 1)
- `fastapi-dapr-agent` skill available

**Blocking**:
- Phase 3 must be complete
- Database connection string available
- OpenAI API key configured
