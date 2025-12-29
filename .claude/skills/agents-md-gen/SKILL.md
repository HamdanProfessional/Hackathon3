---
name: agents-md-gen
description: Generate AGENTS.md files for codebase documentation to help AI agents understand project structure and conventions. Use when user asks to generate AGENTS.md, create project documentation, or setup AI-friendly documentation.
---

# AGENTS.md Generator

Generate comprehensive AGENTS.md files for AI agent codebase understanding.

## When to Use
- User asks to "generate AGENTS.md" or "create project documentation"
- Onboarding new AI agents to codebase
- Documenting project structure and conventions

## Quick Start
```bash
# Generate AGENTS.md
python scripts/generate.py

# Validate
python scripts/validate.py
```

## Instructions
1. Analyze codebase: `python scripts/generate.py`
2. Review generated AGENTS.md
3. Validate: `python scripts/validate.py`

## Validation
- [ ] AGENTS.md generated
- [ ] Structure documented
- [ ] Conventions defined

See [REFERENCE.md](./REFERENCE.md) for AGENTS.md format and sections.
