---
slug: /quickstart
title: Quick Start
sidebar_position: 2
---

# Quick Start Guide

Get LearnFlow running locally in under 10 minutes.

## Prerequisites

- Docker Desktop (with 8GB RAM, 4 CPUs allocated)
- kubectl
- Helm v3+
- Python 3.10+ (for local development)
- Node.js 18+ (for frontend development)

## Option 1: Docker Compose (Recommended for Learning)

### 1. Clone Repository

```bash
git clone https://github.com/your-org/learnflow-app.git
cd learnflow-app
```

### 2. Start All Services

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This starts:
- Frontend on http://localhost:3000
- 7 Backend Services (ports 8001-8007)
- 4 MCP Servers (ports 9000-9003)
- PostgreSQL and Kafka

### 3. Verify Deployment

```bash
# Check all services are running
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### 4. Access the Application

Open your browser to:
- **Student Portal**: http://localhost:3000/student/login
- **Teacher Dashboard**: http://localhost:3000/teacher/dashboard

Default credentials:
- Student: `student@learnflow.dev` / `password123`
- Teacher: `teacher@learnflow.dev` / `password123`

## Option 2: Kubernetes (Minikube/Kind)

### 1. Start Local Cluster

```bash
# Using Minikube
minikube start --cpus=4 --memory=8192

# OR using Kind
kind create cluster --name learnflow
```

### 2. Install Dependencies

```bash
# Install Kafka via Helm
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install kafka bitnami/kafka \
  --namespace kafka \
  --create-namespace \
  --set zookeeper.enabled=true

# Install PostgreSQL via Helm
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install postgres bitnami/postgresql \
  --namespace postgres \
  --create-namespace \
  --set auth.postgresPassword=learnflow-password \
  --set auth.database=learnflow
```

### 3. Deploy LearnFlow

```bash
helm install learnflow ./helm/learnflow \
  -f ./helm/learnflow/values-dev.yaml \
  --namespace learnflow \
  --create-namespace
```

### 4. Access Application

```bash
# Port forward to access frontend
kubectl port-forward -n learnflow svc/learnflow-frontend 3000:3000

# Open http://localhost:3000
```

## Local Development

### Backend Development

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest

# Run specific service
uvicorn services.triage.main:app --reload --port 8001

# Run all services (using concurrently)
pip install concurrently
concurrently \
  "uvicorn services.triage.main:app --port 8001" \
  "uvicorn services.concepts.main:app --port 8002" \
  "uvicorn services.debug.main:app --port 8003" \
  "uvicorn services.exercise.main:app --port 8004" \
  "uvicorn services.progress.main:app --port 8005" \
  "uvicorn services.code_review.main:app --port 8006" \
  "uvicorn services.chat.main:app --port 8007"
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### MCP Servers Development

```bash
cd backend/mcp-servers

# Run Database MCP
cd database-mcp
python main.py

# Run Code Execution MCP
cd code-execution-mcp
python main.py

# Run Kafka Events MCP (NEW)
cd kafka-events-mcp
python main.py

# Run K8s Operations MCP (NEW)
cd k8s-operations-mcp
python main.py
```

## Verify Installation

### 1. Check Backend Health

```bash
# All services should return healthy
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8004/health
curl http://localhost:8005/health
curl http://localhost:8006/health
curl http://localhost:8007/health
```

### 2. Check MCP Servers

```bash
# Test code execution
curl -X POST http://localhost:9000/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "execute_code", "arguments": {"code": "print(\"Hello from LearnFlow!\")"}}'

# Test database access
curl -X POST http://localhost:9001/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "get_exercises", "arguments": {}}'
```

### 3. Check Frontend

Open http://localhost:3000 and verify:
- Landing page loads
- Student dashboard is accessible
- Teacher dashboard is accessible
- Chat interface loads

## Common Issues

### Docker Issues

**Problem**: Services fail to start
```bash
# Check Docker logs
docker-compose -f docker-compose.dev.yml logs

# Recreate containers
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Port Conflicts

**Problem**: Ports already in use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8001

# Kill the process or change ports in docker-compose.dev.yml
```

### Memory Issues

**Problem**: Minikube runs out of memory
```bash
# Increase memory allocation
minikube start --cpus=4 --memory=8192
```

### Kubernetes Issues

**Problem**: Pods not starting
```bash
# Check pod status
kubectl get pods -n learnflow

# Describe pod for details
kubectl describe pod <pod-name> -n learnflow

# Check logs
kubectl logs <pod-name> -n learnflow
```

## Next Steps

- [Explore the Curriculum](/modules)
- [Read the Architecture Overview](/architecture-overview)
- [Review API Documentation](/backend-api)
- [Set up Development Environment](/local-setup)

## Getting Help

- 📖 [Documentation Index](/)
- 🐛 [Report Issues](https://github.com/your-org/learnflow/issues)
- 💬 [Discussions](https://github.com/your-org/learnflow/discussions)

---

**Ready to learn Python?** → [Start Learning](/modules) 🚀
