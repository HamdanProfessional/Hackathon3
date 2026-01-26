---
title: Kubernetes Deployment
sidebar_position: 1
---

# Kubernetes Deployment Guide

Deploy LearnFlow to Kubernetes using Docker and Kubernetes manifests.

## Prerequisites

- Kubernetes cluster (Minikube, DOKS, GKE, AKS)
- kubectl CLI
- Docker installed

## Build Images

```bash
# Frontend
cd learnflow-app/frontend
docker build -t learnflow-frontend:latest .

# Backend
cd ../backend
docker build -f Dockerfile.services -t learnflow-backend:latest .
```

## Deploy

### Create Namespace

```bash
kubectl create namespace learnflow
```

### Deploy Services

```bash
# Backend
kubectl apply -f learnflow-app/backend/k8s/ -n learnflow

# Frontend
kubectl apply -f learnflow-app/frontend/k8s/ -n learnflow
```

### Verify

```bash
kubectl get pods -n learnflow
kubectl get svc -n learnflow
```

## Service URLs

| Service | Internal URL |
|---------|--------------|
| Frontend | `learnflow-frontend.learnflow.svc.cluster.local:80` |
| Triage | `triage-service.learnflow.svc.cluster.local:8001` |
| Concepts | `concepts-service.learnflow.svc.cluster.local:8002` |
| Debug | `debug-service.learnflow.svc.cluster.local:8003` |
| Exercise | `exercise-service.learnflow.svc.cluster.local:8004` |
| Progress | `progress-service.learnflow.svc.cluster.local:8005` |
| Code Review | `code-review-service.learnflow.svc.cluster.local:8006` |

## Scaling

```bash
# Scale service
kubectl scale deployment triage-service -n learnflow --replicas=3
```

## Troubleshooting

```bash
# Describe pod
kubectl describe pod -n learnflow <pod-name>

# View logs
kubectl logs -f -n learnflow deployment/triage-service

# Port forward
kubectl port-forward -n learnflow svc/learnflow-frontend 3000:80
```

## Cleanup

```bash
kubectl delete namespace learnflow
```
