---
name: skill-registry
description: Maintain registry of all Skills with search, validation, and catalog generation
---

# Skill Registry

Manage the registry of all available Skills.

## Quick Start
```bash
# List all Skills
python scripts/list-skills.py

# Search Skills by keyword
python scripts/search-skills.py --keyword kafka

# Validate all Skills
python scripts/validate-registry.py

# Generate catalog
python scripts/generate-catalog.py
```

## Instructions
1. Use `list-skills.py` to see all available Skills
2. Use `search-skills.py` to find Skills by keyword
3. Use `validate-registry.py` to check all Skills
4. Use `generate-catalog.py` to create Skills catalog

## Validation
- [ ] All Skills listed
- [ ] Registry validated
- [ ] Catalog generated

See [REFERENCE.md](./REFERENCE.md) for registry schema.
