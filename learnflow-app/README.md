# LearnFlow Application

## Overview

LearnFlow is an AI-powered Python learning platform built with cloud-native, event-driven microservices architecture.

## Technology Stack

- **Frontend**: Next.js + Monaco Editor
- **Backend**: FastAPI + OpenAI SDK
- **Service Mesh**: Dapr
- **Messaging**: Kafka/Redpanda
- **Database**: PostgreSQL (Neon)
- **Orchestration**: Kubernetes

## Repository Structure

```
learnflow-app/
├── frontend/          # Next.js web application
├── backend/           # FastAPI microservices
│   ├── triage-service/
│   ├── concepts-service/
│   ├── debug-service/
│   ├── exercise-service/
│   └── progress-service/
├── infrastructure/    # Kubernetes manifests
└── docs/             # Generated documentation
```

## Development

This application is built using the Skills from the `skills-library` repository.

### Prerequisites

- Docker
- kubectl (configured for cluster access)
- Helm
- Claude Code or Goose

### Building with Skills

All components are built using reusable Skills from `skills-library`:

```bash
# Deploy infrastructure
cd ../skills-library
./.claude/skills/kafka-k8s-setup/scripts/deploy.sh
./.claude/skills/postgres-k8s-setup/scripts/deploy.sh

# Create microservices
./.claude/skills/fastapi-dapr-agent/scripts/generate.py --name triage-service --agent triage

# Deploy frontend
./.claude/skills/nextjs-k8s-deploy/scripts/deploy.sh learnflow-frontend

# Generate documentation
./.claude/skills/docusaurus-deploy/scripts/generate.py
```

## Status

**Phase**: 1 - Setup (In Progress)

This repository is a placeholder for Phase 7 when the actual LearnFlow application will be built using the Skills from `skills-library`.

## License

MIT License - See LICENSE file for details
