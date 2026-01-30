---
slug: /kubernetes-setup
title: Kubernetes Deployment Guide
sidebar_position: 11
---

# Kubernetes Deployment Guide

Deploy LearnFlow on Kubernetes for production or scaling.

---

## Prerequisites

### Tools Required

| Tool | Version | Purpose |
|------|---------|---------|
| **kubectl** | 1.28+ | Cluster management |
| **helm** | 3.12+ | Package management |
| **Cluster** | Any | Minikube, Kind, DOKS, GKE, AKS, EKS |

### Cluster Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| **Nodes** | 2 | 3+ |
| **RAM per node** | 4 GB | 8 GB |
| **CPU per node** | 2 cores | 4 cores |
| **Total storage** | 50 GB | 100 GB |

---

## Quick Start with Minikube

### 1. Start Minikube

```bash
minikube start \
  --cpus=4 \
  --memory=8192 \
  --disk-size=50g \
  --driver=docker
```

### 2. Enable Ingress

```bash
minikube addons enable ingress
```

### 3. Deploy LearnFlow

```bash
# From repository root
cd learnflow-app

# Create namespace
kubectl create namespace learnflow

# Deploy using Helm
helm install learnflow ./helm/learnflow \
  -f helm/learnflow/values-dev.yaml \
  --namespace learnflow
```

### 4. Access Application

```bash
# Get ingress URL
minikube tunnel

# Open application
open http://learnflow.local
```

---

## Production Deployment

### 1. Configure Cloud Provider

#### DigitalOcean Kubernetes (DOKS)

```bash
# Create cluster via doctl
doctl kubernetes cluster create learnflow \
  --region nyc1 \
  --version 1.28.0 \
  --node-pool "name=learnflow-pool;count=3;size=s-4vcpu-8gb"

# Get kubeconfig
doctl kubernetes cluster kubeconfig save learnflow

# Verify
kubectl get nodes
```

#### Google GKE

```bash
# Create cluster
gcloud container clusters create learnflow \
  --region=us-central1 \
  --num-nodes=3 \
  --machine-type=e2-standard-4 \
  --cluster-version=1.28.0

# Get credentials
gcloud container clusters get-credentials learnflow \
  --region=us-central1
```

#### AWS EKS

```bash
# Create cluster via eksctl
eksctl create cluster \
  --name learnflow \
  --region us-east-1 \
  --nodes 3 \
  --node-type t3.xlarge \
  --version 1.28.0
```

### 2. Install Dependencies

```bash
# Add Bitnami Helm repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install Kafka
helm install kafka bitnami/kafka \
  --namespace kafka \
  --create-namespace \
  --set replicaCount=3 \
  --set zookeeper.replicaCount=3 \
  --set persistence.enabled=true

# Install PostgreSQL
helm install postgres bitnami/postgresql \
  --namespace postgres \
  --create-namespace \
  --set auth.postgresPassword=changeme \
  --set auth.database=learnflow \
  --set primary.persistence.enabled=true
```

### 3. Configure Secrets

```bash
# Create secrets
kubectl create secret generic learnflow-secrets \
  --namespace learnflow \
  --from-literal=openai-api-key=your-key \
  --from-literal=jwt-secret=your-secret \
  --from-literal=postgres-password=your-password

# Create Dapr secrets
kubectl create secret generic learnflow-api-secret \
  --namespace learnflow \
  --from-literal=openai-api-key=your-key
```

### 4. Deploy LearnFlow

```bash
# Create namespace
kubectl create namespace learnflow

# Install Dapr
dapr init -k
dapr dashboard -n learnflow &

# Deploy LearnFlow
helm install learnflow ./helm/learnflow \
  -f helm/learnflow/values-prod.yaml \
  --namespace learnflow

# Wait for rollout
kubectl rollout status deployment/learnflow-frontend -n learnflow
```

### 5. Configure Ingress

```bash
# Create ingress
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: learnflow-ingress
  namespace: learnflow
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - learnflow.yourdomain.com
    secretName: learnflow-tls
  rules:
  - host: learnflow.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: learnflow-frontend
            port:
              number: 3000
EOF
```

---

## Helm Configuration

### values-dev.yaml

```yaml
# Development values
replicaCount: 1

image:
  tag: "dev"
  pullPolicy: IfNotPresent

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: false

ingress:
  enabled: false
```

### values-prod.yaml

```yaml
# Production values
replicaCount: 3

image:
  tag: "latest"
  pullPolicy: Always

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: learnflow.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: learnflow-tls
      hosts:
        - learnflow.yourdomain.com
```

---

## Dapr Configuration

### Dapr Components

```bash
# Apply Dapr components
kubectl apply -f k8s/dapr-components/ -n learnflow
```

#### Pub/Sub Component (kafka-pubsub.yaml)

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: learnflow-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: kafka.kafka.svc.cluster.local:9092
  - name: consumerGroup
    value: learnflow-group
  - name: authRequired
    value: "false"
```

#### State Store Component (redis-statestore.yaml)

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: learnflow-statestore
spec:
  type: state.redis
  version: v1
  metadata:
  - name: redisHost
    value: redis-master.redis.svc.cluster.local:6379
  - name: redisPassword
    secretKeyRef:
      name: redis-secret
      key: redis-password
```

#### Secret Store Component (kubernetes-secretstore.yaml)

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: learnflow-secretstore
spec:
  type: secretstores.kubernetes
  version: v1
  metadata:
  - name: kubeconfig
    value: /path/to/kubeconfig
```

---

## Scaling

### Horizontal Pod Autoscaler

```bash
# View HPA status
kubectl get hpa -n learnflow

# Manual scaling
kubectl scale deployment/learnflow-concepts-service \
  --replicas=5 -n learnflow

# Edit HPA
kubectl edit hpa learnflow-concepts-service -n learnflow
```

### Vertical Scaling

```yaml
# In values.yaml
resources:
  limits:
    cpu: 2000m
    memory: 2Gi
  requests:
    cpu: 1000m
    memory: 1Gi
```

---

## Monitoring

### Install Prometheus

```bash
# Add Prometheus repo
helm repo add prometheus-community \
  https://prometheus-community.github.io/helm-charts

# Install
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

### Install Grafana

```bash
# Grafana comes with kube-prometheus-stack

# Access dashboard
kubectl port-forward -n monitoring \
  svc/prometheus-grafana 3000:80

# Default credentials: admin / prom-operator
```

### View Metrics

```bash
# Service metrics
kubectl port-forward -n learnflow \
  svc/learnflow-concepts-service 8002:8002

curl http://localhost:8002/metrics
```

---

## Logging

### EFK Stack (Elasticsearch, Fluentd, Kibana)

```bash
# Install EFK
helm install elasticsearch bitnami/elasticsearch \
  --namespace logging \
  --create-namespace

helm install fluentd bitnami/fluentd \
  --namespace logging

helm install kibana bitnami/kibana \
  --namespace logging
```

### View Logs

```bash
# All logs
kubectl logs -f -n learnflow deployment/learnflow-concepts-service

# Multiple pods
kubectl logs -f -n learnflow -l app=concepts-service

# Previous container
kubectl logs -p -n learnflow deployment/learnflow-concepts-service
```

---

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n learnflow

# Describe pod
kubectl describe pod <pod-name> -n learnflow

# Check events
kubectl get events -n learnflow --sort-by='.lastTimestamp'
```

### CrashLoopBackOff

```bash
# View logs
kubectl logs <pod-name> -n learnflow

# Check resources
kubectl describe pod <pod-name> -n learnflow | grep -A 5 "Limits"

# Check secrets
kubectl get secrets -n learnflow
```

### Image Pull Errors

```bash
# Create registry secret
kubectl create secret docker-registry regcred \
  --namespace learnflow \
  --docker-server=ghcr.io \
  --docker-username=<username> \
  --docker-password=<token>

# Patch deployment
kubectl patch deployment <deployment> \
  -n learnflow \
  -p '{"spec":{"template":{"spec":{"imagePullSecrets":[{"name":"regcred"}]}}}}'
```

---

## Maintenance

### Upgrading

```bash
# Upgrade Helm release
helm upgrade learnflow ./helm/learnflow \
  -f helm/learnflow/values-prod.yaml \
  --namespace learnflow

# Rollback if needed
helm rollback learnflow -n learnflow
```

### Backup

```bash
# Backup PostgreSQL
kubectl exec -n postgres postgres-0 \
  -- pg_dump -U learnflow learnflow > backup.sql

# Backup secrets
kubectl get secrets -n learnflow -o yaml > secrets-backup.yaml
```

### Cleanup

```bash
# Delete LearnFlow
helm uninstall learnflow -n learnflow

# Delete namespace
kubectl delete namespace learnflow

# Delete dependencies
helm uninstall kafka -n kafka
helm uninstall postgres -n postgres
```

---

## Next Steps

- [Local Setup](/local-setup) - Development environment
- [Demo Guide](/demo-guide) - Test deployment
- [Backend API](/backend-api) - API documentation

---

**Deploying to production?** Review production checklist first.
