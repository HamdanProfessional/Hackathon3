# Phase 4: Backend Services - Tasks

**Phase**: 4
**Focus**: Build FastAPI microservices with Dapr sidecars and AI agent integration

---

## Task Breakdown

### Category 1: Prerequisites & Setup

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.1.1 | Verify Kafka is running and accessible | Pending | `kubectl get pods -n kafka` |
| 4.1.2 | Verify PostgreSQL is running and accessible | Pending | `kubectl get pods -n postgres` |
| 4.1.3 | Create `learnflow` namespace | Pending | `kubectl create namespace learnflow` |
| 4.1.4 | Create database connection secret | Pending | `postgres-credentials` |
| 4.1.5 | Create OpenAI API key secret | Pending | `openai-credentials` |
| 4.1.6 | Verify `fastapi-dapr-agent` skill exists | Pending | Check `.claude/skills/` |

---

### Category 2: Common Foundation Code

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.2.1 | Create `common/models.py` with Pydantic models | Pending | StudentProgress, CodeSubmission, etc. |
| 4.2.2 | Create `common/database.py` for DB connection | Pending | Async PostgreSQL connection |
| 4.2.3 | Create `common/dapr_client.py` wrapper | Pending | Publish, subscribe, state operations |
| 4.2.4 | Create `common/agent_base.py` base class | Pending | Shared agent functionality |
| 4.2.5 | Write unit tests for common code | Pending | `pytest tests/common/` |

---

### Category 3: Triage Service

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.3.1 | Generate triage-service scaffold | Pending | Use `fastapi-dapr-agent` skill |
| 4.3.2 | Implement TriageAgent class | Pending | Query classification logic |
| 4.3.3 | Add OpenAI function calling for routing | Pending | concepts/debug/exercise/progress |
| 4.3.4 | Implement POST /api/v1/triage endpoint | Pending | Request/response models |
| 4.3.5 | Add Dapr pub/sub for `learning.triage` topic | Pending | Publish routing decisions |
| 4.3.6 | Add subscriber for `code.submission` topic | Pending | Trigger triage on submission |
| 4.3.7 | Write tests for triage logic | Pending | Unit + integration |
| 4.3.8 | Deploy triage-service to Kubernetes | Pending | Use skill's deploy script |
| 4.3.9 | Verify health endpoint | Pending | `curl http://triage-service:8000/health` |

---

### Category 4: Concepts Service

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.4.1 | Generate concepts-service scaffold | Pending | Use `fastapi-dapr-agent` skill |
| 4.4.2 | Create curriculum data structure | Pending | 8 modules with topics |
| 4.4.3 | Implement ConceptsAgent class | Pending | Explain Python concepts |
| 4.4.4 | Add mastery level adaptation | Pending | Adjust explanation complexity |
| 4.4.5 | Implement POST /api/v1/concepts/explain | Pending | Request/response models |
| 4.4.6 | Add code example generation | Pending | Python snippets for concepts |
| 4.4.7 | Add state tracking for concepts covered | Pending | Via Dapr state store |
| 4.4.8 | Add subscriber for `learning.triage` topic | Pending | Receive explanation requests |
| 4.4.9 | Publish to `learning.concept_explained` topic | Pending | Analytics event |
| 4.4.10 | Write tests for concepts agent | Pending | Unit + integration |
| 4.4.11 | Deploy concepts-service to Kubernetes | Pending | Use skill's deploy script |
| 4.4.12 | Verify health endpoint | Pending | `curl http://concepts-service:8000/health` |

---

### Category 5: Debug Service

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.5.1 | Generate debug-service scaffold | Pending | Use `fastapi-dapr-agent` skill |
| 4.5.2 | Create error pattern mappings | Pending | SyntaxError, NameError, etc. |
| 4.5.3 | Implement DebugAgent class | Pending | Parse and analyze errors |
| 4.5.4 | Implement progressive hint system | Pending | Don't give solutions directly |
| 4.5.5 | Implement POST /api/v1/debug/analyze | Pending | Request/response models |
| 4.5.6 | Add error frequency tracking | Pending | Detect repeated errors |
| 4.5.7 | Implement struggle detection logic | Pending | Same error 3+ times |
| 4.5.8 | Publish to `struggle.alert` topic | Pending | When struggle detected |
| 4.5.9 | Publish to `code.error_analyzed` topic | Pending | Analytics event |
| 4.5.10 | Write tests for debug agent | Pending | Unit + integration |
| 4.5.11 | Deploy debug-service to Kubernetes | Pending | Use skill's deploy script |
| 4.5.12 | Verify health endpoint | Pending | `curl http://debug-service:8000/health` |

---

### Category 6: Exercise Service

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.6.1 | Generate exercise-service scaffold | Pending | Use `fastapi-dapr-agent` skill |
| 4.6.2 | Create exercise template bank | Pending | 120+ exercises across modules |
| 4.6.3 | Implement ExerciseAgent class | Pending | Generate exercises |
| 4.6.4 | Implement POST /api/v1/exercise/generate | Pending | Generate from templates |
| 4.6.5 | Implement test case generation | Pending | For auto-grading |
| 4.6.6 | Implement POST /api/v1/exercise/submit | Pending | Auto-grading logic |
| 4.6.7 | Add hint system | Pending | Progressive hints |
| 4.6.8 | Track exercise attempts | Pending | Database storage |
| 4.6.9 | Publish to `exercise.attempt` topic | Pending | Analytics event |
| 4.6.10 | Publish to `exercise.completed` topic | Pending | On success |
| 4.6.11 | Write tests for exercise agent | Pending | Unit + integration |
| 4.6.12 | Deploy exercise-service to Kubernetes | Pending | Use skill's deploy script |
| 4.6.13 | Verify health endpoint | Pending | `curl http://exercise-service:8000/health` |

---

### Category 7: Progress Service

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.7.1 | Generate progress-service scaffold | Pending | Use `fastapi-dapr-agent` skill |
| 4.7.2 | Implement ProgressAgent class | Pending | Track and calculate mastery |
| 4.7.3 | Implement mastery calculation | Pending | Weighted formula |
| 4.7.4 | Implement level determination | Pending | Beginner/Learning/Proficient/Mastered |
| 4.7.5 | Implement GET /api/v1/progress/{student_id} | Pending | Retrieve progress |
| 4.7.6 | Implement POST /api/v1/progress/update | Pending | Update after activity |
| 4.7.7 | Add streak calculation | Pending | Consistency tracking |
| 4.7.8 | Store progress in Dapr state | Pending | State management |
| 4.7.9 | Publish to `learning.progress` topic | Pending | Analytics event |
| 4.7.10 | Subscribe to `exercise.completed` topic | Pending | Update on completion |
| 4.7.11 | Subscribe to `code.submission` topic | Pending | Track code quality |
| 4.7.12 | Write tests for progress agent | Pending | Unit + integration |
| 4.7.13 | Deploy progress-service to Kubernetes | Pending | Use skill's deploy script |
| 4.7.14 | Verify health endpoint | Pending | `curl http://progress-service:8000/health` |

---

### Category 8: Code Review Service

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.8.1 | Generate code-review-service scaffold | Pending | Use fastapi-dapr-agent skill |
| 4.8.2 | Implement CodeReviewAgent class | Pending | Quality analysis |
| 4.8.3 | Implement correctness check | Pending | Syntax/runtime errors |
| 4.8.4 | Implement PEP 8 style check | Pending | pycodestyle/flake8 |
| 4.8.5 | Implement efficiency analysis | Pending | Complexity assessment |
| 4.8.6 | Implement readability assessment | Pending | Naming, comments |
| 4.8.7 | Implement POST /api/v1/review/analyze | Pending | Request/response models |
| 4.8.8 | Add quality metrics calculation | Pending | Weighted scoring |
| 4.8.9 | Publish to code.reviewed topic | Pending | Analytics event |
| 4.8.10 | Subscribe to code.submission topic | Pending | Auto-review |
| 4.8.11 | Write tests for code review agent | Pending | Unit + integration |
| 4.8.12 | Deploy code-review-service | Pending | Use skill's deploy script |
| 4.8.13 | Verify health endpoint | Pending | `curl http://code-review-service:8000/health` |

---

### Category 9: Database Setup

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.8.1 | Create students table | Pending | UUID primary key |
| 4.8.2 | Create student_progress table | Pending | Composite primary key |
| 4.8.3 | Create exercise_attempts table | Pending | Track submissions |
| 4.8.4 | Create code_submissions table | Pending | Store code and errors |
| 4.8.5 | Create conversations table | Pending | JSONB for messages |
| 4.8.6 | Create migration script | Pending | Alembic or raw SQL |
| 4.8.7 | Run migrations | Pending | Apply schema |
| 4.8.8 | Seed test data | Pending | For testing |
| 4.8.9 | Verify database connectivity | Pending | From all services |

---

### Category 9: Dapr Configuration

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.9.1 | Create Dapr components directory | Pending | `dapr/components/` |
| 4.9.2 | Create pubsub component (Kafka) | Pending | `pubsub.yaml` |
| 4.9.3 | Create statestore component (PostgreSQL) | Pending | `statestore.yaml` |
| 4.9.4 | Create secretstore component | Pending | `secretstore.yaml` |
| 4.9.5 | Apply Dapr components to cluster | Pending | `kubectl apply -f dapr/components/` |
| 4.9.6 | Verify Dapr components are running | Pending | `kubectl get components -n learnflow` |
| 4.9.7 | Test pub/sub connectivity | Pending | Publish test message |
| 4.9.8 | Test state store connectivity | Pending | Save/retrieve test state |

---

### Category 10: Kubernetes Deployment

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.10.1 | Build Docker images for all services | Pending | 5 services |
| 4.10.2 | Push images to registry | Pending | Docker Hub or local |
| 4.10.3 | Create Kubernetes manifests | Pending | Deployment + Service |
| 4.10.4 | Deploy triage-service | Pending | With Dapr sidecar |
| 4.10.5 | Deploy concepts-service | Pending | With Dapr sidecar |
| 4.10.6 | Deploy debug-service | Pending | With Dapr sidecar |
| 4.10.7 | Deploy exercise-service | Pending | With Dapr sidecar |
| 4.10.8 | Deploy progress-service | Pending | With Dapr sidecar |
| 4.10.9 | Verify all pods are running | Pending | `kubectl get pods -n learnflow` |
| 4.10.10 | Verify Dapr sidecars are running | Pending | 2 containers per pod |
| 4.10.11 | Verify all health endpoints | Pending | `curl` each service |
| 4.10.12 | Verify service-to-service communication | Pending | Via Dapr invocation |

---

### Category 11: Testing

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.11.1 | Write unit tests for TriageAgent | Pending | `pytest tests/agents/test_triage.py` |
| 4.11.2 | Write unit tests for ConceptsAgent | Pending | `pytest tests/agents/test_concepts.py` |
| 4.11.3 | Write unit tests for DebugAgent | Pending | `pytest tests/agents/test_debug.py` |
| 4.11.4 | Write unit tests for ExerciseAgent | Pending | `pytest tests/agents/test_exercise.py` |
| 4.11.5 | Write unit tests for ProgressAgent | Pending | `pytest tests/agents/test_progress.py` |
| 4.11.6 | Write integration tests for triage-service | Pending | End-to-end API tests |
| 4.11.7 | Write integration tests for concepts-service | Pending | End-to-end API tests |
| 4.11.8 | Write integration tests for debug-service | Pending | End-to-end API tests |
| 4.11.9 | Write integration tests for exercise-service | Pending | End-to-end API tests |
| 4.11.10 | Write integration tests for progress-service | Pending | End-to-end API tests |
| 4.11.11 | Run all tests | Pending | `pytest` |
| 4.11.12 | Verify test coverage > 80% | Pending | `pytest --cov` |

---

### Category 12: Validation & Cleanup

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.12.1 | Verify all success criteria met | Pending | Check spec.md |
| 4.12.2 | Run end-to-end smoke test | Pending | Full flow test |
| 4.12.3 | Check resource usage | Pending | CPU/memory |
| 4.12.4 | Check logs for errors | Pending | All services |
| 4.12.5 | Document API endpoints | Pending | OpenAPI docs |
| 4.12.6 | Clean up test resources | Pending | Remove test data |
| 4.12.7 | Create deployment summary | Pending | For documentation |

---

## Task Dependencies

```
Category 1 (Prerequisites)
    │
    ▼
Category 2 (Common Foundation)
    │
    ├─▶ Category 3 (Triage Service)
    │
    ├─▶ Category 4 (Concepts Service)
    │
    ├─▶ Category 5 (Debug Service)
    │
    ├─▶ Category 6 (Exercise Service)
    │
    └─▶ Category 7 (Progress Service)
          │
          ▼
    Category 8 (Database) ──▶ Category 9 (Dapr Config)
          │                      │
          └──────────┬───────────┘
                     ▼
              Category 10 (K8s Deployment)
                     │
                     ▼
              Category 11 (Testing)
                     │
                     ▼
              Category 12 (Validation)
```

---

## Status Tracking

- **Total Tasks**: 119
- **Completed**: 0
- **In Progress**: 0
- **Pending**: 119
- **Blocked**: 0

---

## Notes

- Use `fastapi-dapr-agent` skill for service scaffolding
- All services must follow Dapr sidecar pattern
- AI agents use AsyncOpenAI SDK
- State management via Dapr state store
- Event streaming via Dapr pub/sub (Kafka)
- All services must have health check endpoint
- Zero manual intervention - autonomous deployment via Skills
