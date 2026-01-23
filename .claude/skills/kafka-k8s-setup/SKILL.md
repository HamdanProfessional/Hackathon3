---
name: kafka-k8s-setup
description: Deploy Apache Kafka on Kubernetes using Helm for event-driven architecture.
---

# Kafka Kubernetes Setup

Deploy Apache Kafka on Kubernetes using Bitnami Helm chart.

## Quick Start
```bash
./scripts/deploy.sh
python scripts/verify.py
python scripts/create-topic.py --name test-topic
```

## Instructions
1. Deploy: `./scripts/deploy.sh`
2. Verify: `python scripts/verify.py`
3. Confirm all pods Running

## Validation
- [ ] All pods Running
- [ ] Can create topic
- [ ] Service accessible

See [REFERENCE.md](./REFERENCE.md) for configuration.
