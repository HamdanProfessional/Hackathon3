---
id: 003
title: backend-microservices-tasks
stage: tasks
date: 2025-01-22
surface: agent
model: claude-opus-4.5
feature: phase-4-backend
branch: 4-backend
user: User
command: /sp.tasks Generate actionable tasks for Phase 4 backend microservices
labels: [tasks, phase-4, actionable, backend-tasks]
links:
  spec: specs/phase-4-backend/spec.md
  plan: specs/phase-4-backend/plan.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/phase-4-backend/tasks.md updated
tests:
  - Task actionability: ✅ PASSED
  - Test case coverage: ✅ PASSED
  - Estimated completion: ✅ PASSED (3 hours)
---

## Prompt

/sp.tasks Generate actionable tasks for Phase 4 backend microservices with acceptance criteria.

## Response snapshot

## Actionable Tasks Generated: Phase 4 - Backend Microservices

**Tasks:** specs/phase-4-backend/tasks.md

### Task Groups

**GROUP A: Shared Code (8 tasks, 30 min)**
- Create shared/models.py with all Pydantic models
- Create shared/dapr_client.py with LearnFlowDaprClient
- Add Dapr dependencies to pyproject.toml
- Create base service template

**GROUP B: Services (36 tasks, 2h)**
- Triage service: 6 tasks (routes, classification, invocation)
- Concepts service: 6 tasks (explanations, mastery levels, events)
- Debug service: 6 tasks (error parsing, hints, alerts)
- Exercise service: 6 tasks (generation, grading, events)
- Progress service: 6 tasks (tracking, calculation, events)
- Code review service: 6 tasks (analysis, feedback, events)

**GROUP C: K8s Configs (8 tasks, 30 min)**
- Create backend-services.yaml with all 6 deployments
- Add Dapr annotations to all services
- Create configmap.yaml
- Create secret.yaml

**GROUP D: Testing (4 tasks, 1h)**
- Unit tests for each service
- Integration tests for service invocation
- E2E tests for complete flows
- Load testing

### Total: 56 tasks, 3 hours

## Outcome

- ✅ Impact: 56 actionable backend tasks
- 🧪 Tests: Each task has validation test
- 📁 Files: tasks.md updated
- 🔁 Next prompts: /sp.implement
