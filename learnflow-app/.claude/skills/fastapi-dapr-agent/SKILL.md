---
name: fastapi-dapr-agent
description: Create FastAPI microservices with Dapr sidecar and AI agent integration for LearnFlow. Use when user asks to create a microservice, add Dapr integration, or implement AI agents in backend services.
---

# FastAPI + Dapr + Agent Microservice

Scaffold a complete FastAPI microservice with Dapr sidecar, state management, and AI agent.

## When to Use
- User asks to "create microservice" or "add Dapr"
- Implementing LearnFlow backend services (Triage, Concepts, Debug, etc.)
- Building event-driven services

## Quick Start
```bash
# Create microservice
python scripts/generate.py --name triage-service --agent triage

# Deploy with Dapr
./scripts/deploy.sh
```

## Instructions
1. Generate service: `python scripts/generate.py --name <service-name> --agent <agent-type>`
2. Review generated files
3. Deploy: `./scripts/deploy.sh`

## Validation
- [ ] Service scaffolded with FastAPI
- [ ] Dapr configuration included
- [ ] Agent template generated

See [REFERENCE.md](./REFERENCE.md) for agent types and configurations.
