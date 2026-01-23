# Phase 4: Backend Services - Implementation Plan

**Phase**: 4
**Focus**: Build microservices with AI agent integration for LearnFlow
**Status**: Draft

---

## Technical Context

### System Overview

This phase implements six stateless microservices that form the backend of the LearnFlow platform. Each service:

1. **Accepts REST API requests** from frontend or other services
2. **Integrates with AI models** for conversational intelligence
3. **Publishes/subscribes to events** for asynchronous processing
4. **Maintains no in-memory state** for horizontal scalability
5. **Deploys autonomously** via Skills

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **API Framework** | FastAPI 0.104+ | Async support, auto OpenAPI docs, type hints |
| **AI SDK** | AsyncOpenAI | Native async, streaming support |
| **Service Mesh** | Dapr 1.12+ | Sidecar pattern, language-agnostic |
| **Pub/Sub** | Kafka (via Dapr) | Event streaming, already in Phase 3 |
| **State Store** | PostgreSQL (via Dapr) | ACID compliance, existing in Phase 3 |
| **Container** | Docker | Standard packaging |
| **Orchestration** | Kubernetes | Existing cluster from Phase 1 |

### Unknowns Requiring Research

- [RESEARCH-1] Best practice for Dapr service invocation patterns (HTTP vs gRPC)
- [RESEARCH-2] Optimal batch size for Kafka event publishing
- [RESEARCH-3] AsyncOpenAI connection pooling strategy
- [RESEARCH-4] State store partitioning for multi-tenant isolation

---

## Constitution Check

### Applicable Principles

From `.specify/memory/constitution.md`:

| Principle | Compliance | Notes |
|-----------|------------|-------|
| **Skills-First Development** | ✅ PASS | All services deployable via `fastapi-dapr-agent` skill |
| **Token Efficiency** | ✅ PASS | MCP Code Execution pattern in skill scripts |
| **Stateless Services** | ✅ PASS | All state in Dapr/PostgreSQL, no in-memory |
| **Cross-Agent Compatibility** | ✅ PASS | Skills work with Claude Code and Goose |
| **Event-Driven Architecture** | ✅ PASS | Kafka topics for async communication |

### Non-Compliant Items

None identified. All design decisions align with project constitution.

---

## Phase 0: Research & Decisions

> **Output**: `research.md`

See [research.md](./research.md) for detailed decisions on:
- Dapr invocation patterns (HTTP chosen for simplicity)
- Kafka batching (50 messages per batch)
- AsyncOpenAI pooling (20 connection limit)
- State partitioning (by student_id prefix)

---

## Phase 1: Design & Contracts

### Data Model

> **Output**: `data-model.md`

See [data-model.md](./data-model.md) for entity definitions:
- Student
- StudentProgress
- Exercise
- ExerciseAttempt
- CodeSubmission
- Conversation
- CodeReview

### API Contracts

> **Output**: `contracts/`

OpenAPI specifications for each service:

| Contract | Path | Purpose |
|----------|------|---------|
| **triage.yaml** | contracts/triage.yaml | Query routing API |
| **concepts.yaml** | contracts/concepts.yaml | Concept explanation API |
| **debug.yaml** | contracts/debug.yaml | Error analysis API |
| **exercise.yaml** | contracts/exercise.yaml | Exercise generation API |
| **progress.yaml** | contracts/progress.yaml | Progress tracking API |
| **code-review.yaml** | contracts/code-review.yaml | Code quality API |

### Quickstart Scenarios

> **Output**: `quickstart.md`

See [quickstart.md](./quickstart.md) for integration test scenarios:
1. Student asks "How do for loops work?"
2. Student submits code with SyntaxError
3. Student requests exercise on lists
4. Teacher views struggle alerts

---

## Implementation Steps

### Step 1: Common Foundation (Setup)

**Files**:
- `backend/common/__init__.py`
- `backend/common/models.py`
- `backend/common/database.py`
- `backend/common/dapr_client.py`
- `backend/common/agent_base.py`

**Description**: Create shared code used by all services.

---

### Step 2: Triage Service

**Service**: `triage-service`
**Port**: 8001
**Agent**: TriageAgent
**Files**:
- `backend/triage-service/main.py`
- `backend/triage-service/agents/triage_agent.py`
- `backend/triage-service/schemas/requests.py`
- `backend/triage-service/schemas/responses.py`
- `backend/triage-service/Dockerfile`
- `backend/triage-service/k8s/deployment.yaml`
- `backend/triage-service/k8s/service.yaml`

**Description**: Routes student queries to appropriate specialist agents.

---

### Step 3: Concepts Service

**Service**: `concepts-service`
**Port**: 8002
**Agent**: ConceptsAgent
**Files**:
- `backend/concepts-service/main.py`
- `backend/concepts-service/agents/concepts_agent.py`
- `backend/concepts-service/curriculum.py`
- `backend/concepts-service/schemas/requests.py`
- `backend/concepts-service/schemas/responses.py`
- `backend/concepts-service/Dockerfile`
- `backend/concepts-service/k8s/deployment.yaml`
- `backend/concepts-service/k8s/service.yaml`

**Description**: Explains Python concepts with adaptive complexity.

---

### Step 4: Debug Service

**Service**: `debug-service`
**Port**: 8003
**Agent**: DebugAgent
**Files**:
- `backend/debug-service/main.py`
- `backend/debug-service/agents/debug_agent.py`
- `backend/debug-service/error_patterns.py`
- `backend/debug-service/schemas/requests.py`
- `backend/debug-service/schemas/responses.py`
- `backend/debug-service/Dockerfile`
- `backend/debug-service/k8s/deployment.yaml`
- `backend/debug-service/k8s/service.yaml`

**Description**: Analyzes errors and provides progressive hints.

---

### Step 5: Exercise Service

**Service**: `exercise-service`
**Port**: 8004
**Agent**: ExerciseAgent
**Files**:
- `backend/exercise-service/main.py`
- `backend/exercise-service/agents/exercise_agent.py`
- `backend/exercise-service/exercise_bank.py`
- `backend/exercise-service/grader.py`
- `backend/exercise-service/schemas/requests.py`
- `backend/exercise-service/schemas/responses.py`
- `backend/exercise-service/Dockerfile`
- `backend/exercise-service/k8s/deployment.yaml`
- `backend/exercise-service/k8s/service.yaml`

**Description**: Generates and auto-grades coding exercises.

---

### Step 6: Progress Service

**Service**: `progress-service`
**Port**: 8005
**Agent**: ProgressAgent
**Files**:
- `backend/progress-service/main.py`
- `backend/progress-service/agents/progress_agent.py`
- `backend/progress-service/mastery.py`
- `backend/progress-service/schemas/requests.py`
- `backend/progress-service/schemas/responses.py`
- `backend/progress-service/Dockerfile`
- `backend/progress-service/k8s/deployment.yaml`
- `backend/progress-service/k8s/service.yaml`

**Description**: Calculates mastery scores and tracks progress.

---

### Step 7: Code Review Service

**Service**: `code-review-service`
**Port**: 8006
**Agent**: CodeReviewAgent
**Files**:
- `backend/code-review-service/main.py`
- `backend/code-review-service/agents/code_review_agent.py`
- `backend/code-review-service/analyzers.py`
- `backend/code-review-service/schemas/requests.py`
- `backend/code-review-service/schemas/responses.py`
- `backend/code-review-service/Dockerfile`
- `backend/code-review-service/k8s/deployment.yaml`
- `backend/code-review-service/k8s/service.yaml`

**Description**: Analyzes code for correctness, style, efficiency, readability.

---

### Step 8: Database Setup

**Files**:
- `backend/migrations/001_initial_schema.up.sql`
- `backend/migrations/001_initial_schema.down.sql`

**Tables**:
- students
- student_progress
- exercises
- exercise_attempts
- code_submissions
- conversations
- code_reviews

---

### Step 9: Dapr Configuration

**Files**:
- `backend/dapr/components/pubsub.yaml`
- `backend/dapr/components/statestore.yaml`
- `backend/dapr/components/secretstore.yaml`

**Components**:
- Kafka pubsub (for event streaming)
- PostgreSQL state store (for Dapr state API)
- Kubernetes secret store (for credentials)

---

### Step 10: Kubernetes Deployment

**Files**:
- `backend/k8s/namespace.yaml`
- `backend/k8s/configmap.yaml`
- `backend/k8s/secrets.yaml`

**Services Deployed**:
- triage-service (2 replicas)
- concepts-service (2 replicas)
- debug-service (2 replicas)
- exercise-service (2 replicas)
- progress-service (2 replicas)
- code-review-service (2 replicas)

---

### Step 11: Testing

**Test Files**:
- `tests/agents/test_triage_agent.py`
- `tests/agents/test_concepts_agent.py`
- `tests/agents/test_debug_agent.py`
- `tests/agents/test_exercise_agent.py`
- `tests/agents/test_progress_agent.py`
- `tests/agents/test_code_review_agent.py`
- `tests/integration/test_triage_flow.py`
- `tests/integration/test_exercise_flow.py`

**Test Coverage Target**: >80%

---

## Skills Used

| Skill | Purpose | When Used |
|-------|---------|-----------|
| `fastapi-dapr-agent` | Generate service scaffold | Steps 2-7 |
| `k8s-deployer` | Deploy to Kubernetes | Step 10 |
| `k8s-troubleshoot` | Verify deployment | After Step 10 |

---

## Dependencies

### Internal Dependencies
- Phase 3: Infrastructure (Kafka, PostgreSQL running)
- Phase 2: Foundation Skills (fastapi-dapr-agent skill available)

### External Dependencies
- OpenAI API key (for AsyncOpenAI)
- Kubernetes cluster access
- Docker registry

---

## Success Criteria

- [ ] All 6 services respond to health checks
- [ ] Services can invoke each other via Dapr
- [ ] Kafka events flow between services
- [ ] PostgreSQL state persists across restarts
- [ ] Services handle 100 concurrent requests
- [ ] Deployment via Skills succeeds autonomously
- [ ] Test coverage >80%

---

## Next Steps

1. Run `/sp.implement` to execute this plan
2. Create ADRs for architecturally significant decisions
3. Update AGENTS.md with service details
