---
name: nextjs-k8s-deploy
description: Deploy Next.js applications on Kubernetes with Docker and ingress configuration. Use when user asks to deploy Next.js app, setup frontend, or configure web UI deployment.
---

# Next.js Kubernetes Deployment

Deploy Next.js applications on Kubernetes with containerization and ingress.

## When to Use
- User asks to "deploy Next.js" or "setup frontend"
- Deploying LearnFlow web UI
- Configuring ingress for web applications

## Quick Start
```bash
# Build and deploy
./scripts/deploy.sh

# Verify deployment
python scripts/verify.py

# Setup ingress
./scripts/ingress.sh
```

## Instructions
1. Build: `./scripts/deploy.sh`
2. Verify: `python scripts/verify.py`
3. Configure ingress: `./scripts/ingress.sh`

## Validation
- [ ] Docker image built
- [ ] Deployment running
- [ ] Service accessible

See [REFERENCE.md](./REFERENCE.md) for ingress and optimization options.
