---
title: Installation Guide
sidebar_position: 1
---

# Installation Guide

Complete setup instructions for LearnFlow on your local machine.

## Prerequisites

### Required Software

| Software | Version | Required For |
|----------|---------|--------------|
| **Node.js** | 18+ or 20+ | Frontend development |
| **npm** | 8+ or 9+ | Package manager |
| **Python** | 3.10+ | Backend services |
| **pip** | Latest | Python packages |

### Optional Software

| Software | Purpose |
|----------|---------|
| Docker | Containerization |
| Minikube | Local Kubernetes cluster |
| kubectl | Kubernetes CLI |
| Git | Version control |

## Clone Repository

```bash
# Clone the repository
git clone https://github.com/learnflow/learnflow.git
cd learnflow
```

## Frontend Setup

### Install Dependencies

```bash
cd learnflow-app/frontend
npm install
```

### Environment Configuration

Create `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
NEXT_PUBLIC_CONCEPTS_URL=http://localhost:8002
NEXT_PUBLIC_DEBUG_URL=http://localhost:8003
NEXT_PUBLIC_EXERCISE_URL=http://localhost:8004
NEXT_PUBLIC_PROGRESS_URL=http://localhost:8005
NEXT_PUBLIC_CODE_REVIEW_URL=http://localhost:8006
NEXT_PUBLIC_MCP_CODE_EXEC_URL=http://localhost:9000
NEXT_PUBLIC_MCP_DATABASE_URL=http://localhost:9001
```

### Build and Run

```bash
npm run build    # Build for production
npm run dev      # Development server
npm run start    # Production server
```

Access at: **http://localhost:3000**

## Backend Setup

### Install Dependencies

```bash
cd learnflow-app/backend

# Create virtual environment (recommended)
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/macOS)
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn[standard] pydantic python-dotenv httpx
```

### Start Services

```bash
# Terminal 1
python services/triage/main.py      # Port 8001

# Terminal 2
python services/concepts/main.py     # Port 8002

# Terminal 3
python services/debug/main.py        # Port 8003

# Terminal 4
python services/exercise/main.py     # Port 8004

# Terminal 5
python services/progress/main.py     # Port 8005

# Terminal 6
python services/code-review/main.py  # Port 8006
```

## MCP Servers

### Start MCP Code Execution Server

```bash
cd learnflow-app/backend/mcp-servers
python code-execution-mcp/http_server.py
```

Available at: **http://localhost:9000**

### Start MCP Database Server

```bash
python database-mcp/http_server.py
```

Available at: **http://localhost:9001**

## Documentation

```bash
cd docs-site
npm install
npm run serve
```

Documentation at: **http://localhost:3003**

## Troubleshooting

### Port Already in Use

**Windows:**
```cmd
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

**Linux/macOS:**
```bash
lsof -ti:8001 | xargs kill -9
```

### Module Not Found

```bash
# Activate virtual environment
source venv/bin/activate

# Reinstall dependencies
pip install fastapi uvicorn pydantic
```

## Next Steps

- [Quick Start Guide](./quickstart) - Your first exercise
- [API Reference](../api-reference) - API documentation
- [Architecture](../architecture-complete) - System architecture
