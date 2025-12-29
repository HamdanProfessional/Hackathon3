# Test Skill - Reference Guide

## Testing Patterns

### Structure Validation
Every Skill must have:
1. SKILL.md with YAML frontmatter
2. REFERENCE.md with documentation
3. scripts/ directory with executable code

### Token Measurement
```python
def measure_tokens(skill_path):
    skill_md = skill_path / "SKILL.md"
    char_count = skill_md.stat().st_size
    token_count = char_count // 4  # ~4 chars per token

    return {
        "skill": skill_path.name,
        "characters": char_count,
        "tokens": token_count,
        "status": "PASS" if token_count <= 250 else "FAIL"
    }
```

### Execution Testing

#### Dry Run Mode
For Skills that deploy resources, test with --dry-run flag:
```bash
kubectl apply --dry-run=client -f deployment.yaml
```

#### Script Testing
```bash
# Test script syntax
bash -n scripts/deploy.sh

# Test script execution
./scripts/deploy.sh --help
```

### Compatibility Testing

#### Claude Code
```bash
claude "
Use the agents-md-gen skill to generate AGENTS.md.
Report the result.
"
```

#### Goose
```bash
goose "
Use the agents-md-gen skill to generate AGENTS.md.
Report the result.
"
```

## Test Categories

### Unit Tests
- Individual script execution
- YAML syntax validation
- Frontmatter parsing

### Integration Tests
- Skill execution with agent
- Cross-agent compatibility
- Token efficiency

### Autonomous Tests
- Single prompt execution
- No manual intervention
- Result verification

## Test Report Format

```markdown
# Skills Test Report

**Date**: {timestamp}
**Total Skills**: {count}
**Passed**: {passed}
**Failed}: {failed}

## Results Summary

| Skill | Status | Tokens | Notes |
|-------|--------|--------|-------|
| agents-md-gen | PASS | 239 | ✓ |
| kafka-k8s-setup | PASS | 260 | ⚠️ Over target |
...

## Compatibility Matrix

| Skill | Claude Code | Goose |
|-------|-------------|-------|
| agents-md-gen | ✓ | ✓ |
...
```

## Common Issues

### Script Not Executable
```bash
chmod +x scripts/*.sh
```

### Python Script Errors
```bash
python3 -m py_compile scripts/script.py
```

### YAML Frontmatter Issues
Ensure proper format:
```yaml
---
name: skill-name
description: Skill description
---
```

## Performance Benchmarks

### Token Efficiency Targets
- Excellent: < 150 tokens
- Good: 150-200 tokens
- Acceptable: 200-250 tokens
- Poor: > 250 tokens

### Execution Time Targets
- Fast: < 5 seconds
- Medium: 5-30 seconds
- Slow: > 30 seconds

## Automated Testing

### CI/CD Integration
```yaml
# .github/workflows/test-skills.yml
name: Test Skills
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Validate Skills
        run: python3 .claude/skills/test-skill/scripts/test-skill.py --all
```

### Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
echo "Validating Skills..."
python3 .claude/skills/test-skill/scripts/validate-registry.py
```
