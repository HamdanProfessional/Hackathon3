---
id: 003
title: foundation-skills-tasks
stage: tasks
date: 2025-01-22
surface: agent
model: claude-opus-4.5
feature: phase-2-foundation
branch: 2-foundation
user: User
command: /sp.tasks Generate actionable tasks for Phase 2 foundation Skills
labels: [tasks, phase-2, actionable, acceptance-criteria]
links:
  spec: specs/phase-2-foundation/spec.md
  plan: specs/phase-2-foundation/plan.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/phase-2-foundation/tasks.md updated (actionable tasks)
tests:
  - Task actionability: ✅ PASSED (all tasks have acceptance criteria)
  - Test case coverage: ✅ PASSED (each task has validation)
  - Dependency ordering: ✅ PASSED (sequential flow validated)
  - Estimated completion: ✅ PASSED (45 minutes estimated)
---

## Prompt

/sp.tasks Generate actionable tasks for Phase 2 foundation Skills with acceptance criteria and test cases.

## Response snapshot

## Actionable Tasks Generated: Phase 2 - Foundation Skills

**Tasks:** specs/phase-2-foundation/tasks.md

### Task Groups

**GROUP A: k8s-foundation (12 tasks, 18 min)**
```
A1. Create k8s-foundation directory
   Acceptance: .claude/skills/k8s-foundation/ exists
   Test: ls .claude/skills/k8s-foundation shows directory

A2. Create SKILL.md
   Acceptance: SKILL.md exists with < 100 tokens
   Test: wc -c SKILL.md shows ~400-500 chars

A3. Create REFERENCE.md
   Acceptance: REFERENCE.md exists with full documentation
   Test: grep -q "## Usage" REFERENCE.md succeeds

A4. Create create-namespace.sh
   Acceptance: Script creates namespace successfully
   Test: ./create-namespace.sh test-ns && kubectl get ns test-ns

A5. Create create-configmap.sh
   Acceptance: Script creates ConfigMap from file
   Test: ./create-configmap.sh test-config test-data.yaml

A6. Create create-secret.sh
   Acceptance: Script creates Secret from literals
   Test: ./create-secret.sh test-secret KEY=value

A7. Create validate-cluster.sh
   Acceptance: Script runs cluster health checks
   Test: ./validate-cluster.sh returns "All healthy"

A8. Make scripts executable
   Acceptance: All .sh files have +x permission
   Test: find . -name "*.sh" -perm +111 | wc -l shows 4

A9. Test namespace creation
   Acceptance: k8s-test-namespace created
   Test: kubectl get ns k8s-test-namespace

A10. Test ConfigMap creation
   Acceptance: k8s-test-configmap created
   Test: kubectl get configmap k8s-test-configmap

A11. Test Secret creation
   Acceptance: k8s-test-secret created
   Test: kubectl get secret k8s-test-secret

A12. Verify token count
   Acceptance: SKILL.md < 100 tokens
   Test: Token count shows 98
```

**GROUP B: skill-registry (10 tasks, 15 min)**
```
B1. Create skill-registry directory
   Acceptance: .claude/skills/skill-registry/ exists
   Test: ls .claude/skills/skill-registry shows directory

B2. Create SKILL.md
   Acceptance: SKILL.md exists with < 110 tokens
   Test: wc -c SKILL.md shows ~420 chars

B3. Create REFERENCE.md
   Acceptance: REFERENCE.md exists with full docs
   Test: grep -q "## Commands" REFERENCE.md succeeds

B4. Create list-skills.sh
   Acceptance: Script lists all Skills
   Test: ./list-skills.sh shows Skills output

B5. Create search-skills.sh
   Acceptance: Script searches Skills by keyword
   Test: ./search-skills.sh k8s shows k8s matches

B6. Create validate-skills.sh
   Acceptance: Script validates all Skills
   Test: ./validate-skills.sh shows validation results

B7. Create generate-catalog.sh
   Acceptance: Script generates SKILLS_CATALOG.md
   Test: ./generate-catalog.sh creates catalog

B8. Test listing
   Acceptance: All Skills listed with metadata
   Test: ./list-skills.sh | wc -l shows 8+

B9. Test searching
   Acceptance: Keyword search returns matches
   Test: ./search-skills.sh k8s returns k8s-foundation

B10. Generate catalog
   Acceptance: SKILLS_CATALOG.md generated
   Test: cat SKILLS_CATALOG.md shows catalog
```

**GROUP C: test-skill (10 tasks, 17 min)**
```
C1. Create test-skill directory
   Acceptance: .claude/skills/test-skill/ exists
   Test: ls .claude/skills/test-skill shows directory

C2. Create SKILL.md
   Acceptance: SKILL.md exists with < 100 tokens
   Test: wc -c SKILL.md shows ~380 chars

C3. Create REFERENCE.md
   Acceptance: REFERENCE.md exists with full docs
   Test: grep -q "## Metrics" REFERENCE.md succeeds

C4. Create execute-skill.sh
   Acceptance: Script executes Skill and measures time
   Test: ./execute-skill.sh k8s-foundation shows duration

C5. Create measure-tokens.sh
   Acceptance: Script measures SKILL.md token count
   Test: ./measure-tokens.sh shows token counts

C6. Create test-autonomy.sh
   Acceptance: Script tests autonomous execution
   Test: ./test-autonomy.sh returns autonomy status

C7. Create generate-report.sh
   Acceptance: Script generates test report
   Test: ./generate-report.sh creates TEST_REPORT.md

C8. Test execution measurement
   Acceptance: Skill execution time measured
   Test: ./execute-skill.sh skill-registry shows time

C9. Test token measurement
   Acceptance: All Skills' tokens counted
   Test: ./measure-tokens.sh shows all Skills

C10. Generate test report
   Acceptance: TEST_REPORT.md generated
   Test: cat TEST_REPORT.md shows report
```

**GROUP D: Cross-Agent Validation (6 tasks, 15 min)**
```
D1. Test k8s-foundation with Claude Code
   Acceptance: Claude Code executes skill successfully
   Test: Single prompt creates namespace

D2. Test k8s-foundation with Goose
   Acceptance: Goose executes skill successfully
   Test: Single prompt creates namespace

D3. Test skill-registry with Claude Code
   Acceptance: Claude Code generates catalog
   Test: Single prompt generates SKILLS_CATALOG.md

D4. Test skill-registry with Goose
   Acceptance: Goose generates catalog
   Test: Single prompt generates SKILLS_CATALOG.md

D5. Test test-skill with Claude Code
   Acceptance: Claude Code measures tokens
   Test: Single prompt shows token counts

D6. Test test-skill with Goose
   Acceptance: Goose measures tokens
   Test: Single prompt shows token counts
```

### Execution Order

```
A1-A4 → A5-A8 → A9-A12 (k8s-foundation)
  ↓
B1-B4 → B5-B7 → B8-B10 (skill-registry)
  ↓
C1-C4 → C5-C7 → C8-C10 (test-skill)
  ↓
D1-D6 (Cross-Agent Tests)
```

### Total Estimates

- **Time:** 45 minutes
- **Tasks:** 38 tasks
- **Test Cases:** 38 validation tests
- **Success Rate Target:** 100%

## Outcome

- ✅ Impact: 38 actionable tasks with clear acceptance criteria
- 🧪 Tests: Each task has validation test case
- 📁 Files: tasks.md updated with executable task list
- 🔁 Next prompts: /sp.implement to execute the tasks
- 🧠 Reflection: Task breakdown looks solid. Cross-agent tests may be tricky if Goose not available.
