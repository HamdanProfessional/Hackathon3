# Feature Specification: Phase 2 - Foundation Skills

**Feature Branch**: `2-foundation`
**Created**: 2025-01-26
**Status**: Draft
**Input**: Develop and validate foundation Skills while testing all Skills for cross-agent compatibility between Claude Code and Goose

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Creates Foundation Skills (Priority: P1)

As a developer, I need to create foundation Skills (k8s-foundation, skill-registry, test-skill) so that I have reusable capabilities for Kubernetes operations, skill management, and testing.

**Why this priority**: Foundation Skills are required building blocks for later phases. Without them, Skills cannot be properly managed or tested.

**Independent Test**: All three foundation Skills exist with SKILL.md (~100 tokens), REFERENCE.md, and executable scripts that run successfully.

**Acceptance Scenarios**:

1. **Given** no k8s-foundation skill exists, **When** developer creates it, **Then** it contains scripts for namespace, configmap, secret, and cluster validation operations
2. **Given** no skill-registry exists, **When** developer creates it, **Then** it can list, search, and validate all Skills in the repository
3. **Given** no test-skill exists, **When** developer creates it, **Then** it can execute a Skill and measure token usage
4. **Given** a foundation Skill is created, **When** developer checks SKILL.md size, **Then** it is under 250 tokens

---

### User Story 2 - Developer Validates Cross-Agent Compatibility (Priority: P2)

As a developer, I need to test all Skills with both Claude Code and Goose so that I can ensure they work autonomously with multiple AI agents.

**Why this priority**: Cross-agent compatibility is a hackathon requirement (5% of score). Can be done in parallel with Skill creation.

**Independent Test**: Cross-agent compatibility matrix shows all 7 required Skills tested and working with both Claude Code and Goose.

**Acceptance Scenarios**:

1. **Given** the agents-md-gen skill, **When** tested with Claude Code, **Then** it generates AGENTS.md successfully
2. **Given** the agents-md-gen skill, **When** tested with Goose, **Then** it generates AGENTS.md successfully
3. **Given** any Skill from Phase 1, **When** tested with both agents, **Then** both produce equivalent results
4. **Given** a Skill that fails on one agent, **When** developer fixes it, **Then** it works on both agents

---

### User Story 3 - Developer Validates Autonomous Execution (Priority: P3)

As a developer, I need to validate that Skills execute autonomously from a single prompt so that I can demonstrate the MCP Code Execution pattern benefits.

**Why this priority**: Important for demonstrating token efficiency and autonomy, but lower priority than having Skills that work.

**Independent Test**: At least 3 Skills execute end-to-end with single prompt on both agents without manual intervention.

**Acceptance Scenarios**:

1. **Given** an agent with access to Skills, **When** single prompt requests AGENTS.md generation, **Then** agent executes skill autonomously
2. **Given** an agent with access to Skills, **When** single prompt requests skill validation, **Then** agent executes test-skill autonomously
3. **Given** an agent with access to Skills, **When** single prompt requests skill listing, **Then** agent executes skill-registry autonomously
4. **Given** autonomous execution, **When** completed, **Then** token usage is documented

---

### Edge Cases

- What happens when Claude Code and Goose produce different results for the same Skill?
- How does system handle Skills that require interactive input (passwords, confirmations)?
- What happens when Skill scripts have permission errors on execution?
- How does system validate Skill output format differences between agents?
- What happens when required Skills are missing from the repository?

---

## Requirements *(mandatory)*

### Functional Requirements

#### Foundation Skills Creation
- **FR-001**: System MUST provide k8s-foundation skill for namespace operations
- **FR-002**: System MUST provide k8s-foundation skill for ConfigMap creation
- **FR-003**: System MUST provide k8s-foundation skill for Secret creation
- **FR-004**: System MUST provide k8s-foundation skill for cluster validation
- **FR-005**: System MUST provide skill-registry skill for listing Skills
- **FR-006**: System MUST provide skill-registry skill for searching Skills
- **FR-007**: System MUST provide skill-registry skill for validating Skills
- **FR-008**: System MUST provide test-skill skill for executing Skills
- **FR-009**: System MUST provide test-skill skill for measuring token usage
- **FR-010**: System MUST provide test-skill skill for generating test reports

#### Cross-Agent Compatibility
- **FR-011**: All Skills MUST work with Claude Code (Claude 3.5 Sonnet, Opus 4.5)
- **FR-012**: All Skills MUST work with Goose (with Claude, GPT-4, or Gemini)
- **FR-013**: Skills MUST NOT use agent-specific syntax in SKILL.md
- **FR-014**: Skills MUST use standard POSIX sh or Python 3 for scripts
- **FR-015**: Skills MUST handle both Windows (WSL2) and Unix environments
- **FR-016**: All 7 required Skills from Phase 1 MUST be tested with Claude Code
- **FR-017**: All 7 required Skills from Phase 1 MUST be tested with Goose

#### Autonomous Execution
- **FR-018**: Skills MUST execute autonomously from single prompt
- **FR-019**: Skills MUST NOT require manual intervention during execution
- **FR-020**: Skills MUST return success/failure status to agent
- **FR-021**: Skills MUST provide minimal output (result only)
- **FR-022**: At least 3 Skills MUST demonstrate autonomous execution

#### Token Efficiency
- **FR-023**: SKILL.md files MUST be under 250 tokens maximum
- **FR-024**: SKILL.md files SHOULD target ~100 tokens (400-500 characters)
- **FR-025**: REFERENCE.md MUST NOT be loaded unless explicitly referenced
- **FR-026**: Scripts MUST be executed, not loaded into context
- **FR-027**: Token usage MUST be measured and documented

#### Skill Structure
- **FR-028**: Each Skill MUST contain SKILL.md file
- **FR-029**: Each Skill MUST contain REFERENCE.md file
- **FR-030**: Each Skill MUST contain scripts/ directory
- **FR-031**: Scripts MUST be executable (chmod +x)
- **FR-032**: Scripts MUST return meaningful exit codes (0 = success)

### Key Entities

- **Foundation Skill**: A core building-block Skill (k8s-foundation, skill-registry, test-skill)
- **Required Skill**: One of 7 mandatory Skills from Phase 1 (agents-md-gen, kafka-k8s-setup, etc.)
- **AI Agent**: An AI coding assistant (Claude Code or Goose) that can execute Skills
- **Skill Execution**: The autonomous execution of a Skill by an AI agent from a single prompt
- **Token Budget**: The maximum number of tokens a Skill's SKILL.md may consume
- **Compatibility Matrix**: A table tracking which Skills work with which AI agents

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 3 foundation Skills created and passing validation
- **SC-002**: 100% of required Skills (7/7) tested successfully with Claude Code
- **SC-003**: 100% of required Skills (7/7) tested successfully with Goose
- **SC-004**: 100% of Skills have SKILL.md under 250 tokens
- **SC-005**: 90% of Skills have SKILL.md under 150 tokens (target: ~100 tokens)
- **SC-006**: At least 3 Skills demonstrate autonomous execution on both agents
- **SC-007**: Token efficiency improvement of >80% compared to direct MCP integration
- **SC-008**: Cross-agent compatibility matrix fully documented with test results
- **SC-009**: Skills execute from single prompt in under 60 seconds
- **SC-010**: Zero manual intervention required for autonomous execution

---

## Assumptions

1. Phase 1 is complete (environment ready, 7 required Skills exist)
2. Claude Code is installed and authenticated
3. Goose is installed (or tests can be skipped if unavailable)
4. Kubernetes cluster is accessible for k8s-foundation testing
5. Developer has permissions to execute scripts and create resources
6. Git repository is properly initialized
7. Skills follow MCP Code Execution pattern from Phase 1

---

## Out of Scope

For Phase 2, the following are explicitly out of scope:

- Deploying actual infrastructure (Kafka, PostgreSQL deployments)
- Writing application code for LearnFlow
- Cloud deployment setup
- Creating bonus Skills beyond the 3 foundation Skills
- Performance benchmarking beyond token usage
- Skills catalog website (optional P2 item)
- Video demonstrations (optional P2 item)

These will be addressed in later phases.
