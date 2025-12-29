---
title: Phase 2 - Foundation Skills
status: Draft
category: Skills Development
priority: P0
---

# Phase 2: Foundation Skills

## Overview

Develop and validate additional foundation Skills while testing all Skills for cross-agent compatibility between Claude Code and Goose. This phase ensures the Skills work autonomously with both AI coding agents.

## Context

**Phase 1 Status**: Complete
- Environment ready (Docker, Kubernetes, Helm, Claude Code)
- 7 required Hackathon 3 Skills created
- DigitalOcean Kubernetes cluster running
- All verification tests passing

**Phase 2 Goal**: Build on Phase 1 by creating additional foundation Skills and validating cross-agent compatibility.

**Critical Success Factor**: Skills work autonomously with both Claude Code AND Goose from a single prompt.

---

## Acceptance Criteria

### Must Have (P0)
- [ ] `k8s-foundation` skill created and tested
- [ ] `skill-registry` skill created (tracks all skills)
- [ ] `test-skill` skill created (validates skill execution)
- [ ] All 7 required Skills tested with Claude Code
- [ ] All 7 required Skills tested with Goose
- [ ] Cross-agent compatibility verified
- [ ] At least 3 Skills executed autonomously end-to-end

### Should Have (P1)
- [ ] `yaml-validator` skill created
- [ ] `helm-template` skill created
- [ ] Skills documentation updated with test results
- [ ] Performance benchmark (token usage) documented

### Nice to Have (P2)
- [ ] `skill-linter` skill created
- [ ] Video demos of Skills working with both agents
- [ ] Skills catalog website generated

---

## Functional Requirements

### FR1: k8s-foundation Skill

**Description**: Create a comprehensive skill for Kubernetes foundation tasks - namespaces, configmaps, secrets, and basic deployments.

**Use Cases**:
- Create project namespace
- Generate ConfigMap from env file
- Create Secret from literal values
- Validate cluster access
- List cluster resources

**Deliverables**:
- SKILL.md (~100 tokens)
- REFERENCE.md with K8s patterns
- scripts/create-namespace.sh
- scripts/create-configmap.sh
- scripts/create-secret.sh
- scripts/validate-cluster.sh

### FR2: skill-registry Skill

**Description**: Create a skill that maintains a registry of all available Skills with their capabilities and metadata.

**Use Cases**:
- List all available Skills
- Search Skills by keyword
- Get Skill metadata
- Validate Skill structure
- Generate Skills catalog

**Deliverables**:
- SKILL.md (~100 tokens)
- REFERENCE.md with registry schema
- scripts/list-skills.py
- scripts/search-skills.py
- scripts/validate-registry.py
- scripts/generate-catalog.py

### FR3: test-skill Skill

**Description**: Create a skill that validates other Skills by executing them and verifying results.

**Use Cases**:
- Test a specific Skill
- Validate Skill output
- Measure token usage
- Check Skill execution time
- Generate test report

**Deliverables**:
- SKILL.md (~100 tokens)
- REFERENCE.md with testing patterns
- scripts/test-skill.py
- scripts/measure-tokens.py
- scripts/generate-report.py

### FR4: Cross-Agent Compatibility Testing

**Description**: Test all 7 required Skills with both Claude Code and Goose.

**Test Matrix**:

| Skill | Claude Code | Goose | Notes |
|-------|-------------|-------|-------|
| agents-md-gen | ⬜ | ⬜ | Test AGENTS.md generation |
| kafka-k8s-setup | ⬜ | ⬜ | Test Kafka deployment (dry-run) |
| postgres-k8s-setup | ⬜ | ⬜ | Test PostgreSQL deployment (dry-run) |
| fastapi-dapr-agent | ⬜ | ⬜ | Test microservice generation |
| mcp-code-execution | ⬜ | ⬜ | Test MCP server generation |
| nextjs-k8s-deploy | ⬜ | ⬜ | Test deployment scripts |
| docusaurus-deploy | ⬜ | ⬜ | Test doc generation |

**Success**: All skills execute with minimal user intervention on both agents.

### FR5: Autonomous Execution Validation

**Description**: Validate that Skills can execute autonomously from a single prompt.

**Test Cases**:
1. Generate AGENTS.md with single prompt
2. Deploy Kafka (dry-run mode) with single prompt
3. Generate FastAPI service with single prompt

**Success Criteria**:
- Agent loads Skill
- Agent executes scripts
- Agent returns success/failure
- No manual intervention required

---

## Technical Specifications

### TS1: Skill Template Standard

All new Skills MUST follow the MCP Code Execution pattern:

```markdown
---
name: skill-name
description: Brief description (< 100 chars)
---

# Skill Name

Brief description.

## Quick Start
```bash
# One-command example
./scripts/main.sh
```

## Instructions
1. Step one
2. Step two
3. Step three

See [REFERENCE.md](./REFERENCE.md) for details.
```

### TS2: Script Standards

All scripts MUST:
1. Use proper shebang: `#!/bin/bash` or `#!/usr/bin/env python3`
2. Be executable: `chmod +x scripts/*.sh`
3. Return meaningful exit codes (0 = success, non-zero = failure)
4. Print minimal output (result only)
5. Handle errors gracefully

### TS3: Cross-Agent Compatibility

Skills MUST be compatible with:
- **Claude Code** (Claude 3.5 Sonnet, Opus 4.5)
- **Goose** (with any LLM: Claude, GPT-4, Gemini)

**Compatibility Requirements**:
1. No agent-specific syntax in SKILL.md
2. Scripts use standard POSIX sh or Python 3
3. Instructions are clear and unambiguous
4. No hardcoded paths (use environment variables)

### TS4: Token Budget Targets

| Component | Target | Maximum |
|-----------|--------|---------|
| SKILL.md | ~100 tokens | 250 tokens |
| REFERENCE.md | N/A (on-demand) | N/A |
| scripts/* | 0 tokens (executed) | N/A |
| Total per Skill | ~100 tokens | 250 tokens |

---

## Testing Strategy

### Test 1: Skill Structure Validation
```bash
#!/bin/bash
# scripts/validate-skill-structure.sh

validate_skill() {
    local skill_path="$1"
    local errors=0

    # Check SKILL.md
    if [ ! -f "$skill_path/SKILL.md" ]; then
        echo "✗ Missing SKILL.md"
        ((errors++))
    fi

    # Check REFERENCE.md
    if [ ! -f "$skill_path/REFERENCE.md" ]; then
        echo "✗ Missing REFERENCE.md"
        ((errors++))
    fi

    # Check scripts directory
    if [ ! -d "$skill_path/scripts" ]; then
        echo "✗ Missing scripts/ directory"
        ((errors++))
    fi

    # Check scripts are executable
    for script in "$skill_path/scripts"/*; do
        if [ -f "$script" ] && [ ! -x "$script" ]; then
            echo "⚠ Script not executable: $script"
        fi
    done

    return $errors
}
```

### Test 2: Token Efficiency Check
```bash
#!/bin/bash
# scripts/check-token-efficiency.sh

for skill in .claude/skills/*/SKILL.md; do
    size=$(wc -c < "$skill")
    tokens=$((size / 4))

    if [ $tokens -gt 250 ]; then
        echo "✗ $skill: $tokens tokens (exceeds 250 limit)"
    elif [ $tokens -gt 150 ]; then
        echo "⚠ $skill: $tokens tokens (above target)"
    else
        echo "✓ $skill: $tokens tokens"
    fi
done
```

### Test 3: Claude Code Compatibility Test
```bash
# Using Claude Code to test a Skill
claude "
Please use the agents-md-gen skill to generate AGENTS.md for this project.
Load the skill from .claude/skills/agents-md-gen/
Execute the appropriate scripts.
Report the result.
"
```

### Test 4: Goose Compatibility Test
```bash
# Using Goose to test a Skill
goose "
Use the agents-md-gen skill from .claude/skills/agents-md-gen/
Generate AGENTS.md for this project.
Report the result.
"
```

### Test 5: Autonomous Execution Test
```bash
#!/bin/bash
# scripts/test-autonomous-execution.sh

# Test: Can agent execute skill autonomously?
echo "Testing autonomous execution..."

# Record start time
start=$(date +%s)

# Execute with Claude Code
claude "
Use the test-skill skill to validate the kafka-k8s-setup skill.
Report the results.
" > /tmp/claude-test-output.log 2>&1

# Record end time
end=$(date +%s)
duration=$((end - start))

# Check output
if grep -q "✓" /tmp/claude-test-output.log; then
    echo "✓ Autonomous execution successful (${duration}s)"
else
    echo "✗ Autonomous execution failed"
fi
```

---

## New Skills to Create

### Skill 1: k8s-foundation

**Purpose**: Kubernetes foundation operations

**Scripts**:
- `create-namespace.sh` - Create K8s namespace
- `create-configmap.sh` - Create ConfigMap from file
- `create-secret.sh` - Create Secret from literals
- `validate-cluster.sh` - Validate cluster access

### Skill 2: skill-registry

**Purpose**: Maintain registry of all Skills

**Scripts**:
- `list-skills.py` - List all available Skills
- `search-skills.py` - Search Skills by keyword
- `validate-registry.py` - Validate all Skills
- `generate-catalog.py` - Generate Skills catalog

### Skill 3: test-skill

**Purpose**: Test and validate Skills

**Scripts**:
- `test-skill.py` - Execute and validate a Skill
- `measure-tokens.py` - Measure token usage
- `generate-report.py` - Generate test report

### Optional Skills (P2)

- `yaml-validator` - Validate YAML syntax
- `helm-template` - Template Helm charts
- `skill-linter` - Lint Skills for best practices

---

## Out of Scope

For Phase 2, the following are explicitly out of scope:
- Deploying actual infrastructure (Kafka, PostgreSQL) - Phase 3
- Writing application code - Phase 4+
- Cloud deployment - Phase 9
- Creating bonus Skills (unless time permits)

---

## Dependencies

### Phase Dependencies
- **Phase 1**: Must be complete (environment, cluster, 7 required Skills)

### External Dependencies
- Claude Code installed and working
- Goose installed (or skip Goose tests if not available)
- Kubernetes cluster accessible
- Git repository initialized

---

## Definition of Done

Phase 2 is complete when:
1. ✓ `k8s-foundation` skill created with all scripts
2. ✓ `skill-registry` skill created and working
3. ✓ `test-skill` skill created and working
4. ✓ All 7 required Skills tested with Claude Code
5. ✓ All 7 required Skills tested with Goose (if available)
6. ✓ Cross-agent compatibility matrix filled
7. ✓ At least 3 Skills demonstrated autonomous execution
8. ✓ Token efficiency benchmark documented
9. ✓ Git commit with Phase 2 changes

---

## Rollback Plan

If issues occur during Phase 2:

| Issue | Rollback Action |
|-------|-----------------|
| Skill fails validation | Fix SKILL.md size, update scripts |
| Agent compatibility issue | Rewrite SKILL.md for clarity |
| Script execution failure | Add error handling, test locally |
| Token budget exceeded | Move content to REFERENCE.md |

---

## Success Metrics

### Quantitative
- [ ] 3 new Skills created (k8s-foundation, skill-registry, test-skill)
- [ ] 7/7 required Skills tested with Claude Code
- [ ] 7/7 required Skills tested with Goose
- [ ] 100% autonomous execution rate
- [ ] All Skills < 250 tokens

### Qualitative
- [ ] Skills work seamlessly with both agents
- [ ] Single prompt achieves desired result
- [ ] No manual intervention required
- [ ] Clear documentation of test results

---

## References

- [Claude Code Skills Format](https://code.claude.com/docs/en/skills)
- [Goose Recipe Format](https://block.github.io/goose/authoring/recipes/)
- [MCP Code Execution Pattern](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Best Practices](https://helm.sh/docs/chart_best_practices/)
