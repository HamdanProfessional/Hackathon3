# LearnFlow Documentation

**AI-powered Python learning platform with autonomous deployment**

[![Status](https://img.shields.io/badge/status-production--ready-success)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-purple)]()

---

## Quick Navigation

###  Getting Started
- [Project Overview](#project-overview)
- [System Architecture](docs/architecture-complete.md)
- [Quick Start Guide](#quick-start)

###  Architecture
- [Complete Architecture Guide](docs/architecture-complete.md)

###  Development
- [Skills Catalog](docs/SKILLS_CATALOG.md)
- [Architecture Guide](docs/architecture-complete.md)

###  Deployment
- [Phase 3: Infrastructure](docs/phase-3-complete.md)
- [Phase 4: Backend Services](docs/phase-4-final-complete.md)
- [Skills Autonomy Demo](docs/skills-autonomy-demo.md)

---

## Project Overview

LearnFlow is an AI-powered Python learning platform built with cloud-native technologies. Students learn Python through conversational AI agents, interactive code exercises, and real-time feedback.

### Key Features

| Feature | Description |
|---------|-------------|
| **6 AI Agents** | Triage, Concepts, Debug, Exercise, Progress, Code Review |
| **Next.js 15 Frontend** | Monaco Editor, real-time chat, student/teacher dashboards |
| **4 MCP Servers** | 16 tools for Database, Kafka, K8s, Code Execution |
| **Event-Driven** | Dapr service mesh with Redpanda Kafka messaging |
| **Cloud-Native** | Kubernetes deployment with Docker containers |

### Technology Stack

```
Frontend:  Next.js 15.5 + TypeScript + Tailwind CSS (Nebula Space Theme)
Backend:   FastAPI + OpenAI SDK + Dapr 1.13
Database:  PostgreSQL (Neon or self-hosted)
Messaging: Redpanda (Kafka-compatible)
Orchestration: Kubernetes (Minikube/DOKS/GKE/AKS)
AI Context: MCP Servers (stdio transport)
CI/CD:     Argo CD + GitHub Actions (GitOps)
```

---

## Quick Start

### Prerequisites

- Docker
- Minikube (or any Kubernetes cluster)
- kubectl
- Helm
- Node.js 20+ (for frontend development)

### 5-Minute Deployment

```bash
# 1. Start Minikube
minikube start

# 2. Deploy PostgreSQL (via Skill or Helm)
helm install postgres bitnami/postgresql \
  --namespace postgres \
  --create-namespace \
  --set auth.password=learnflow123

# 3. Deploy Redpanda Kafka
helm repo add redpanda https://charts.redpanda.com
helm install redpanda redpanda/redpanda \
  --namespace redpanda-system \
  --create-namespace \
  --set statefulset.replicas=1

# 4. Deploy Backend Services
kubectl apply -f backend/k8s/local-services.yaml

# 5. Deploy Frontend
kubectl apply -f learnflow-app/frontend/k8s/deployment-local.yaml

# 6. Access the Application
minikube tunnel  # In another terminal
kubectl port-forward -n learnflow svc/learnflow-frontend 3000:80
# Open http://localhost:3000
```

### Verification

```bash
# Check all pods are running
kubectl get pods -A

# Expected output:
# postgres/postgres-postgresql-0        1/1 Running
# redpanda-system/redpanda-0            2/2 Running
# learnflow/learnflow-frontend          1/1 Running
# learnflow/triage-service              1/1 Running
# learnflow/concepts-service            1/1 Running
# learnflow/debug-service               1/1 Running
# learnflow/exercise-service            1/1 Running
# learnflow/progress-service            1/1 Running
# learnflow/code-review-service         1/1 Running
```

---

## System Architecture

### Multi-Agent System

```

                     Frontend (Next.js)                       
        
   Dashboard   Chat      Exercise   Teacher View    
        
                                                           
                     
                                                             

                        SSE / HTTP

                  API Gateway / Triage                         
              (Routes queries to agents)                       

                                            
    
Concepts  Debug  Exercise Progress Code Review
 Agent    Agent   Agent    Agent     Agent    
    
                                         
    
                     
    
             Dapr Sidecar            
      (Pub/Sub + State + Invoke)     
    
                     
    
             Kafka Topics            
      learning.* | code.* | exercise.*
    
```

### Component Overview

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 15, Monaco Editor | Student/Teacher UI |
| **Triage Service** | FastAPI | Routes queries to appropriate agent |
| **Concepts Agent** | FastAPI + OpenAI | Explains Python concepts |
| **Debug Agent** | FastAPI + OpenAI | Analyzes errors |
| **Exercise Agent** | FastAPI + OpenAI | Generates and grades exercises |
| **Progress Agent** | FastAPI | Tracks learning progress |
| **Code Review Agent** | FastAPI + OpenAI | Reviews code quality |
| **MCP Database Server** | FastMCP + asyncpg | Student progress queries |
| **MCP Kafka Server** | FastMCP + kafka-python | Event publishing/subscribing |
| **MCP K8s Server** | FastMCP + kubectl | Pod status and logs |
| **MCP Code Exec Server** | FastMCP | Sandboxed Python execution |

---

## Documentation Index

### Phase Completion Documents

| Phase | Document | Description |
|-------|----------|-------------|
| **Phase 3** | [Infrastructure Complete](docs/phase-3-complete.md) | Kafka and PostgreSQL deployment |
| **Phase 4** | [Backend Complete](docs/phase-4-final-complete.md) | All 6 microservices deployed |
| **Phase 4** | [Backend Continued](docs/phase-4-continued-summary.md) | Additional backend work |
| **Phase 4** | [Phase 4 Summary](docs/phase-4-complete.md) | Initial Phase 4 completion |

### Technical Documents

| Document | Topics Covered |
|----------|----------------|
| [Architecture Complete](docs/architecture-complete.md) | Full system architecture, microservices, event flows |
| [Skills Catalog](docs/SKILLS_CATALOG.md) | All available Skills for autonomous deployment |
| [Skills Autonomy Demo](docs/skills-autonomy-demo.md) | Practical demonstration |
| [Kafka Client](docs/kafka-client-complete.md) | Kafka Python client setup |
| [Kafka Redpanda Fix](docs/kafka-redpanda-fix-summary.md) | Redpanda deployment troubleshooting |

---

## Skills for Autonomous Deployment

LearnFlow includes reusable Skills for building cloud-native applications:

| Skill | Purpose |
|-------|---------|
| `postgres-k8s-setup` | Deploy PostgreSQL on Kubernetes |
| `kafka-k8s-setup` | Deploy Redpanda/Kafka on Kubernetes |
| `fastapi-dapr-agent` | Create FastAPI + Dapr microservices |
| `mcp-code-execution` | MCP with code execution pattern |
| `nextjs-k8s-deploy` | Deploy Next.js applications |
| `docusaurus-deploy` | Deploy documentation sites |
| `k8s-foundation` | Kubernetes namespace, ConfigMap, Secret operations |

All Skills use the **MCP Code Execution Pattern** for 80-98% token reduction.

---

## Frontend Design: Nebula Space Theme

The LearnFlow frontend features a custom **Nebula Space** theme with cosmic aesthetics:

### Theme Colors

```css
--nebula-background: #0f111a      /* Deep space dark */
--nebula-primary: #8b5cf6         /* Nebula violet */
--nebula-cosmic-purple: #8b5cf6
--nebula-cosmic-blue: #60a5fa
--nebula-cosmic-pink: #e879f9
--nebula-cosmic-cyan: #22d3ee
```

### Visual Effects

- **Starfield Background**: 3-layer animated stars with twinkle effect
- **Glass Morphism**: `.glass` cards with backdrop blur
- **Nebula Gradients**: Cosmic color gradients on hover
- **Glow Effects**: Box shadows with nebula colors
- **Animated Borders**: Pulsing borders on interactive elements

### Mastery Level Indicators

| Level | Range | Color | Label |
|-------|-------|-------|-------|
| Beginner | 0-40% | Red | "Getting Started" |
| Learning | 41-70% | Yellow | "Making Progress" |
| Proficient | 71-90% | Green | "Almost There" |
| Mastered | 91-100% | Blue | "Mastered!" |

---

## API Endpoints

| Service | Port | Endpoint | Purpose |
|---------|------|----------|---------|
| Triage | 8001 | `POST /` | Route query to appropriate agent |
| Concepts | 8002 | `POST /` | Explain Python concept |
| Debug | 8003 | `POST /` | Debug error |
| Exercise | 8004 | `POST /` | Generate/grade exercise |
| Progress | 8005 | `GET /progress/{student_id}` | Get student progress |
| Code Review | 8006 | `POST /` | Review code quality |

All services include:
- `/health` - Health check endpoint
- SSE streaming for real-time responses

---

## MCP Tools Reference

### Database MCP Server (5 tools)
- `get_student_progress_tool` - Get learning progress summary
- `get_code_submissions_tool` - Get recent code submissions
- `get_exercise_history_tool` - Get exercise attempt history
- `get_struggling_students_tool` - Get list of struggling students
- `update_progress_tool` - Update student progress

### Kafka MCP Server (4 tools)
- `publish_learning_event_tool` - Publish learning event
- `subscribe_to_events_tool` - Subscribe to event topics
- `get_event_history_tool` - Get event history
- `publish_struggle_alert_tool` - Publish struggle detection alert

### K8s MCP Server (5 tools)
- `get_pod_status_tool` - Get pod status
- `get_service_logs_tool` - Get service logs
- `check_service_health_tool` - Check service health
- `describe_pod_tool` - Describe pod details
- `get_kafka_topics_tool` - Get Kafka topics

### Code Execution MCP Server (2 tools)
- `execute_code_tool` - Execute Python code (sandboxed)
- `test_with_test_cases_tool` - Test code against test cases

**Total: 16 MCP tools across 4 servers**

---

## Deployment Status

| Component | Status | Namespace |
|-----------|--------|-----------|
| PostgreSQL |  Running | `postgres` |
| Redpanda (Kafka) |  Running | `redpanda-system` |
| Frontend |  Running | `learnflow` |
| Triage Service |  Running | `learnflow` |
| Concepts Service |  Running | `learnflow` |
| Debug Service |  Running | `learnflow` |
| Exercise Service |  Running | `learnflow` |
| Progress Service |  Running | `learnflow` |
| Code Review Service |  Running | `learnflow` |

---

## Contributing

LearnFlow follows the **Spec-Kit Plus** methodology:
1. Use `/sp.specify` to create feature specifications
2. Use `/sp.plan` to create implementation plans
3. Use `/sp.implement` to execute the plan

All development follows:
- TDD (Test-Driven Development)
- Git Conventional Commits
- MCP Code Execution Pattern for Skills
- Autonomous deployment via Skills

---

## License

MIT License - See LICENSE file for details

---

## Links

- [GitHub Repository](https://github.com/learnflow/learnflow)

---

**Last Updated**: 2026-01-26
**Version**: 1.0.0
**Status**:  Production Ready
