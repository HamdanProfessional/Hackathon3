# Phase 10: Continuous Deployment - Implementation Plan

**Phase**: 10
**Focus**: Implement GitOps-based continuous deployment using Argo CD and GitHub Actions
**Status**: Draft

---

## Overview

Implement a complete CI/CD pipeline for LearnFlow using:

- **GitHub Actions**: Continuous Integration (build, test, push images)
- **Argo CD**: Continuous Deployment (GitOps-based sync to cluster)
- **Helm Charts**: Templated Kubernetes deployments
- **Secret Management**: Secure credential handling

**Principle**: Git is the source of truth - all changes are deployed automatically when merged to main.

---

## Implementation Strategy

### CI/CD Pipeline Flow

```
Push Code → GitHub Actions (CI) → Build/Test/Push Image → Update Git
                                                          ↓
                                              Argo CD (CD) detects change
                                                          ↓
                                              Sync to Kubernetes cluster
                                                          ↓
                                              Health checks & monitoring
```

---

## Step-by-Step Implementation

### Step 1: GitHub Actions (CI)

**Create Workflow**:
```yaml
# .github/workflows/ci.yml
name: LearnFlow CI

on:
  push:
    branches: ['main', 'develop']
  pull_request:
    branches: ['main']

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker images
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Run tests
        run: |
          docker-compose -f docker-compose.test.yml up --abort-on-container-exit

      - name: Update Helm charts
        run: |
          yq e '.image.tag = "latest"' helm/learnflow/values.yaml > /tmp/values.yaml
          mv /tmp/values.yaml helm/learnflow/values.yaml

      - name: Commit changes
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git commit -am "chore: update Helm image tag [skip ci]"
          git push
```

---

### Step 2: Argo CD Installation

**Install Argo CD**:
```bash
# Create namespace
kubectl create namespace argocd

# Install Argo CD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access Argo CD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial password
argocd admin initial-password -n argocd
```

---

### Step 3: Application Manifest

**Create Argo CD Application**:
```yaml
# argocd/learnflow-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: learnflow
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/learnflow-app.git
    targetRevision: main
    path: helm/learnflow
  destination:
    server: https://kubernetes.default.svc
    namespace: learnflow
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

---

### Step 4: Helm Charts

**Create Chart Structure**:
```bash
helm/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-prod.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    └── hpa.yaml
```

**Chart.yaml**:
```yaml
apiVersion: v2
name: learnflow
description: LearnFlow Python Learning Platform
type: application
version: 1.0.0
appVersion: "1.0"
```

---

### Step 5: Secret Management

**Sealed Secrets**:
```bash
# Install Sealed Secrets
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Create sealed secret
kubectl create secret generic db-credentials \
  --from-literal=password=secret123 \
  --dry-run=client -o yaml | kubeseal -o yaml > sealed-secret.yaml

# Commit sealed secret (safe)
git add sealed-secret.yaml
git commit -m "Add sealed database credentials"
```

---

### Step 6: Progressive Delivery

**Blue-Green Deployment**:
```yaml
# argocd/learnflow-bluegreen.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: learnflow-bluegreen
spec:
  strategy:
    type: blueGreen
    blueGreen:
      activeService: learnflow-active
      previewService: learnflow-preview
      autoPromotionEnabled: false
      scaleDownDelaySeconds: 300
```

---

### Step 7: Monitoring Integration

**Prometheus ServiceMonitors**:
```yaml
# servicemonitor.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: learnflow
spec:
  selector:
    matchLabels:
      app: learnflow
  endpoints:
  - port: http
    path: /metrics
```

---

## Success Criteria Validation

- [ ] GitHub Actions workflow configured
- [ ] Argo CD deployed and syncing
- [ ] Helm charts created for all services
- [ ] Auto-deployment on git push working
- [ ] Rollback mechanism functional
- [ ] Secrets managed securely
- [ ] Monitoring and alerts configured

---

## Deliverables

1. **CI/CD Pipeline**
   - GitHub Actions workflow
   - Docker images built automatically
   - Tests run automatically

2. **GitOps Setup**
   - Argo CD applications
   - Auto-sync enabled
   - Rollback functional

3. **Helm Charts**
   - All services templated
   - Values for environments
   - Secrets managed

4. **Monitoring**
   - Prometheus configured
   - Alerting rules defined
   - Dashboard available

---

## Dependencies

**Required**:
- Phase 7 complete (app built)
- GitHub repository
- Kubernetes cluster

**Blocking**:
- Phase 7 must be complete
- Git repository required
