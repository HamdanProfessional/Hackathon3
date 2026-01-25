---
name: docusaurus-deploy
description: Deploy Docusaurus documentation sites with auto-generation from code and specs. Use when user asks to deploy docs, setup documentation, or generate API documentation.
---

# Docusaurus Documentation Deployment

Deploy Docusaurus documentation site with automated content generation.

## When to Use
- User asks to "deploy docs" or "setup documentation"
- Generating LearnFlow API documentation
- Auto-generating docs from specs

## Quick Start
```bash
# Generate docs
python scripts/generate.py

# Deploy site
./scripts/deploy.sh

# Verify
python scripts/verify.py
```

## Instructions
1. Generate: `python scripts/generate.py`
2. Deploy: `./scripts/deploy.sh`
3. Verify: `python scripts/verify.py`

## Validation
- [ ] Docs generated from specs
- [ ] Site deployed
- [ ] Search enabled

See [REFERENCE.md](./REFERENCE.md) for content generation and themes.
