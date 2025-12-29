---
name: postgres-k8s-setup
description: Deploy PostgreSQL on Kubernetes using Helm for LearnFlow database persistence. Use when user asks to deploy PostgreSQL, setup database, or configure data persistence for the learning platform.
---

# PostgreSQL Kubernetes Setup

Deploy PostgreSQL on Kubernetes using Bitnami Helm chart.

## When to Use
- User asks to "deploy PostgreSQL" or "setup database"
- Configuring data persistence for LearnFlow
- Preparing database for microservices

## Quick Start
```bash
# Deploy PostgreSQL
./scripts/deploy.sh

# Verify deployment
python scripts/verify.py

# Run migrations
./scripts/migrate.sh
```

## Instructions
1. Run deployment: `./scripts/deploy.sh`
2. Verify status: `python scripts/verify.py`
3. Run migrations: `./scripts/migrate.sh`

## Validation
- [ ] Pod in Running state
- [ ] Database accessible
- [ ] Migrations applied

See [REFERENCE.md](./REFERENCE.md) for configuration options.
