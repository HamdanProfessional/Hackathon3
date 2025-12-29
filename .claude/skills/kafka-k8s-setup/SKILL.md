---
name: kafka-k8s-setup
description: Deploy Apache Kafka on Kubernetes using Helm for event-driven microservices architecture. Use when user asks to deploy Kafka, setup event streaming, configure pub/sub infrastructure, or prepare for LearnFlow's event-driven architecture.
---

# Kafka Kubernetes Setup

Deploy Apache Kafka on Kubernetes using Bitnami Helm chart.

## When to Use
- User asks to "deploy Kafka" or "setup Kafka"
- Setting up event-driven microservices
- Preparing infrastructure for LearnFlow
- Configuring pub/sub messaging

## Quick Start
```bash
# Deploy Kafka
./scripts/deploy.sh

# Verify deployment
python scripts/verify.py

# Create test topic
python scripts/create-topic.py --name test-topic
```

## Instructions
1. Run deployment: `./scripts/deploy.sh`
2. Verify status: `python scripts/verify.py`
3. Confirm all pods Running before proceeding

## Validation
- [ ] All pods in Running state
- [ ] Can create test topic
- [ ] Kafka service accessible

See [REFERENCE.md](./REFERENCE.md) for configuration options.
