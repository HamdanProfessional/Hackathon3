# LearnFlow - Hackathon 3

<div align="center">

**AI-Powered Python Learning Platform**

[![Status](https://img.shields.io/badge/status-production--ready-success)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-purple)]()

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Skills](#-skills)

</div>

---

## 🌟 Overview

**LearnFlow** is an innovative educational platform that helps students learn Python programming through conversational AI agents, interactive code exercises, and real-time feedback.

This project demonstrates the **MCP Code Execution Pattern** for building cloud-native, event-driven microservices that can be deployed autonomously by AI agents.

### What Makes LearnFlow Unique

- 🤖 **6 AI Agents** - Specialized agents for Triage, Concepts, Debug, Exercise, Progress, and Code Review
- 🎨 **Nebula Space Theme** - Beautiful cosmic UI with starfield backgrounds and glass morphism
- 🔄 **Event-Driven** - Dapr service mesh with Redpanda Kafka messaging
- 📦 **Cloud-Native** - Kubernetes deployment with Docker containers
- 🛠️ **Skills-Based** - Reusable Skills enable autonomous deployment (80-98% token reduction)

---

## ✨ Features

### For Students

| Feature | Description |
|---------|-------------|
| **Interactive Dashboard** | Visual progress tracking with mastery indicators |
| **Monaco Editor** | Full-featured code editor with Python syntax highlighting |
| **AI Tutor Chat** | Real-time conversational AI for Python help |
| **Coding Exercises** | Adaptive challenges with hints and auto-grading |
| **Progressive Learning** | 6 modules from basics to advanced topics |

### For Teachers

| Feature | Description |
|---------|-------------|
| **Class Overview** | Total students, active users, average mastery |
| **Struggle Alerts** | Real-time notifications when students need help |
| **Live Monitoring** | Real-time updates via Server-Sent Events |
| **Exercise Generation** | Create custom exercises for students |

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required
- Docker
- Minikube (or any Kubernetes cluster)
- kubectl
- Helm

# Optional (for development)
- Node.js 20+
- Python 3.13+
```

### 5-Minute Deployment

```bash
# 1. Start Minikube
minikube start

# 2. Deploy PostgreSQL
helm install postgres bitnami/postgresql \
  --namespace postgres \
  --create-namespace \
  --set auth.password=learnflow123

# 3. Deploy Redpanda (Kafka)
helm repo add redpanda https://charts.redpanda.com
helm install redpanda redpanda/redpanda \
  --namespace redpanda-system \
  --create-namespace \
  --set statefulset.replicas=1

# 4. Deploy Backend Services (6 microservices)
kubectl apply -f backend/k8s/local-services.yaml

# 5. Deploy Frontend
kubectl apply -f learnflow-app/frontend/k8s/deployment-local.yaml

# 6. Access the application
kubectl port-forward -n learnflow svc/learnflow-frontend 3000:80
# Open http://localhost:3000
```

### Verification

```bash
kubectl get pods -A

# Expected: 9/9 pods Running
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

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 15)                      │
│  Nebula Space Theme | Monaco Editor | Real-time Chat        │
└──────────────────────┬───────────────────────────────────────┘
                       │ SSE / HTTP
┌──────────────────────▼───────────────────────────────────────┐
│                   Triage Service (FastAPI)                   │
│              Routes queries to appropriate agents            │
└───┬──────────┬──────────┬──────────┬──────────┬─────────────┘
    │          │          │          │          │
┌───▼────┐ ┌──▼─────┐ ┌──▼─────┐ ┌──▼──────┐ ┌──▼─────────┐
│Concepts│ │ Debug  │ │Exercise│ │Progress │ │Code Review │
│        │ │        │ │        │ │         │ │            │
│ Agent  │ │ Agent  │ │ Agent  │ │ Agent   │ │   Agent    │
└───┬────┘ └──┬─────┘ └──┬─────┘ └──┬──────┘ └──┬─────────┘
    │         │         │         │           │
    └─────────┴─────────┴─────────┴───────────┘
                      │
    ┌─────────────────┴─────────────────┐
    │        Dapr Sidecar               │
    │  (Pub/Sub + State + Service Inv.) │
    └─────────────────┬─────────────────┘
                      │
    ┌─────────────────┴─────────────────┐
    │         Kafka Topics              │
    │  learning.* | code.* | exercise.* │
    └────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, Monaco Editor, Zustand |
| **Backend** | FastAPI, OpenAI SDK, Dapr 1.13, SQLModel |
| **Database** | PostgreSQL (Neon or self-hosted) |
| **Messaging** | Redpanda (Kafka-compatible) |
| **Orchestration** | Kubernetes (Minikube/DOKS/GKE/AKS) |
| **AI Context** | MCP Servers (4 servers, 16 tools) |
| **CI/CD** | Argo CD + GitHub Actions (GitOps) |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📖 Full Documentation](./docs/index.md) | Complete documentation index |
| [🏗️ Architecture](./docs/architecture-complete.md) | System architecture and design |
| [🔧 MCP Integration](./docs/mcp-integration-complete.md) | MCP Servers and tools |
| [🎯 Skills Catalog](./docs/SKILLS_CATALOG.md) | Available deployment Skills |
| [✅ Phase 8 Summary](./PHASE_8_SUMMARY.md) | Demo preparation summary |
| [🤖 AGENTS.md](./AGENTS.md) | AI agent documentation |
| [📋 CLAUDE.md](./CLAUDE.md) | Project constitution |

---

## 🛠️ Skills for Autonomous Deployment

LearnFlow demonstrates the **MCP Code Execution Pattern** with reusable Skills:

| Skill | Purpose | Status |
|-------|---------|--------|
| `postgres-k8s-setup` | Deploy PostgreSQL on K8s | ✅ Working |
| `kafka-k8s-setup` | Deploy Redpanda/Kafka on K8s | ✅ Working |
| `fastapi-dapr-agent` | Create FastAPI + Dapr microservices | ✅ Working |
| `mcp-code-execution` | MCP with code execution pattern | ✅ Working |
| `nextjs-k8s-deploy` | Deploy Next.js applications | ✅ Working |
| `docusaurus-deploy` | Deploy documentation sites | ✅ Theme Ready |
| `k8s-foundation` | K8s namespace, ConfigMap, Secret | ✅ Working |

**Token Efficiency**: Skills achieve 80-98% token reduction by executing code instead of loading tool definitions.

---

## 🎨 Frontend: Nebula Space Theme

The LearnFlow frontend features a custom **Nebula Space** theme:

### Theme Colors

```css
Background:   #0f111a  /* Deep space dark */
Primary:      #8b5cf6  /* Nebula violet */
Cosmic Blue:  #60a5fa
Cosmic Pink:  #e879f9
Cosmic Cyan:  #22d3ee
```

### Visual Effects

- 🌟 **Starfield Background** - 3-layer animated stars
- 💎 **Glass Morphism** - Cards with backdrop blur
- 🌈 **Nebula Gradients** - Cosmic color gradients
- ✨ **Glow Effects** - Box shadows with nebula colors
- 💫 **Hover Animations** - Lift and pulse effects

### Components

- 16+ React components
- Monaco Editor integration
- Real-time SSE chat
- Teacher dashboard with live monitoring
- Student progress tracking

---

## 🔌 API Endpoints

| Service | Port | Endpoint | Purpose |
|---------|------|----------|---------|
| **Triage** | 8001 | `POST /` | Route query to appropriate agent |
| **Concepts** | 8002 | `POST /` | Explain Python concept |
| **Debug** | 8003 | `POST /` | Debug error |
| **Exercise** | 8004 | `POST /` | Generate/grade exercise |
| **Progress** | 8005 | `GET /progress/{id}` | Get student progress |
| **Code Review** | 8006 | `POST /` | Review code quality |

All services include:
- `POST /events/...` - Event subscriptions
- `GET /health` - Health check endpoint
- SSE streaming for real-time responses

---

## 🔧 Development

### Backend Development

```bash
cd backend/<service-name>
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### Frontend Development

```bash
cd learnflow-app/frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Running Tests

```bash
# Backend tests (pytest)
cd backend
pytest tests/

# Frontend tests (coming soon)
cd learnflow-app/frontend
npm test
```

---

## 📊 Project Status

### Completed Phases

| Phase | Status | Deliverables |
|-------|--------|--------------|
| **Phase 1** | ✅ Complete | Environment setup, repos created |
| **Phase 2** | ✅ Complete | Foundation Skills created and tested |
| **Phase 3** | ✅ Complete | Infrastructure (Kafka + PostgreSQL) |
| **Phase 4** | ✅ Complete | 6 Backend microservices |
| **Phase 5** | ✅ Complete | Next.js frontend with Nebula theme |
| **Phase 6** | ✅ Complete | 4 MCP Servers with 16 tools |
| **Phase 7** | ✅ Complete | Autonomous build demonstrated |
| **Phase 8** | ✅ Complete | Documentation and demo prep |

### Current System Status

```
✅ 9/9 Pods Running
✅ All 6 microservices operational
✅ Frontend deployed with Nebula theme
✅ Infrastructure (PostgreSQL + Redpanda) healthy
✅ Documentation complete
```

---

## 🤝 Contributing

LearnFlow follows the **Spec-Kit Plus** methodology:

1. **Specify**: Use `/sp.specify` to create feature specifications
2. **Plan**: Use `/sp.plan` to create implementation plans
3. **Implement**: Use `/sp.implement` to execute the plan

All development follows:
- TDD (Test-Driven Development)
- Git Conventional Commits
- MCP Code Execution Pattern for Skills
- Autonomous deployment via Skills

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🔗 Links

- **[Full Documentation](./docs/index.md)** - Complete documentation index
- **[Frontend README](./learnflow-app/frontend/README.md)** - Frontend-specific docs
- **[AGENTS.md](./AGENTS.md)** - AI agent documentation
- **[CLAUDE.md](./CLAUDE.md)** - Project constitution
- **[Requirements](./requirements.md)** - Hackathon 3 requirements

---

<div align="center">

**Built for [AAIF Hackathon 3](https://aaif.io)**

[![AAIF](https://img.shields.io/badge/AAIF-Hackathon%203-purple)]()

</div>
