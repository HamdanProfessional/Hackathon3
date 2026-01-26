# CI/CD Pipeline Documentation

This document describes the continuous integration and deployment pipeline for LearnFlow.

## Table of Contents

- [Overview](#overview)
- [Pipeline Architecture](#pipeline-architecture)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

LearnFlow uses GitHub Actions for CI/CD with the following stages:

1. **Lint** - Code quality checks
2. **Type Check** - Static type validation
3. **Test** - Unit and integration tests
4. **Build** - Docker image creation
5. **Security Scan** - Vulnerability scanning
6. **Deploy** - Kubernetes deployment (when available)

### Container Registry

- **Registry**: GitHub Container Registry (ghcr.io)
- **Images**:
  - `ghcr.io/your-org/learnflow-frontend`
  - `ghcr.io/your-org/learnflow-backend`
  - `ghcr.io/your-org/mcp-code-exec`
  - `ghcr.io/your-org/mcp-database`

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub CI/CD Flow                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Push/PR → GitHub Actions → Tests → Build → Push Image       │
│             ↓                                               │
│         CI Pipeline                                         │
│         - lint                                               │
│         - type-check                                         │
│         - test                                               │
│         - build                                              │
│                                                               │
│  Main Branch → Deploy Pipeline (local/hybrid)                │
│             ↓                                               │
│         Local Testing                                        │
│         - Minikube/Kind                                      │
│         - Docker Compose                                     │
│                                                               │
│  Future: Argo CD for cloud GitOps                            │
└─────────────────────────────────────────────────────────────┘
```

## GitHub Actions Workflows

### 1. Backend CI

**File**: `.github/workflows/ci-backend.yml`

Triggers on changes to:
- `learnflow-app/backend/**`
- `.github/workflows/ci-backend.yml`

**Stages**:

```yaml
# 1. Lint with Ruff
- Run ruff check

# 2. Type Check with MyPy
- Run mypy type checker

# 3. Test with Pytest
- Install dependencies
- Run tests with coverage
- Upload coverage to Codecov

# 4. Build and Push
- Build Docker image
- Push to GHCR with git SHA tags
```

**Example Tags**:
- `ghcr.io/org/learnflow-backend:main`
- `ghcr.io/org/learnflow-backend:main-abc1234`
- `ghcr.io/org/learnflow-backend:latest`

### 2. Frontend CI

**File**: `.github/workflows/ci-frontend.yml`

Triggers on changes to:
- `learnflow-app/frontend/**`
- `.github/workflows/ci-frontend.yml`

**Stages**:

```yaml
# 1. Lint with ESLint
- Run npm run lint

# 2. Type Check
- Run TypeScript compiler

# 3. Test with Vitest
- Run tests with coverage
- Upload coverage to Codecov

# 4. Build Next.js
- Run npm run build
- Upload build artifacts

# 5. Build and Push
- Build Docker image
- Push to GHCR with git SHA tags
```

### 3. MCP Servers CI

**File**: `.github/workflows/ci-mcp-servers.yml`

Triggers on changes to:
- `learnflow-app/backend/mcp-servers/**`
- `.github/workflows/ci-mcp-servers.yml`

**Stages**:

```yaml
# 1. Validate MCP server structure
- Check for main.py in each server
- Validate configuration

# 2. Build and push MCP servers
- Database MCP
- Code Execution MCP
```

### 4. Combined CI

**File**: `.github/workflows/ci-combined.yml`

Runs all CI workflows together for comprehensive testing.

### 5. Security Scanning

**File**: `.github/workflows/security-scan.yml`

Runs:
- **Trivy** - Container vulnerability scanning
- **Snyk** - Dependency scanning
- **TruffleHog** - Secret scanning
- **CodeQL** - Code security analysis

## Local Development

### Prerequisites

```bash
# Install tools
# - Docker & Docker Compose
# - kubectl
# - Helm
# - Python 3.11+
# - Node.js 20+
```

### Using Docker Compose

```bash
# Start all services
cd learnflow-app
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes
docker-compose -f docker-compose.dev.yml down -v
```

**Services**:
- Frontend: http://localhost:3000
- Triage: http://localhost:8001
- Concepts: http://localhost:8002
- Debug: http://localhost:8003
- Exercise: http://localhost:8004
- Progress: http://localhost:8005
- Code Review: http://localhost:8006
- MCP Code Exec: http://localhost:9000
- MCP Database: http://localhost:9001
- PostgreSQL: localhost:5432
- Kafka: localhost:19092

### Using Kubernetes

```bash
# Create local cluster (using Kind)
kind create cluster --name learnflow

# Or using Minikube
minikube start --driver=docker

# Install with Helm
cd learnflow-app
helm install learnflow ./helm/learnflow \
  -f ./helm/learnflow/values-dev.yaml \
  --namespace learnflow \
  --create-namespace

# Get services
kubectl get svc -n learnflow

# Port forward to access locally
kubectl port-forward -n learnflow svc/learnflow-frontend 3000:3000
```

### Running Tests Locally

```bash
# Backend tests
cd backend
pytest
pytest --cov=. --cov-report=html

# Frontend tests
cd frontend
npm test
npm run test:coverage
```

## Deployment

### Manual Image Push

```bash
# Build and push backend image
cd learnflow-app/backend
docker build -t ghcr.io/your-org/learnflow-backend:manual .
docker push ghcr.io/your-org/learnflow-backend:manual

# Build and push frontend image
cd learnflow-app/frontend
docker build -t ghcr.io/your-org/learnflow-frontend:manual .
docker push ghcr.io/your-org/learnflow-frontend:manual
```

### Helm Deployment

```bash
# Update values with your registry
export REGISTRY=ghcr.io/your-org

# Install/upgrade release
helm upgrade --install learnflow ./helm/learnflow \
  -f ./helm/learnflow/values-prod.yaml \
  --namespace learnflow \
  --create-namespace \
  --set global.imageRegistry=$REGISTRY

# Check status
helm status learnflow -n learnflow

# View logs
kubectl logs -n learnflow -l app.kubernetes.io/name=learnflow
```

### Argo CD (Future)

Once cloud access is available:

```yaml
# Application manifest for Argo CD
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: learnflow
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/learnflow.git
    targetRevision: main
    path: learnflow-app/helm/learnflow
    helm:
      valueFiles:
        - values-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: learnflow
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## Quality Gates

### Branch Protection Rules

Configure in GitHub repository settings:

```yaml
# Required status checks
- ci-backend (lint)
- ci-backend (test)
- ci-frontend (lint)
- ci-frontend (test)
- security-scan
- codeql

# Required reviewers
- 1 approval required

# Restrictions
- Require PR before merging
- Require branches to be up to date

# Other rules
- Do not allow bypassing the above settings
```

### Code Coverage Thresholds

- **Backend**: 70% minimum
- **Frontend**: 65% minimum
- **Failure**: Build fails if coverage drops below threshold

## Troubleshooting

### Pipeline Failures

**Lint Failures**
```bash
# Fix backend lint issues
cd backend
ruff check --fix .

# Fix frontend lint issues
cd frontend
npm run lint -- --fix
```

**Test Failures**
```bash
# Run tests locally with verbose output
cd backend
pytest -v

# Frontend
cd frontend
npm test -- --verbose
```

**Build Failures**
```bash
# Build locally to debug
docker build -t test ./learnflow-app/backend
docker build -t test ./learnflow-app/frontend
```

### Docker Issues

**Image Pull Errors**
```bash
# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Verify image exists
docker search ghcr.io/your-org/learnflow
```

**Container Not Starting**
```bash
# Check logs
docker logs <container-id>

# Check health status
docker ps

# Inspect container
docker inspect <container-id>
```

### Kubernetes Issues

**Pod Not Ready**
```bash
# Check pod status
kubectl get pods -n learnflow

# Describe pod
kubectl describe pod <pod-name> -n learnflow

# View logs
kubectl logs <pod-name> -n learnflow
```

**Service Not Accessible**
```bash
# Check services
kubectl get svc -n learnflow

# Check endpoints
kubectl get endpoints -n learnflow

# Port forward
kubectl port-forward -n learnflow svc/<service-name> 8080:80
```

### Helm Issues

**Release Fails**
```bash
# Debug helm install
helm install learnflow ./helm/learnflow --dry-run --debug

# Validate chart
helm lint ./helm/learnflow

# Template rendering
helm template learnflow ./helm/learnflow
```

**Upgrade Fails**
```bash
# Check history
helm history learnflow -n learnflow

# Rollback
helm rollback learnflow -n learnflow

# Force upgrade
helm upgrade learnflow ./helm/learnflow \
  --namespace learnflow \
  --force \
  --recreate-pods
```

## Monitoring

### CI/CD Metrics

Track these metrics in GitHub Actions:
- Pipeline success rate
- Average build time
- Test coverage trends
- Deployment frequency
- Lead time for changes

### Alerts

Configure alerts for:
- Pipeline failures
- Security vulnerabilities
- Deployment rollbacks
- High failure rates

---

For more information, see:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Helm Documentation](https://helm.sh/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
