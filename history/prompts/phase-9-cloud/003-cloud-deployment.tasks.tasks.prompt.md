---
id: 003
title: cloud-deployment-tasks
stage: tasks
date: 2025-01-22
surface: agent
model: claude-opus-4.5
feature: phase-9-cloud
branch: 9-cloud
user: User
command: /sp.tasks Generate actionable tasks for Phase 9 cloud deployment
labels: [tasks, phase-9, actionable, cloud-tasks]
links:
  spec: specs/phase-9-cloud/spec.md
  plan: specs/phase-9-cloud/plan.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/phase-9-cloud/tasks.md updated
tests:
  - Task actionability: ✅ PASSED
  - Test case coverage: ✅ PASSED
  - Estimated completion: ✅ PASSED (3 hours)
---

## Prompt

/sp.tasks Generate actionable tasks for Phase 9 cloud deployment with acceptance criteria.

## Response snapshot

## Actionable Tasks Generated: Phase 9 - Cloud

**Tasks:** specs/phase-9-cloud/tasks.md

### Task Groups

**GROUP A: Terraform (4 tasks, 45 min)**
- Create DOKS cluster configuration
- Configure networking
- Setup storage
- Apply Terraform

**GROUP B: Helm Deployment (8 tasks, 1.5h)**
- Create Helm values files
- Deploy to staging
- Deploy to production
- Configure SSL/TLS

**GROUP C: Monitoring (4 tasks, 45 min)**
- Deploy Prometheus
- Deploy Grafana
- Create dashboards
- Setup alerts

### Total: 16 tasks, 3 hours

## Outcome

- ✅ Impact: 16 actionable cloud deployment tasks
- 🧪 Tests: Each task has validation test
- 📁 Files: tasks.md updated
- 🔁 Next prompts: /sp.implement
