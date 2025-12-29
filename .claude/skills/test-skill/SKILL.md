---
name: test-skill
description: Test and validate Skills by executing them and measuring token usage
---

# Test Skill

Validate Skills by execution and measurement.

## Quick Start
```bash
# Test a specific skill
python scripts/test-skill.py --skill agents-md-gen

# Measure token usage
python scripts/measure-tokens.py

# Generate test report
python scripts/generate-report.py
```

## Instructions
1. Use `test-skill.py` to test a specific Skill
2. Use `measure-tokens.py` to check token efficiency
3. Use `generate-report.py` to create test report

## Validation
- [ ] Skill tested
- [ ] Token usage measured
- [ ] Report generated

See [REFERENCE.md](./REFERENCE.md) for testing patterns.
