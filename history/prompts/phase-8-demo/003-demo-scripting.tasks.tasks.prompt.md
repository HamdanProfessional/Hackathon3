---
id: 003
title: demo-scripting-tasks
stage: tasks
date: 2025-01-22
surface: agent
model: claude-opus-4.5
feature: phase-8-demo
branch: 8-demo
user: User
command: /sp.tasks Generate actionable tasks for Phase 8 demo
labels: [tasks, phase-8, actionable, demo-tasks]
links:
  spec: specs/phase-8-demo/spec.md
  plan: specs/phase-8-demo/plan.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/phase-8-demo/tasks.md updated
tests:
  - Task actionability: ✅ PASSED
  - Test case coverage: ✅ PASSED
  - Estimated completion: ✅ PASSED (2 hours)
---

## Prompt

/sp.tasks Generate actionable tasks for Phase 8 demo with acceptance criteria.

## Response snapshot

## Actionable Tasks Generated: Phase 8 - Demo

**Tasks:** specs/phase-8-demo/tasks.md

### Task Groups

**GROUP A: Demo Script (2 tasks, 45 min)**
- Create 8-minute demo flow
- Write presenter notes

**GROUP B: Test Data (3 tasks, 30 min)**
- Create 3 demo students
- Generate progress data
- Create exercise submissions

**GROUP C: Recording (2 tasks, 30 min)**
- Setup screen recording
- Create automation script

**GROUP D: Documentation (1 task, 15 min)**
- Create demo guide

### Total: 8 tasks, 2 hours

## Outcome

- ✅ Impact: 8 actionable demo tasks
- 🧪 Tests: Each task has validation test
- 📁 Files: tasks.md updated
- 🔁 Next prompts: /sp.implement
