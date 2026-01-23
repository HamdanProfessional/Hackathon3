---
name: fastapi-dapr-agent
description: Create FastAPI microservices with Dapr sidecar and AI agent integration.
---

# FastAPI + Dapr + Agent Microservice

Scaffold FastAPI microservice with Dapr sidecar and AI agent.

## Quick Start
```bash
python scripts/generate.py --name triage-service --agent triage
./scripts/deploy.sh
```

## Instructions
1. Generate: `python scripts/generate.py --name <service> --agent <type>`
2. Review generated files
3. Deploy: `./scripts/deploy.sh`

## Validation
- [ ] Service scaffolded
- [ ] Dapr configured
- [ ] Agent template created

See [REFERENCE.md](./REFERENCE.md) for details.
