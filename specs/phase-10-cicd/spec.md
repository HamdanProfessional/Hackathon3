# Phase 10: Continuous Deployment Specification

**Status**: Draft
**Phase**: 10
**Focus:**

Implement GitOps-based continuous deployment using Argo CD and GitHub Actions for automated, reliable application updates.

---

## Overview

This phase implements a complete CI/CD pipeline for LearnFlow using:

- **GitHub Actions**: Continuous Integration (build, test, push images)
- **Argo CD**: Continuous Deployment (GitOps-based sync to cluster)
- **Helm Charts**: Templated Kubernetes deployments
- **Secret Management**: Secure credential handling

The principle is: **"Git is the source of truth"** - all changes are deployed automatically when merged to main branch.

---

## Success Criteria

- [ ] GitHub Actions workflow for CI configured
- [ ] Argo CD deployed and syncing
- [ ] Helm charts created for all services
- [ ] Auto-deployment on git push working
- [ ] Rollback mechanism functional
- [ ] Secrets managed securely
- [ ] Monitoring and alerts configured

---

## Architecture

### CI/CD Pipeline

```
┌────────────────────────────────────────────────────────────────────────┐
│                          DEVELOPER WORKFLOW                            │
│                                                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │
│  │  Push Code   │───▶│  Create PR   │───▶│   Review     │           │
│  │  to Feature  │    │   to Main    │    │   & Merge    │           │
│  │   Branch     │    │              │    │              │           │
│  └──────────────┘    └──────────────┘    └──────────────┘           │
│                                                   │                   │
└───────────────────────────────────────────────────┼───────────────────┘
                                                    │
                                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       CONTINUOUS INTEGRATION                           │
│                      (GitHub Actions)                                 │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Build      │  │    Test      │  │   Push       │              │
│  │   Docker     │──▶│   Services   │──▶│   Images     │              │
│  │   Images     │  │              │  │   to ACR/    │              │
│  │              │  │              │  │   Artifact   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                              │                        │
│                                              ▼                        │
│                                    ┌──────────────┐                  │
│                                    │   Update     │                  │
│                                    │   Helm       │                  │
│                                    │   Charts     │                  │
│                                    └──────────────┘                  │
└────────────────────────────────────────────────────────────────────────┘
                                                    │
                                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      CONTINUOUS DEPLOYMENT                             │
│                         (Argo CD)                                     │
│                                                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │
│  │  Watch Git   │───▶│   Detect     │───▶│    Sync      │           │
│  │  Repository  │    │   Changes    │    │   to K8s     │           │
│  └──────────────┘    └──────────────┘    └──────────────┘           │
│                                                  │                    │
│                                                  ▼                    │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                     KUBERNETES CLUSTER                        │    │
│  │                                                              │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │    │
│  │  │  Deploy  │  │  Health  │  │  Promote │  │  Rollback│    │    │
│  │  │  New Ver │  │  Check   │  │  Traffic │  │  on Fail│    │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │    │
│  └──────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## GitHub Actions (CI)

### Workflow Structure

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

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push Docker images
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          target: production

      - name: Run tests
        run: |
          docker-compose -f docker-compose.test.yml up --abort-on-container-exit

      - name: Update Helm charts
        run: |
          # Update image tags in Helm values
          yq e '.image.tag = "${{ steps.meta.outputs.tags[0] }}"' \
            helm/learnflow/values.yaml > /tmp/values.yaml
          mv /tmp/values.yaml helm/learnflow/values.yaml

      - name: Commit and push changes
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git commit -am "chore: update Helm image tag [skip ci]"
          git push
```

---

## Argo CD (CD)

### Installation

```bash
# Install Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access Argo CD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Initial admin password
argocd admin initial-password -n argocd
```

### Application Manifest

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
    helm:
      valueFiles:
      - values.yaml
      - values-prod.yaml

  destination:
    server: https://kubernetes.default.svc
    namespace: learnflow

  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - CreateNamespace=true
    - PrunePropagationPolicy=foreground
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### App of Apps Pattern

```yaml
# argocd/learnflow-root.yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: learnflow-root
  namespace: argocd
spec:
  generators:
  - list:
      elements:
      - name: infrastructure
      - name: backend
      - name: frontend
      - name: monitoring

  template:
    metadata:
      name: '{{name}}'
    finalizers:
    - resources-finalizer.argocd.argoproj.io
    spec:
      project: default
      source:
        repoURL: https://github.com/your-org/learnflow-app.git
        targetRevision: main
        path: 'helm/{{name}}'
      destination:
        server: https://kubernetes.default.svc
        namespace: '{{name}}'
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
```

---

## Helm Charts

### Chart Structure

```
helm/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-prod.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── configmap.yaml
    ├── secret.yaml
    └── hpa.yaml
```

### Chart.yaml

```yaml
apiVersion: v2
name: learnflow
description: LearnFlow Python Learning Platform
type: application
version: 1.0.0
appVersion: "1.0"

dependencies:
- name: postgresql
  version: 12.x.x
  repository: https://charts.bitnami.com/bitnami
  condition: postgresql.enabled
- name: kafka
  version: 29.x.x
  repository: https://charts.bitnami.com/bitnami
  condition: kafka.enabled
```

### Deployment Template

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "learnflow.fullname" . }}
  labels:
    {{- include "learnflow.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "learnflow.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
      labels:
        {{- include "learnflow.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: {{ .Values.service.port }}
          protocol: TCP
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: {{ include "learnflow.fullname" . }}
              key: database-url
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
```

### Horizontal Pod Autoscaler

```yaml
# templates/hpa.yaml
{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "learnflow.fullname" . }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "learnflow.fullname" . }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
  {{- if .Values.autoscaling.targetCPUUtilizationPercentage }}
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
  {{- end }}
  {{- if .Values.autoscaling.targetMemoryUtilizationPercentage }}
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: {{ .Values.autoscaling.targetMemoryUtilizationPercentage }}
  {{- end }}
{{- end }}
```

### Values Files

```yaml
# values.yaml
replicaCount: 2

image:
  repository: ghcr.io/your-org/learnflow-app
  pullPolicy: IfNotPresent
  tag: ""

imagePullSecrets: []

service:
  type: ClusterIP
  port: 3000

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
  - host: learnflow.example.com
    paths:
    - path: /
      pathType: Prefix
  tls:
  - secretName: learnflow-tls
    hosts:
    - learnflow.example.com

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

resources:
  limits:
    cpu: 1000m
    memory: 1024Mi
  requests:
    cpu: 100m
    memory: 256Mi

# External dependencies
postgresql:
  enabled: false  # Use managed service
  url: postgresql://external-server:5432/learnflow

kafka:
  enabled: false  # Use managed service
  brokers: external-kafka:9092
```

---

## Secret Management

### Sealed Secrets

```bash
# Install Sealed Secrets
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Create sealed secret
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password=secret123 \
  --dry-run=client \
  -o yaml | kubeseal -o yaml > sealed-secret.yaml

# Commit sealed secret (safe)
git add sealed-secret.yaml
git commit -m "Add sealed database credentials"
```

### External Secrets Operator

```yaml
# external-secret.yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: database-credentials
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: db-credentials
    creationPolicy: Owner
  data:
  - secretKey: username
    remoteRef:
      key: learnflow/database
      property: username
  - secretKey: password
    remoteRef:
      key: learnflow/database
      property: password
```

---

## Progressive Delivery

### Blue-Green Deployment

```yaml
# argocd/learnflow-bluegreen.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: learnflow-bluegreen
spec:
  source:
    repoURL: https://github.com/your-org/learnflow-app.git
    targetRevision: main
    path: helm/learnflow
  destination:
    server: https://kubernetes.default.svc
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
  strategy:
    type: blueGreen
    blueGreen:
      activeService: learnflow-active
      previewService: learnflow-preview
      autoPromotionEnabled: false
      scaleDownDelaySeconds: 300
```

### Canary Deployment with Argo Rollouts

```yaml
# rollouts.yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: learnflow
spec:
  replicas: 5
  strategy:
    canary:
      steps:
      - setWeight: 20
      - pause: {duration: 10m}
      - setWeight: 40
      - pause: {duration: 10m}
      - setWeight: 60
      - pause: {duration: 10m}
      - setWeight: 80
      - pause: {duration: 10m}
      analysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: learnflow
  revisionHistoryLimit: 2
  selector:
    matchLabels:
      app: learnflow
  template:
    metadata:
      labels:
        app: learnflow
    spec:
      containers:
      - name: learnflow
        image: ghcr.io/your-org/learnflow:latest
```

---

## Monitoring and Alerts

### Prometheus ServiceMonitors

```yaml
# servicemonitor.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: learnflow
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      app: learnflow
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

### Alerting Rules

```yaml
# alerting-rules.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: learnflow-alerts
spec:
  groups:
  - name: learnflow
    rules:
    - alert: HighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: High error rate detected
        description: Error rate is {{ $value | humanizePercentage }}

    - alert: PodNotReady
      expr: kube_pod_status_ready{namespace="learnflow"} == 0
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: Pod not ready
        description: Pod {{ $labels.pod }} not ready

    - alert: DeploymentRollback
      expr: argocd_app_health_status{status="Degraded"} == 1
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: Deployment failed, rolling back
```

---

## Validation

### CI/CD Pipeline Test

```bash
# 1. Create feature branch
git checkout -b feature/test-cicd

# 2. Make a change
echo "# Test" >> README.md

# 3. Commit and push
git commit -am "test: CI/CD pipeline"
git push origin feature/test-cicd

# 4. Create PR
gh pr create --title "Test CI/CD" --body "Testing automated pipeline"

# 5. Verify:
# - GitHub Actions builds image
# - Tests run
# - Helm chart updated
# - Argo CD detects change
# - Application syncs
```

### Rollback Test

```bash
# 1. Check current version
argocd app get learnflow

# 2. Rollback to previous version
argocd app rollback learnflow --revision 2

# 3. Verify rollback
kubectl get pods -n learnflow
kubectl rollout status deployment/learnflow -n learnflow
```

---

## Deliverables

1. **CI/CD Pipeline**
   - GitHub Actions workflow configured
   - Docker images automatically built
   - Tests automatically run
   - Helm charts updated

2. **GitOps Setup**
   - Argo CD deployed
   - Applications configured
   - Auto-sync enabled
   - Rollback functional

3. **Helm Charts**
   - All services templated
   - Values files for environments
   - Secrets managed securely

4. **Monitoring**
   - Prometheus configured
   - Alerting rules defined
   - Dashboard available

---

## Summary

With Phase 10 complete, the LearnFlow application now has:

✅ **Automated CI**: GitHub Actions builds and tests on every commit
✅ **Automated CD**: Argo CD deploys changes automatically
✅ **GitOps**: Git is the single source of truth
✅ **Rollback**: Easy rollback if issues arise
✅ **Progressive Delivery**: Canary/blue-green deployments
✅ **Monitoring**: Alerts for failures and degraded service
✅ **Scalability**: Horizontal Pod Autoscaling enabled

This completes all 10 phases of the LearnFlow Hackathon 3 project!

---

## Project Completion Checklist

- [ ] All 7 required Skills working
- [ ] Bonus Skills created (optional)
- [ ] LearnFlow application built autonomously
- [ ] Tested with Claude Code
- [ ] Tested with Goose
- [ ] Token efficiency validated
- [ ] Documentation complete
- [ ] Demo video recorded
- [ ] Submitted via Google Form
- [ ] (Optional) Cloud deployed
- [ ] (Optional) CI/CD configured

**Congratulations on completing Hackathon 3!** 🎉
