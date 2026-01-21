# Phase 7: LearnFlow Build - Implementation Plan

**Phase**: 7
**Focus**: Assemble and test complete LearnFlow application using Claude Code and Goose
**Status**: Draft

---

## Overview

This is the **culmination phase** where all components from Phases 1-6 are assembled. The key principle:

> **DO NOT write application code manually. Use Skills to teach Claude Code and Goose to build it autonomously.**

Human involvement is limited to:
1. Invoking the appropriate Skills
2. Reviewing generated code
3. Testing functionality
4. Iterating with the AI agents

---

## Implementation Strategy

### Repository Setup

**Create learnflow-app Repository**:
```bash
cd ..
mkdir learnflow-app && cd learnflow-app
git init

# Link or copy Skills
mkdir -p .claude/skills
cp -r ../skills-library/.claude/skills/* .claude/skills/

# Create AGENTS.md
cat > AGENTS.md << 'EOF'
# LearnFlow Application

AI agents use this repository to build the LearnFlow Python learning platform.

## How to Build This Application

Use the following Skills to build LearnFlow components:

1. **Infrastructure**: kafka-k8s-setup, postgres-k8s-setup
2. **Backend**: fastapi-dapr-agent (5 services)
3. **Frontend**: nextjs-k8s-deploy
4. **Integration**: mcp-code-execution (4 MCP servers)
5. **Documentation**: docusaurus-deploy, agents-md-gen
EOF
```

---

## Step-by-Step Build Process

### Step 1: Clean Environment

**Start Fresh**:
```bash
# Ensure clean Minikube
minikube delete
minikube start --cpus=4 --memory=8192

# Verify cluster
kubectl cluster-info
```

---

### Step 2: Infrastructure Deployment

**Using Claude Code**:
```bash
claude
> Deploy Kafka for LearnFlow using kafka-k8s-setup skill
> Verify Kafka is running

> Deploy PostgreSQL using postgres-k8s-setup skill
> Verify PostgreSQL is running
```

**Expected AI Actions**:
1. AI reads SKILL.md (~100 tokens)
2. AI executes `./scripts/deploy.sh`
3. AI runs `./scripts/verify.py`
4. AI confirms deployment

**Verification**:
```bash
kubectl get pods -n kafka
kubectl get pods -n postgres
```

---

### Step 3: Backend Services Build

**Using Claude Code**:
```bash
claude
> Create triage-service using fastapi-dapr-agent skill
> Port: 8001, Agent: triage

> Create concepts-service using fastapi-dapr-agent skill
> Port: 8002, Agent: concepts

> Create debug-service using fastapi-dapr-agent skill
> Port: 8003, Agent: debug

> Create exercise-service using fastapi-dapr-agent skill
> Port: 8004, Agent: exercise

> Create progress-service using fastapi-dapr-agent skill
> Port: 8005, Agent: progress
```

**Per Service**:
1. Generate scaffold
2. Implement agent logic
3. Configure Dapr components
4. Deploy to Kubernetes
5. Verify health endpoint

---

### Step 4: MCP Servers Build

**Using Claude Code**:
```bash
claude
> Create mcp-database-server using mcp-code-execution skill
> Port: 3001

> Create mcp-kafka-server using mcp-code-execution skill
> Port: 3002

> Create mcp-k8s-server using mcp-code-execution skill
> Port: 3003

> Create mcp-code-execution-server using mcp-code-execution skill
> Port: 3004
```

**Per Server**:
1. Generate scaffold
2. Implement MCP tools
3. Test tools
4. Deploy to Kubernetes

---

### Step 5: Frontend Build

**Using Claude Code**:
```bash
claude
> Deploy Next.js frontend using nextjs-k8s-deploy skill
> Include Monaco Editor
> Create student dashboard with progress visualization
> Create chat interface for AI tutoring
> Create exercise page with code editor
> Create teacher portal with struggle alerts
```

**Components**:
1. Generate Next.js app
2. Install Monaco Editor
3. Implement pages
4. Configure API integration
5. Deploy to Kubernetes

---

### Step 6: Database Setup

**Using Claude Code**:
```bash
claude
> Create database schemas for LearnFlow
> Tables: students, student_progress, exercise_attempts, code_submissions, conversations
> Run migrations
> Seed test data
```

---

### Step 7: Dapr Configuration

**Using Claude Code**:
```bash
claude
> Create Dapr components for LearnFlow
> PubSub component for Kafka
> State store component for PostgreSQL
> Apply components to cluster
```

---

### Step 8: Ingress Configuration

**Using Claude Code**:
```bash
claude
> Configure ingress for LearnFlow frontend
> Set up domain routing
> Configure TLS (local: self-signed)
```

---

## Testing Scenarios

### Scenario 1: Student Maya

```bash
# 1. Maya logs in
curl -X POST http://learnflow.local/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "maya@example.com", "password": "password"}'

# 2. View progress
curl http://learnflow.local/api/v1/progress/maya-id

# 3. Ask question
curl -X POST http://learnflow.local/api/v1/triage \
  -H "Content-Type: application/json" \
  -d '{"message": "How do for loops work?"}'

# 4. Run code
curl -X POST http://learnflow.local/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "for i in range(5): print(i)"}'
```

---

### Scenario 2: Student James Struggles

```bash
# 1. James fails exercise 3 times
for i in {1..3}; do
  curl -X POST http://learnflow.local/api/v1/exercise/submit \
    -H "Content-Type: application/json" \
    -d '{"code": "[x for x in range(10)]", "exercise_id": "list-comp-1"}'
done

# 2. Check struggle alert
kubectl exec -n kafka kafka-0 -- \
  kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic struggle.alert \
  --from-beginning --max-messages 1
```

---

### Scenario 3: Teacher Analytics

```bash
# 1. Teacher views dashboard
curl http://learnflow.local/api/v1/teacher/stats

# 2. View struggling students
curl http://learnflow.local/api/v1/struggling

# 3. Generate custom exercise
curl -X POST http://learnflow.local/api/v1/exercise/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "for loops", "difficulty": "easy", "count": 3}'
```

---

## Cross-Agent Compatibility Test

### Test with Claude Code

```bash
minikube delete
minikube start --cpus=4 --memory=8192

claude
> Build complete LearnFlow application using all available Skills.
> Deploy Kafka, PostgreSQL, 5 FastAPI services, 4 MCP servers, and Next.js frontend.
> Verify all components are running.
```

**Expected**: All services running, application accessible

### Test with Goose

```bash
minikube delete
minikube start --cpus=4 --memory=8192

goose
> Use the available Skills to build the complete LearnFlow application.
> Deploy all infrastructure, services, and frontend.
> Test that everything is working.
```

**Expected**: Same result - cross-agent compatibility proven

---

## Success Criteria Validation

- [ ] Complete LearnFlow application assembled
- [ ] Built using Claude Code with Skills
- [ ] Built using Goose with same Skills
- [ ] All 5 student personas working
- [ ] All teacher features working
- [ ] End-to-end user flows tested
- [ ] Multi-agent system functioning
- [ ] Event-driven architecture operational
- [ ] Single prompt → deployment verified

---

## Deliverables

1. **learnflow-app Repository**
   - All application code
   - Kubernetes manifests
   - Docker images
   - Configuration files

2. **Git History**
   - Commits referencing Skills used
   - Example: "Claude: deployed Kafka using kafka-k8s-setup skill"

3. **AGENTS.md**
   - Complete application documentation
   - Skills usage instructions

4. **Demo Evidence**
   - Screenshots of working app
   - Logs of autonomous build
   - Token efficiency metrics

---

## Dependencies

**Required**:
- All previous phases complete (1-6)
- All Skills working
- Claude Code installed
- Goose installed

**Blocking**:
- Phases 1-6 must be complete
- Minikube running
- Sufficient resources (8GB RAM, 4 CPUs)
