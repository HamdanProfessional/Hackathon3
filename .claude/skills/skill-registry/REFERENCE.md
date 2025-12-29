# Skill Registry - Reference Guide

## Registry Schema

Each Skill has metadata in its SKILL.md frontmatter:

```yaml
---
name: skill-name
description: Brief description
---
```

## Skill Categories

### Infrastructure
- k8s-foundation
- k8s-deployer
- k8s-troubleshoot
- kubernetes-helm
- infrastructure

### Backend Development
- backend-scaffolder
- fastapi-dapr-agent
- crud-builder
- fastapi-endpoint-generator
- sqlmodel-schema-builder
- db-migration-wizard

### Frontend Development
- frontend-component
- nextjs-k8s-deploy
- console-ui-builder

### AI & Agents
- agent-builder
- agent-orchestrator
- mcp-code-execution
- mcp-tool-maker
- conversation-history-manager
- stateless-agent-enforcer

### Deployment & Operations
- deploy-vercel
- cloud-deployer
- deployment-validator
- cloud-devops

### Event-Driven
- dapr-events
- dapr-event-flow

### Documentation
- doc-generator
- docusaurus-deploy
- adr-generator
- agents-md-gen

### Testing
- development
- integration-tester
- e2e-tester
- test-builder
- console-app-tester

### Architecture
- architecture-planner
- spec-architect
- phase-management

## Validation Rules

### Required Files
Each Skill MUST have:
- `SKILL.md` - Main skill file
- `REFERENCE.md` - Detailed documentation
- `scripts/` - At least one script

### SKILL.md Format
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

See [REFERENCE.md](./REFERENCE.md) for details.
```

### Token Budget
- SKILL.md should be ~100-250 tokens
- Count characters / 4 ≈ token count

## Catalog Format

```markdown
# Skills Catalog

## Infrastructure
### k8s-foundation
Kubernetes foundation operations - namespaces, ConfigMaps, Secrets

### k8s-deployer
Deploy applications to Kubernetes with Helm charts

...
```

## Search Patterns

### By Name
Search for "kafka" finds:
- kafka-k8s-setup

### By Description
Search for "database" finds:
- postgres-k8s-setup
- sqlmodel-schema-builder
- db-migration-wizard

### By Category
Search for "agent" finds:
- agent-builder
- agent-orchestrator
- mcp-code-execution
- mcp-tool-maker

## Validation Checks

### Structure Check
```python
def validate_skill(skill_path):
    required = ["SKILL.md", "REFERENCE.md"]
    has_scripts = os.path.isdir(f"{skill_path}/scripts")

    for file in required:
        if not os.path.exists(f"{skill_path}/{file}"):
            return False, f"Missing {file}"

    if not has_scripts:
        return False, "Missing scripts/ directory"

    return True, "Valid"
```

### Token Check
```python
def check_token_budget(skill_path):
    skill_md = f"{skill_path}/SKILL.md"
    with open(skill_md) as f:
        content = f.read()

    char_count = len(content)
    token_count = char_count // 4

    if token_count > 250:
        return False, f"{token_count} tokens exceeds 250 limit"

    return True, f"~{token_count} tokens"
```

### YAML Check
```python
def validate_frontmatter(skill_path):
    skill_md = f"{skill_path}/SKILL.md"
    with open(skill_md) as f:
        content = f.read()

    if not content.startswith("---"):
        return False, "Missing YAML delimiter"

    try:
        frontmatter = content.split("---")[1]
        yaml.safe_load(frontmatter)
        return True, "Valid YAML"
    except:
        return False, "Invalid YAML"
```

## Catalog Generation

### Markdown Format
```markdown
# Skills Catalog

Generated: {timestamp}
Total Skills: {count}

## Categories

{category_sections}
```

### JSON Format
```json
{
  "generated": "{timestamp}",
  "total": {count},
  "skills": [
    {
      "name": "skill-name",
      "description": "Brief description",
      "category": "category",
      "tokens": 123
    }
  ]
}
```
