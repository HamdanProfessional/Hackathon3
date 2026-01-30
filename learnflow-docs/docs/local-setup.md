---
slug: /local-setup
title: Local Development Setup
sidebar_position: 10
---

# Local Development Setup

Complete guide for setting up LearnFlow for local development and testing.

---

## System Requirements

### Minimum Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 8 GB | 16 GB |
| **CPU** | 4 cores | 8 cores |
| **Disk** | 20 GB free | 50 GB free |
| **Docker** | 20.10+ | Latest |
| **Python** | 3.10+ | 3.11 |
| **Node.js** | 18+ | 20 LTS |

### Software Needed

- **Docker Desktop** (for containerization)
- **Git** (for version control)
- **Python 3.11** (for backend development)
- **Node.js 20** (for frontend development)
- **kubectl** (for Kubernetes deployment)
- **Helm 3** (for Kubernetes charts)

---

## Repository Structure

```
learnflow-app/
├── backend/                # Backend services
│   ├── services/          # 7 microservices
│   │   ├── triage/        # Chat routing (port 8001)
│   │   ├── concepts/      # Concept explanations (8002)
│   │   ├── debug/         # Debugging hints (8003)
│   │   ├── exercise/      # Exercise management (8004)
│   │   ├── progress/      # Progress tracking (8005)
│   │   ├── code_review/   # Code quality (8006)
│   │   └── chat/          # Chat service (8007)
│   ├── mcp-servers/       # MCP servers
│   │   ├── database-mcp/          # (port 9001)
│   │   ├── code-execution-mcp/    # (port 9000)
│   │   ├── kafka-events-mcp/      # (port 9002)
│   │   └── k8s-operations-mcp/    # (port 9003)
│   ├── shared/            # Shared utilities
│   │   ├── models.py      # Pydantic models
│   │   └── dapr_client.py # Dapr wrapper
│   └── requirements.txt   # Python dependencies
├── frontend/              # Next.js frontend
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   └── lib/              # Utilities
├── k8s/                   # Kubernetes manifests
├── helm/                  # Helm charts
└── docker-compose.dev.yml # Dev environment
```

---

## Docker Compose Setup (Recommended)

### 1. Clone and Navigate

```bash
git clone https://github.com/your-org/learnflow-app.git
cd learnflow-app
```

### 2. Configure Environment

Create `.env` file:

```bash
# Database
POSTGRES_USER=learnflow
POSTGRES_PASSWORD=learnflow-dev-password
POSTGRES_DB=learnflow

# OpenAI (for AI tutor)
OPENAI_API_KEY=your-openai-api-key-here

# JWT Secret
JWT_SECRET=your-jwt-secret-here

# Dapr
DAPR_HTTP_PORT=3500
DAPR_GRPC_PORT=50001
```

### 3. Start Services

```bash
# Start all services (detached mode)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Check status
docker-compose -f docker-compose.dev.yml ps
```

### 4. Initialize Database

```bash
# Run database migrations
docker-compose -f docker-compose.dev.yml exec \
  postgres psql -U learnflow -d learnflow \
  -c "CREATE TABLE IF NOT EXISTS students (...);"

# Or restart backend services to auto-seed
docker-compose -f docker-compose.dev.yml restart \
  triage-service concepts-service exercise-service progress-service
```

### 5. Verify Deployment

```bash
# Test backend services
curl http://localhost:8001/health  # Triage
curl http://localhost:8002/health  # Concepts
curl http://localhost:8003/health  # Debug
curl http://localhost:8004/health  # Exercise
curl http://localhost:8005/health  # Progress
curl http://localhost:8006/health  # Code Review
curl http://localhost:8007/health  # Chat

# Test MCP servers
curl http://localhost:9000/health  # Code Execution MCP
curl http://localhost:9001/health  # Database MCP
curl http://localhost:9002/health  # Kafka Events MCP
curl http://localhost:9003/health  # K8s Operations MCP

# Access frontend
open http://localhost:3000
```

---

## Local Backend Development

### Setup Python Environment

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install dev dependencies
pip install pytest pytest-asyncio black ruff mypy
```

### Run Individual Services

```bash
# Triage service
cd services/triage
uvicorn main:app --reload --port 8001

# Concepts service
cd services/concepts
uvicorn main:app --reload --port 8002

# ... similarly for other services
```

### Run All Services Concurrently

```bash
cd backend

# Install concurrently
npm install -g concurrently

# Run all services
concurrently \
  "uvicorn services.triage.main:app --port 8001" \
  "uvicorn services.concepts.main:app --port 8002" \
  "uvicorn services.debug.main:app --port 8003" \
  "uvicorn services.exercise.main:app --port 8004" \
  "uvicorn services.progress.main:app --port 8005" \
  "uvicorn services.code_review.main:app --port 8006" \
  "uvicorn services.chat.main:app --port 8007"
```

### Run Tests

```bash
cd backend

# Run all tests
pytest

# Run specific service tests
pytest services/concepts/tests/

# Run with coverage
pytest --cov=services --cov-report=html

# View coverage report
open htmlcov/index.html
```

### Code Quality

```bash
# Format code
black backend/

# Lint code
ruff check backend/

# Type check
mypy backend/
```

---

## Local Frontend Development

### Setup Node Environment

```bash
cd frontend

# Install dependencies
npm install

# Or using pnpm
pnpm install
```

### Run Development Server

```bash
npm run dev

# Access at http://localhost:3000
```

### Build for Production

```bash
npm run build

# Preview production build
npm run start
```

### Run Tests

```bash
# Unit tests
npm test

# E2E tests with Playwright
npm run test:e2e

# Component tests
npm run test:component
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

---

## MCP Servers Development

### Database MCP

```bash
cd backend/mcp-servers/database-mcp

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py

# Test
curl -X POST http://localhost:9001/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "get_exercises", "arguments": {}}'
```

### Code Execution MCP

```bash
cd backend/mcp-servers/code-execution-mcp

# Run server
python main.py

# Test
curl -X POST http://localhost:9000/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "execute_code", "arguments": {"code": "print(1+1)"}}'
```

### Kafka Events MCP

```bash
cd backend/mcp-servers/kafka-events-mcp

# Run server
python main.py

# Test
curl -X POST http://localhost:9002/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "publish_event", "arguments": {"topic": "test", "data": {"test": true}}}'
```

### K8s Operations MCP

```bash
cd backend/mcp-servers/k8s-operations-mcp

# Run server
python main.py

# Test
curl -X POST http://localhost:9003/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "get_pods", "arguments": {"namespace": "default"}}'
```

---

## Database Setup

### Local PostgreSQL (without Docker)

```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Start service
brew services start postgresql

# Create database
createdb learnflow

# Run migrations
psql -d learnflow -f backend/migrations/init.sql
```

### Connection String

```
postgresql://learnflow:learnflow-dev-password@localhost:5432/learnflow
```

---

## Kafka Setup

### Local Kafka (without Docker)

```bash
# Install Kafka
brew install kafka  # macOS

# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Start Kafka
bin/kafka-server-start.sh config/server.properties

# Create topics
bin/kafka-topics.sh --create \
  --topic learning.progress \
  --bootstrap-server localhost:9092

bin/kafka-topics.sh --create \
  --topic code.submission \
  --bootstrap-server localhost:9092

bin/kafka-topics.sh --create \
  --topic exercise.attempt \
  --bootstrap-server localhost:9092

bin/kafka-topics.sh --create \
  --topic struggle.alert \
  --bootstrap-server localhost:9092
```

---

## Dapr Setup (Optional)

### Install Dapr CLI

```bash
# macOS/Linux
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh \
  -O - | /bin/bash

# Windows
powershell -Command \
  "iwr -useb https://raw.githubusercontent.com/dapr/cli/master/install/install.ps1 | iex"
```

### Initialize Dapr

```bash
dapr init

# Verify
dapr --version
```

### Run Service with Dapr Sidecar

```bash
cd backend/services/concepts

dapr run \
  --app-id concepts-service \
  --app-port 8002 \
  --dapr-http-port 3500 \
  -- python -m uvicorn main:app --port 8002
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8001

# Kill process
kill -9 <PID>

# Or change port in service's main.py
```

### Docker Out of Memory

```bash
# Check Docker memory limits
docker system df

# Clean up unused resources
docker system prune -a

# Increase Docker memory limit in Docker Desktop settings
# Settings → Resources → Memory → 8GB+
```

### Database Connection Errors

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Frontend Build Errors

```bash
# Clear cache
rm -rf frontend/.next frontend/node_modules

# Reinstall dependencies
cd frontend && npm install

# Rebuild
npm run build
```

---

## VS Code Configuration

### Recommended Extensions

- Python (ms-python.python)
- Pylance (ms-python.vscode-pylance)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Docker (ms-azuretools.vscode-docker)
- Kubernetes (ms-kubernetes-tools.vscode-kubernetes-tools)

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.tsx": "typescriptreact"
  }
}
```

---

## Next Steps

- [Demo Guide](/demo-guide) - Run through demo scenarios
- [Backend API](/backend-api) - Explore API endpoints
- [MCP Usage](/mcp-usage) - Integrate MCP servers

---

**Ready to develop?** Start with: `docker-compose -f docker-compose.dev.yml up -d`
