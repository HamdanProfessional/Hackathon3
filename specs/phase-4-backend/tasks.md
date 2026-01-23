# Phase 4: Backend Services - Tasks

**Phase**: 4
**Focus**: Build microservices with AI agent integration for LearnFlow

---

## Phase 1: Setup (Project Initialization)

**Goal**: Initialize project structure and verify infrastructure readiness

**Tasks**:
- [ ] T001 Create backend directory structure in `backend/`
- [ ] T002 Create `backend/common/__init__.py` package
- [ ] T003 [P] Create `backend/common/models.py` with Pydantic models
- [ ] T004 [P] Create `backend/common/database.py` with async connection
- [ ] T005 [P] Create `backend/common/dapr_client.py` with Dapr wrapper
- [ ] T006 [P] Create `backend/common/agent_base.py` base class
- [ ] T007 Create `backend/tests/__init__.py` test package
- [ ] T008 Verify Kafka is running: `kubectl get pods -n kafka`
- [ ] T009 Verify PostgreSQL is running: `kubectl get pods -n postgres`
- [ ] T010 Create `learnflow` namespace: `kubectl create namespace learnflow`
- [ ] T011 Create database connection secret `postgres-credentials`
- [ ] T012 Create OpenAI API key secret `openai-credentials`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Goal**: Set up database schema and Dapr components

**Tasks**:
- [ ] T013 Create `backend/migrations/001_initial_schema.up.sql`
- [ ] T014 Create `backend/migrations/001_initial_schema.down.sql`
- [ ] T015 Run database migrations to create tables
- [ ] T016 Create `backend/dapr/components/pubsub.yaml` for Kafka
- [ ] T017 Create `backend/dapr/components/statestore.yaml` for PostgreSQL
- [ ] T018 Create `backend/dapr/components/secretstore.yaml`
- [ ] T019 Apply Dapr components: `kubectl apply -f backend/dapr/components/`
- [ ] T020 Verify Dapr components: `kubectl get components -n learnflow`
- [ ] T021 Test Kafka pub/sub connectivity
- [ ] T022 Test state store connectivity

---

## Phase 3: User Story - Query Routing (P1)

**Story**: As a student learning Python, I want my questions to be automatically routed to the right specialist so that I get relevant help without manually selecting the assistance type.

**Independent Test Criteria**:
- Given a student query about concepts, system routes to concepts-service
- Given a student query about errors, system routes to debug-service
- Given a student query about exercises, system routes to exercise-service
- Routing completes within 500ms

**Tasks**:
- [ ] T023 [P] Use `fastapi-dapr-agent` skill to generate triage-service scaffold (Port 8001)
- [ ] T024 [US1] Implement TriageAgent.route_query() in `backend/triage-service/agents/triage_agent.py`
- [ ] T025 [US1] Implement query classification logic (concepts/debug/exercise/progress)
- [ ] T026 [US1] Add OpenAI function calling for routing decision
- [ ] T027 [US1] Implement POST /api/v1/triage endpoint in `backend/triage-service/main.py`
- [ ] T028 [US1] Add Dapr pub/sub for `learning.triage` topic
- [ ] T029 [US1] Add subscriber for `code.submission` topic
- [ ] T030 [US1] Create `backend/triage-service/schemas/requests.py` with TriageRequest model
- [ ] T031 [US1] Create `backend/triage-service/schemas/responses.py` with TriageResponse model
- [ ] T032 [US1] Write unit tests for TriageAgent in `tests/agents/test_triage_agent.py`
- [ ] T033 [US1] Write integration tests for triage API in `tests/integration/test_triage_flow.py`
- [ ] T034 [US1] Deploy triage-service to Kubernetes
- [ ] T035 [US1] Verify health endpoint: `curl http://triage-service:8000/health`

---

## Phase 4: User Story - Adaptive Concept Explanations (P1)

**Story**: As a student, I want explanations that match my current understanding level so that I'm not overwhelmed by too-advanced or too-simple content.

**Independent Test Criteria**:
- Given a student with 35% mastery, explanation uses simple language
- Given a student with 75% mastery, explanation uses technical terms
- Explanation includes relevant code example
- Topics align with 8-module Python curriculum

**Tasks**:
- [ ] T036 [P] Use `fastapi-dapr-agent` skill to generate concepts-service scaffold (Port 8002)
- [ ] T037 [US2] Create curriculum data structure in `backend/concepts-service/curriculum.py`
- [ ] T038 [US2] Define 8-module Python curriculum with topics
- [ ] T039 [US2] Implement ConceptsAgent.explain() in `backend/concepts-service/agents/concepts_agent.py`
- [ ] T040 [US2] Implement mastery level adaptation logic
- [ ] T041 [US2] Implement code example generation
- [ ] T042 [US2] Implement POST /api/v1/concepts/explain endpoint
- [ ] T043 [US2] Add Dapr state tracking for concepts covered
- [ ] T044 [US2] Subscribe to `learning.triage` topic
- [ ] T045 [US2] Publish to `learning.concept_explained` topic
- [ ] T046 [US2] Write unit tests for ConceptsAgent in `tests/agents/test_concepts_agent.py`
- [ ] T047 [US2] Deploy concepts-service to Kubernetes
- [ ] T048 [US2] Verify health endpoint

---

## Phase 5: User Story - Progressive Debugging Hints (P1)

**Story**: As a student encountering an error, I want hints that guide me to the solution without giving the answer so that I learn debugging skills through practice.

**Independent Test Criteria**:
- Given code with SyntaxError, system identifies error type and location
- System provides progressive hints (not direct solutions)
- Third hint brings student closer to solution
- System detects repeated errors (same type 3+ times)

**Tasks**:
- [ ] T049 [P] Use `fastapi-dapr-agent` skill to generate debug-service scaffold (Port 8003)
- [ ] T050 [US3] Create error pattern mappings in `backend/debug-service/error_patterns.py`
- [ ] T051 [US3] Map SyntaxError, NameError, TypeError, etc.
- [ ] T052 [US3] Implement DebugAgent.analyze() in `backend/debug-service/agents/debug_agent.py`
- [ ] T053 [US3] Implement progressive hint system (3 levels)
- [ ] T054 [US3] Implement POST /api/v1/debug/analyze endpoint
- [ ] T055 [US3] Add error frequency tracking
- [ ] T056 [US3] Implement struggle detection logic (same error 3+ times)
- [ ] T057 [US3] Publish to `struggle.alert` topic when struggle detected
- [ ] T058 [US3] Publish to `code.error_analyzed` topic
- [ ] T059 [US3] Write unit tests for DebugAgent in `tests/agents/test_debug_agent.py`
- [ ] T060 [US3] Deploy debug-service to Kubernetes
- [ ] T061 [US3] Verify health endpoint

---

## Phase 6: User Story - Auto-Graded Exercises (P1)

**Story**: As a student, I want immediate feedback on coding exercises so that I know if I understand the concept and can correct mistakes.

**Independent Test Criteria**:
- Given exercise request, system generates appropriate challenge
- Exercise difficulty matches student's current module and mastery
- Submission is auto-graded against test cases
- Feedback includes pass/fail status and hints
- Completed exercises update progress tracking

**Tasks**:
- [ ] T062 [P] Use `fastapi-dapr-agent` skill to generate exercise-service scaffold (Port 8004)
- [ ] T063 [US4] Create exercise template bank in `backend/exercise-service/exercise_bank.py`
- [ ] T064 [US4] Create 120+ exercises across 8 modules
- [ ] T065 [US4] Define difficulty levels per exercise
- [ ] T066 [US4] Implement ExerciseAgent.generate() in `backend/exercise-service/agents/exercise_agent.py`
- [ ] T067 [US4] Implement test case generation
- [ ] T068 [US4] Implement POST /api/v1/exercise/generate endpoint
- [ ] T069 [US4] Implement POST /api/v1/exercise/submit endpoint
- [ ] T070 [US4] Implement grader in `backend/exercise-service/grader.py`
- [ ] T071 [US4] Add hint system (progressive)
- [ ] T072 [US4] Track exercise attempts in database
- [ ] T073 [US4] Publish to `exercise.attempt` topic
- [ ] T074 [US4] Publish to `exercise.completed` topic on success
- [ ] T075 [US4] Write unit tests for ExerciseAgent in `tests/agents/test_exercise_agent.py`
- [ ] T076 [US4] Write integration tests for exercise flow
- [ ] T077 [US4] Deploy exercise-service to Kubernetes
- [ ] T078 [US4] Verify health endpoint

---

## Phase 7: User Story - Mastery Progress Tracking (P2)

**Story**: As a student, I want to see my overall progress and mastery levels so that I know what I've learned and what to focus on next.

**Independent Test Criteria**:
- System calculates mastery score per topic using weighted formula
- Mastery level displayed (Beginner/Learning/Proficient/Mastered)
- Progress updates after each activity (exercise, quiz, code submission)
- Streak tracking for consistency (days active in last 30 days)

**Tasks**:
- [ ] T079 [P] Use `fastapi-dapr-agent` skill to generate progress-service scaffold (Port 8005)
- [ ] T080 [US5] Implement ProgressAgent in `backend/progress-service/agents/progress_agent.py`
- [ ] T081 [US5] Implement mastery calculation in `backend/progress-service/mastery.py`
- [ ] T082 [US5] Implement weighted formula: exercise 40%, quiz 30%, code quality 20%, streak 10%
- [ ] T083 [US5] Implement level determination (0-40% Beginner, 41-70% Learning, etc.)
- [ ] T084 [US5] Implement GET /api/v1/progress/{student_id} endpoint
- [ ] T085 [US5] Implement POST /api/v1/progress/update endpoint
- [ ] T086 [US5] Add streak calculation logic
- [ ] T087 [US5] Store progress in Dapr state
- [ ] T088 [US5] Publish to `learning.progress` topic
- [ ] T089 [US5] Subscribe to `exercise.completed` topic
- [ ] T090 [US5] Subscribe to `code.submission` topic
- [ ] T091 [US5] Write unit tests for ProgressAgent in `tests/agents/test_progress_agent.py`
- [ ] T092 [US5] Deploy progress-service to Kubernetes
- [ ] T093 [US5] Verify health endpoint

---

## Phase 8: User Story - Code Quality Analysis (P2)

**Story**: As a student, I want feedback on my code quality beyond just correctness so that I learn to write clean, maintainable Python.

**Independent Test Criteria**:
- Given code submission, system analyzes for correctness
- System checks style compliance (PEP 8)
- System assesses efficiency (time/space complexity)
- System evaluates readability (naming, comments, structure)
- Overall quality score (0-100) provided with breakdown

**Tasks**:
- [ ] T094 [P] Use `fastapi-dapr-agent` skill to generate code-review-service scaffold (Port 8006)
- [ ] T095 [US6] Implement CodeReviewAgent in `backend/code-review-service/agents/code_review_agent.py`
- [ ] T096 [US6] Implement correctness check in `backend/code-review-service/analyzers.py`
- [ ] T097 [US6] Implement PEP 8 style check (pycodestyle/flake8)
- [ ] T098 [US6] Implement efficiency analysis
- [ ] T099 [US6] Implement readability assessment
- [ ] T100 [US6] Implement POST /api/v1/review/analyze endpoint
- [ ] T101 [US6] Add quality metrics calculation
- [ ] T102 [US6] Publish to `code.reviewed` topic
- [ ] T103 [US6] Subscribe to `code.submission` topic for auto-review
- [ ] T104 [US6] Write unit tests for CodeReviewAgent in `tests/agents/test_code_review_agent.py`
- [ ] T105 [US6] Deploy code-review-service to Kubernetes
- [ ] T106 [US6] Verify health endpoint

---

## Phase 9: User Story - Struggle Detection (P3)

**Story**: As a teacher, I want alerts when students are struggling so that I can provide targeted help before they give up.

**Independent Test Criteria**:
- System detects struggle triggers (same error 3+ times, stuck >10 min, quiz <50%)
- Alert includes student ID, topic, and struggle type
- Teacher dashboard shows active struggles
- System allows teacher to assign remedial exercises

**Tasks**:
- [ ] T107 [US7] Add struggle detection to debug-service (same error 3+ times)
- [ ] T108 [US7] Add time-based struggle detection (>10 min on exercise)
- [ ] T109 [US7] Publish to `struggle.alert` topic
- [ ] T110 [US7] Create struggles table in database
- [ ] T111 [US7] Implement GET /api/v1/progress/struggles endpoint in progress-service
- [ ] T112 [US7] Filter struggles by class_id for teachers
- [ ] T113 [US7] Implement POST /api/v1/progress/struggles/assign endpoint (assign remedial)
- [ ] T114 [US7] Write tests for struggle detection
- [ ] T115 [US7] Test struggle alert flow end-to-end

---

## Phase 10: Polish & Cross-Cutting Concerns

**Goal**: Finalize deployment, testing, and documentation

**Tasks**:
- [ ] T116 Create `backend/k8s/namespace.yaml`
- [ ] T117 Create `backend/k8s/configmap.yaml` for shared configuration
- [ ] T118 Create `backend/k8s/secrets.yaml` for sensitive data
- [ ] T119 Deploy all services to Kubernetes
- [ ] T120 Verify all pods are running: `kubectl get pods -n learnflow`
- [ ] T121 Verify Dapr sidecars are running (2 containers per pod)
- [ ] T122 Verify all health endpoints
- [ ] T123 Run full test suite: `pytest tests/`
- [ ] T124 Verify test coverage >80%: `pytest --cov`
- [ ] T125 Run integration tests from quickstart.md
- [ ] T126 Create API documentation from OpenAPI specs
- [ ] T127 Update AGENTS.md with service details
- [ ] T128 Create deployment summary

---

## Task Dependencies

```
Phase 1 (Setup)
    │
    ▼
Phase 2 (Foundational)
    │
    ├─▶ Phase 3 (Query Routing - US1)
    │
    ├─▶ Phase 4 (Concept Explanations - US2)
    │
    ├─▶ Phase 5 (Debugging Hints - US3)
    │
    ├─▶ Phase 6 (Exercises - US4)
    │
    ├─▶ Phase 7 (Progress Tracking - US5)
    │
    ├─▶ Phase 8 (Code Review - US6)
    │
    └─▶ Phase 9 (Struggle Detection - US7)
          │
          ▼
    Phase 10 (Polish)
```

---

## Parallel Execution Opportunities

**Phase 1**:
- T003, T004, T005, T006 can run in parallel (common models)

**Phase 3-8**:
- Each user story phase can proceed independently after Phase 2
- T023, T036, T049, T062, T079, T094 (service scaffolds) can all run in parallel

---

## MVP Scope

**Minimum Viable Product**: Phases 1-4 (Setup, Foundational, Query Routing, Concept Explanations)

This delivers:
- Infrastructure ready
- Query routing working
- Concept explanations adaptive to mastery level

**Additional Phases**: Add debugging, exercises, progress tracking, code review, struggle detection for complete feature set.
