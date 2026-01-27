---
id: 001
title: foundation-skills-spec
stage: spec
date: 2025-01-20
surface: agent
model: claude-opus-4.5
feature: phase-2-foundation
branch: 2-foundation
user: User
command: /sp.specify Phase 2: Foundation Skills Development
labels: [specification, phase-2, skills, cross-agent-compatibility]
links:
  spec: specs/phase-2-foundation/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/phase-2-foundation/spec.md created (feature specification)
tests:
  - Specification completeness: ✅ PASSED (all sections filled)
  - Requirements traceability: ✅ PASSED (FR-001 to FR-032 defined)
  - Acceptance criteria: ✅ PASSED (3 user stories with scenarios)
  - Success criteria: ✅ PASSED (10 measurable outcomes defined)
---

## Prompt

/sp.specify Phase 2: Foundation Skills - Develop and validate foundation Skills (k8s-foundation, skill-registry, test-skill) while testing all Skills for cross-agent compatibility between Claude Code and Goose.

## Response snapshot

## Feature Specification Created: Phase 2 - Foundation Skills

**Specification:** specs/phase-2-foundation/spec.md

### User Scenarios Defined

**User Story 1 (P1):** Developer Creates Foundation Skills
- Create k8s-foundation for K8s operations
- Create skill-registry for skill management
- Create test-skill for execution testing
- All Skills under 250 tokens

**User Story 2 (P2):** Developer Validates Cross-Agent Compatibility
- Test all Skills with Claude Code
- Test all Skills with Goose
- Both agents produce equivalent results

**User Story 3 (P3):** Developer Validates Autonomous Execution
- Skills execute from single prompt
- No manual intervention required
- Token usage documented

### Requirements Defined

**Functional Requirements (FR-001 to FR-032):**
- FR-001 to FR-010: Foundation Skills creation (k8s-foundation, skill-registry, test-skill)
- FR-011 to FR-017: Cross-agent compatibility
- FR-018 to FR-022: Autonomous execution
- FR-023 to FR-027: Token efficiency
- FR-028 to FR-032: Skill structure validation

### Success Criteria

- SC-001: All 3 foundation Skills created and passing
- SC-002: 100% of required Skills tested with Claude Code
- SC-003: 100% of required Skills tested with Goose
- SC-004: 100% of Skills have SKILL.md under 250 tokens
- SC-005: 90% of Skills under 150 tokens
- SC-006: 3+ Skills demonstrate autonomous execution
- SC-007: Token efficiency improvement >80%
- SC-008: Cross-agent compatibility matrix documented
- SC-009: Skills execute in under 60 seconds
- SC-010: Zero manual intervention required

## Outcome

- ✅ Impact: Complete specification for foundation Skills development
- 🧪 Tests: 32 functional requirements defined
- 📁 Files: spec.md created with all mandatory sections
- 🔁 Next prompts: /sp.plan to create implementation plan
- 🧠 Reflection: Cross-agent compatibility is critical for hackathon requirements (5% of score). Token efficiency targets aggressive but achievable.
