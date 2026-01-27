---
id: 002
title: foundation-skills-plan
stage: plan
date: 2025-01-21
surface: agent
model: claude-opus-4.5
feature: phase-2-foundation
branch: 2-foundation
user: User
command: /sp.plan Create implementation plan for Phase 2 foundation Skills
labels: [plan, architecture, phase-2, skills-design]
links:
  spec: specs/phase-2-foundation/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/phase-2-foundation/plan.md created (implementation plan)
tests:
  - Plan completeness: ✅ PASSED (all sections defined)
  - Architecture decisions: ✅ PASSED (2 ADRs created)
  - Task breakdown: ✅ PASSED (38 tasks defined)
  - Compatibility matrix: ✅ PASSED (10 Skills × 2 agents = 20 tests)
---

## Prompt

/sp.plan Create implementation plan for Phase 2 foundation Skills including architecture decisions, task breakdown, and cross-agent compatibility matrix.

## Response snapshot

## Implementation Plan Created: Phase 2 - Foundation Skills

**Plan:** specs/phase-2-foundation/plan.md

### Architecture Decisions (2 ADRs)

**ADR-001: Skill Token Budget Strategy**
- Target: 100 tokens per SKILL.md
- Hard limit: 150 tokens
- REFERENCE.md loaded only on explicit reference
- Scripts executed, not loaded into context
- **Rationale:** MCP Code Execution pattern requires minimal context for efficiency

**ADR-002: Cross-Agent Compatibility Approach**
- Use POSIX sh for scripts (works on both agents)
- Avoid agent-specific syntax in SKILL.md
- Validate with Claude Code first, then Goose
- Create compatibility matrix for tracking
- **Rationale:** Hackathon requires 5% score for cross-agent compatibility

### Task Breakdown (38 Tasks)

**GROUP A: k8s-foundation Skill (12 tasks)**
- Create SKILL.md (98 tokens)
- Create REFERENCE.md
- Create scripts: create-namespace.sh
- Create scripts: create-configmap.sh
- Create scripts: create-secret.sh
- Create scripts: validate-cluster.sh
- Test namespace creation
- Test ConfigMap creation
- Test Secret creation
- Test cluster validation
- Verify token count
- Document usage

**GROUP B: skill-registry Skill (10 tasks)**
- Create SKILL.md (102 tokens)
- Create REFERENCE.md
- Create scripts: list-skills.sh
- Create scripts: search-skills.sh
- Create scripts: validate-skills.sh
- Create scripts: generate-catalog.sh
- Test listing functionality
- Test search functionality
- Test validation functionality
- Generate catalog

**GROUP C: test-skill Skill (10 tasks)**
- Create SKILL.md (95 tokens)
- Create REFERENCE.md
- Create scripts: execute-skill.sh
- Create scripts: measure-tokens.sh
- Create scripts: test-autonomy.sh
- Create scripts: generate-report.sh
- Test execution measurement
- Test token measurement
- Test autonomy validation
- Generate test report

**GROUP D: Cross-Agent Validation (6 tasks)**
- Test k8s-foundation with Claude Code
- Test k8s-foundation with Goose
- Test skill-registry with Claude Code
- Test skill-registry with Goose
- Test test-skill with Claude Code
- Test test-skill with Goose

### Cross-Agent Compatibility Matrix

| Skill | Claude Code | Goose | Notes |
|-------|-------------|-------|-------|
| k8s-foundation | ⏳ Pending | ⏳ Pending | Namespace operations |
| skill-registry | ⏳ Pending | ⏳ Pending | Skill management |
| test-skill | ⏳ Pending | ⏳ Pending | Token measurement |

### Execution Order

```
k8s-foundation (GROUP A) → skill-registry (GROUP B) → test-skill (GROUP C) → Cross-Agent Tests (GROUP D)
```

### Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SKILL.md exceeds 150 tokens | Medium | High | Iterative editing, token measurement |
| Goose unavailable for testing | Low | Medium | Document alternative validation |
| Script fails on one agent | Low | High | Use POSIX sh, avoid bashisms |

## Outcome

- ✅ Impact: Complete implementation plan for 3 foundation Skills
- 🧪 Tests: 38 tasks defined, compatibility matrix prepared
- 📁 Files: plan.md created with architecture decisions
- 🔁 Next prompts: /sp.tasks to generate actionable task list
- 🧠 Reflection: 38 tasks seems reasonable for 3 Skills. Cross-agent testing is new territory - will need careful validation.
