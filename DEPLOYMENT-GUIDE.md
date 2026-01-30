# LearnFlow Deployment Guide

## Quick Deployment

### Option 1: Docker Compose (Recommended for Local)

**Prerequisites:**
- Docker Desktop running (with 8GB RAM, 4 CPUs allocated)

**Steps:**

1. **Start Docker Desktop** (must be running first)

2. **Deploy all services:**
   ```bash
   cd learnflow-app
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Student Dashboard: http://localhost:3000/student/dashboard
   - Teacher Dashboard: http://localhost:3000/teacher/dashboard
   - API Gateway: http://localhost:8001
   - MCP Servers: http://localhost:9000-9003

4. **View logs:**
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

5. **Stop services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### Option 2: Kubernetes (Minikube)

**Prerequisites:**
- Minikube with Docker driver
- kubectl
- Helm v3+

**Steps:**

1. **Start Minikube:**
   ```bash
   minikube start --cpus=4 --memory=8192 --driver=docker
   ```

2. **Install dependencies:**
   ```bash
   # Install Kafka
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm install kafka bitnami/kafka --namespace kafka --create-namespace

   # Install PostgreSQL
   helm install postgres bitnami/postgresql --namespace postgres --create-namespace \
     --set auth.postgresPassword=learnflow-password \
     --set auth.database=learnflow
   ```

3. **Deploy LearnFlow:**
   ```bash
   helm install learnflow ./helm/learnflow \
     -f ./helm/learnflow/values-dev.yaml \
     --namespace learnflow \
     --create-namespace
   ```

4. **Access application:**
   ```bash
   # Port forward for frontend
   kubectl port-forward -n learnflow svc/learnflow-frontend 3000:3000

   # Open http://localhost:3000
   ```

## Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js web application |
| Triage Service | 8001 | Query routing |
| Concepts Service | 8002 | AI tutoring |
| Debug Service | 8003 | Debug hints |
| Exercise Service | 8004 | Code exercises |
| Progress Service | 8005 | Progress tracking |
| Code Review Service | 8006 | Code review |
| Chat Service | 8007 | Chat persistence |
| MCP Code Execution | 9000 | Python code execution |
| MCP Database | 9001 | Database access |
| MCP Kafka Events | 9002 | Event streaming |
| MCP K8s Operations | 9003 | K8s cluster operations |
| PostgreSQL | 5432 | Database |
| Kafka | 19092 | Event streaming |

## Troubleshooting

### Docker Issues

**Docker Desktop not running:**
- Start Docker Desktop from Windows Start menu
- Wait for "Docker Desktop is running" notification

**Port conflicts:**
```bash
# Check what's using the port
netstat -ano | findstr :3000

# Kill the process or change ports in docker-compose.dev.yml
```

**Container not starting:**
```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs <service-name>

# Restart specific service
docker-compose -f docker-compose.dev.yml restart <service-name>
```

### Kubernetes Issues

**Pods not ready:**
```bash
kubectl get pods -n learnflow
kubectl describe pod <pod-name> -n learnflow
kubectl logs <pod-name> -n learnflow
```

**Service not accessible:**
```bash
kubectl get svc -n learnflow
kubectl port-forward -n learnflow svc/<service-name> <local-port>:<service-port>
```

## Health Check

Verify all services are healthy:

```bash
# Backend services
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8004/health
curl http://localhost:8005/health
curl http://localhost:8006/health
curl http://localhost:8007/health

# MCP servers (test with POST)
curl -X POST http://localhost:9000/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "execute_code", "arguments": {"code": "print(\"test\")"}}'
```

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@learnflow.dev | password123 |
| Teacher | teacher@learnflow.dev | password123 |

---

**For more details**, see:
- [Documentation](../learnflow-docs/docs/index.md)
- [Quick Start](../learnflow-docs/docs/quickstart.md)
- [Architecture](../learnflow-docs/docs/architecture-overview.md)
