# Phase 7: LearnFlow Build Specification

**Status**: Draft
**Phase**: 7
**Focus**: Assemble and test complete LearnFlow application using Claude Code and Goose

---

## Overview

This is the **culmination phase** where all components from Phases 1-6 are assembled into a working LearnFlow application. The key principle is:

> **DO NOT write application code manually. Use Skills to teach Claude Code and Goose to build it autonomously.**

The application will be built entirely by AI agents using the Skills created in previous phases. Human involvement is limited to:
1. Invoking the appropriate Skills
2. Reviewing generated code
3. Testing functionality
4. Iterating with the AI agents

---

## Success Criteria

- [ ] Complete LearnFlow application assembled
- [ ] Built using Claude Code with Skills
- [ ] Built using Goose with same Skills (cross-agent compatibility)
- [ ] All 5 student personas working (Maya, James, etc.)
- [ ] All teacher features working
- [ ] End-to-end user flows tested
- [ ] Multi-agent system functioning
- [ ] Event-driven architecture operational
- [ ] Single prompt → deployment verified

---

## Repository Setup

### Create learnflow-app Repository

```bash
# Initialize new repository
cd ..
mkdir learnflow-app && cd learnflow-app
git init

# Link skills-library for Skills access
# (Both Claude Code and Goose read from .claude/skills/)
mkdir -p .claude/skills

# Option 1: Symlink skills (recommended for development)
# On Linux/Mac:
ln -s ../skills-library/.claude/skills/* .claude/skills/

# Option 2: Copy skills (for isolation)
cp -r ../skills-library/.claude/skills/* .claude/skills/

# Create initial AGENTS.md
cat > AGENTS.md << 'EOF'
# LearnFlow Application

AI agents use this repository to build the LearnFlow Python learning platform.

## How to Build This Application

Use the following Skills to build LearnFlow components:

1. **Infrastructure**:
   - Use `kafka-k8s-setup` skill to deploy Kafka
   - Use `postgres-k8s-setup` skill to deploy PostgreSQL

2. **Backend Services**:
   - Use `fastapi-dapr-agent` skill to create microservices
   - Services to build: triage, concepts, debug, exercise, progress

3. **Frontend**:
   - Use `nextjs-k8s-deploy` skill to deploy Next.js app
   - Include Monaco Editor for code execution

4. **Integration**:
   - Use `mcp-code-execution` skill to create MCP servers
   - Servers: database, kafka, k8s, code-execution

5. **Documentation**:
   - Use `docusaurus-deploy` skill to generate docs
   - Use `agents-md-gen` skill to update this file

## Architecture

LearnFlow uses a multi-agent architecture with event-driven communication:

- **Triage Agent**: Routes queries to specialists
- **Concepts Agent**: Explains Python concepts
- **Debug Agent**: Analyzes errors and provides hints
- **Exercise Agent**: Generates and auto-grades exercises
- **Progress Agent**: Tracks mastery and progress

## Technology Stack

- Frontend: Next.js + Monaco Editor
- Backend: FastAPI + Dapr + OpenAI SDK
- Messaging: Kafka on Kubernetes
- Database: PostgreSQL
- Orchestration: Kubernetes (Minikube for local)
EOF

git add AGENTS.md
git commit -m "docs: add AGENTS.md for learnflow-app"
```

---

## Build Process

### Step 1: Infrastructure Deployment (Skills-Based)

**Using Claude Code**:
```bash
claude
> Deploy Kafka for LearnFlow using kafka-k8s-setup skill
> Deploy PostgreSQL using postgres-k8s-setup skill
```

**Using Goose**:
```bash
goose
> Use kafka-k8s-setup skill to deploy Kafka
> Use postgres-k8s-setup skill to deploy PostgreSQL
```

**Expected AI Actions**:
1. AI reads SKILL.md (~100 tokens)
2. AI executes `./scripts/deploy.sh` (0 tokens)
3. AI runs `./scripts/verify.py` to check status
4. AI confirms deployment successful

**Verification**:
```bash
kubectl get pods -n kafka
kubectl get pods -n postgres
kubectl get svc -n kafka
kubectl get svc -n postgres
```

---

### Step 2: Backend Services Build (Skills-Based)

**Using Claude Code**:
```bash
claude
> Create triage-service using fastapi-dapr-agent skill
> Create concepts-service using fastapi-dapr-agent skill
> Create debug-service using fastapi-dapr-agent skill
> Create exercise-service using fastapi-dapr-agent skill
> Create progress-service using fastapi-dapr-agent skill
```

**Expected AI Actions for Each Service**:
1. AI reads SKILL.md (~100 tokens)
2. AI executes `python scripts/generate.py --name <service> --port <port> --agent <agent-type>`
3. AI reviews generated scaffold
4. AI implements agent logic using OpenAI SDK
5. AI executes `./scripts/deploy.sh`
6. AI verifies deployment

**Service Configuration**:

| Service | Port | Agent | Endpoints |
|---------|------|-------|-----------|
| triage-service | 8001 | Triage | POST /api/v1/triage |
| concepts-service | 8002 | Concepts | POST /api/v1/concepts/explain |
| debug-service | 8003 | Debug | POST /api/v1/debug/analyze |
| exercise-service | 8004 | Exercise | POST /api/v1/exercise/{generate,submit} |
| progress-service | 8005 | Progress | GET /api/v1/progress/{student_id} |

**Verification**:
```bash
# Check all services deployed
kubectl get pods -n learnflow

# Test health endpoints
for svc in triage concepts debug exercise progress; do
  curl http://$svc-service:8000/health
done
```

---

### Step 3: MCP Servers Build (Skills-Based)

**Using Claude Code**:
```bash
claude
> Create mcp-database-server using mcp-code-execution skill
> Create mcp-kafka-server using mcp-code-execution skill
> Create mcp-k8s-server using mcp-code-execution skill
> Create mcp-code-execution-server using mcp-code-execution skill
```

**Expected AI Actions**:
1. AI reads SKILL.md (~100 tokens)
2. AI executes `python scripts/generate.py --name <server-name> --port <port>`
3. AI implements MCP tools for data access
4. AI tests tools using `scripts/test.py`
5. AI executes `./scripts/deploy.sh`

**MCP Server Configuration**:

| Server | Port | Tools |
|--------|------|-------|
| mcp-database-server | 3001 | get_student_progress, get_code_submissions, get_struggling_students |
| mcp-kafka-server | 3002 | publish_learning_event, subscribe_to_events, publish_struggle_alert |
| mcp-k8s-server | 3003 | get_pod_status, get_service_logs, check_service_health |
| mcp-code-execution-server | 3004 | execute_code, test_with_test_cases |

---

### Step 4: Frontend Build (Skills-Based)

**Using Claude Code**:
```bash
claude
> Deploy Next.js frontend using nextjs-k8s-deploy skill
> Include Monaco Editor for Python code execution
> Create student dashboard with progress visualization
> Create chat interface for AI tutoring
> Create exercise page with code editor
> Create teacher portal with struggle alerts
```

**Expected AI Actions**:
1. AI reads SKILL.md (~100 tokens)
2. AI creates Next.js app with App Router
3. AI installs Monaco Editor package
4. AI implements pages: dashboard, modules, exercise, chat
5. AI implements API integration
6. AI executes `./scripts/deploy.sh`
7. AI executes `./scripts/ingress.sh` for routing

**Page Structure**:
```
app/
├── (auth)/login/page.tsx
├── (student)/
│   ├── dashboard/page.tsx
│   ├── modules/[id]/page.tsx
│   ├── exercise/[id]/page.tsx
│   └── chat/page.tsx
└── (teacher)/
    ├── dashboard/page.tsx
    ├── class/[id]/page.tsx
    └── struggles/page.tsx
```

---

### Step 5: Documentation Build (Skills-Based)

**Using Claude Code**:
```bash
claude
> Generate API documentation using docusaurus-deploy skill
> Generate architecture diagrams
> Document deployment process
> Update AGENTS.md using agents-md-gen skill
```

---

## Testing Scenarios

### Scenario 1: Student Maya's Learning Journey

**Persona**: Maya, beginner Python student

**Flow**:
```bash
# 1. Maya logs in
# Visit: http://learnflow.local/login
# Email: maya@example.com
# Action: Enter credentials

# 2. View dashboard
# Expected: "Module 2: Control Flow - 60% complete"
# Action: Click "Continue Learning"

# 3. Ask for explanation
# Chat: "How do for loops work in Python?"
# Expected: Concepts Agent responds with explanation + examples
# Verification: Response contains code examples

# 4. Practice exercise
# Action: Navigate to exercise
# Code: Write for loop in Monaco
# Action: Click "Run"
# Expected: Output displays correctly

# 5. Take quiz
# Action: Complete quiz
# Score: 4/5 (80%)
# Expected: Mastery updates to 68%
```

**Test Commands**:
```bash
# Check progress updated
curl http://progress-service:8000/api/v1/progress/maya-id

# Check event published
kubectl exec -n kafka kafka-0 -- \
  kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic learning.progress \
  --from-beginning --max-messages 1
```

---

### Scenario 2: Student James Struggles

**Persona**: James, student having difficulty

**Flow**:
```bash
# 1. James attempts list comprehensions
# Code: [x*2 for x in range(10)] # Fails 3 times
# Error: Various syntax errors

# 2. Struggle detection triggers
# Expected: Alert published to struggle.alert topic
# Teacher dashboard shows James in struggling list

# 3. Teacher creates custom exercises
# Teacher: "Create easy exercises on list comprehensions"
# Expected: Exercise Agent generates 3 easy exercises

# 4. James receives notification
# Action: James practices with easier exercises
# Result: Completes successfully, confidence restored
```

**Test Commands**:
```bash
# Check struggle alerts
kubectl exec -n kafka kafka-0 -- \
  kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic struggle.alert \
  --from-beginning --max-messages 1

# Check struggling students endpoint
curl http://progress-service:8000/api/v1/struggling
```

---

### Scenario 3: Teacher Analytics

**Persona**: Mr. Rodriguez, Python teacher

**Flow**:
```bash
# 1. Teacher views dashboard
# Visit: http://learnflow.local/teacher/dashboard
# Expected: Class overview statistics

# 2. View struggling students
# Action: Click "Struggling" tab
# Expected: See James and other struggling students
# Details: Error count, time stuck, specific error

# 3. Generate custom exercise
# Action: Click "Generate Exercise" for James
# Prompt: "Easy for loop exercises"
# Expected: Exercise Agent generates 3 exercises

# 4. Assign to student
# Action: Click "Assign"
# Expected: James receives notification
```

---

## Multi-Agent Coordination Test

### Event Flow Test

```bash
# 1. Student submits code
curl -X POST http://exercise-service:8000/api/v1/exercise/submit \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "test-id",
    "exercise_id": "exercise-1",
    "code": "for i in range(5): print(i)"
  }'

# 2. Verify event published to Kafka
kubectl exec -n kafka kafka-0 -- \
  kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic exercise.attempt \
  --from-beginning --max-messages 1

# Expected output:
{
  "event_type": "exercise.attempt",
  "student_id": "test-id",
  "exercise_id": "exercise-1",
  "passed": true,
  "attempts": 1
}

# 3. Verify progress updated
curl http://progress-service:8000/api/v1/progress/test-id

# Expected: mastery increased
```

---

## Cross-Agent Compatibility Test

### Test with Claude Code

```bash
# 1. Clean slate
minikube delete
minikube start --cpus=4 --memory=8192

# 2. Build entire app with single prompt
claude
> Build complete LearnFlow application using all available Skills.
> Deploy Kafka, PostgreSQL, 5 FastAPI services, 4 MCP servers, and Next.js frontend.
> Verify all components are running.

# 3. Claude should:
# - Use kafka-k8s-setup skill
# - Use postgres-k8s-setup skill
# - Use fastapi-dapr-agent skill (5 times)
# - Use mcp-code-execution skill (4 times)
# - Use nextjs-k8s-deploy skill
# - Verify all deployments
```

**Expected Result**: All services running, application accessible

### Test with Goose

```bash
# 1. Clean slate
minikube delete
minikube start --cpus=4 --memory=8192

# 2. Build entire app with single prompt
goose
> Use the available Skills to build the complete LearnFlow application.
> Deploy all infrastructure, services, and frontend.
> Test that everything is working.

# 3. Goose should:
# - Read .claude/skills/*/SKILL.md
# - Execute scripts/deploy.sh for each skill
# - Verify deployments
```

**Expected Result**: Same as Claude Code - demonstrates cross-agent compatibility

---

## Validation Checklist

### Infrastructure
- [ ] Kafka deployed and accessible
- [ ] PostgreSQL deployed and accessible
- [ ] Namespaces created (kafka, postgres, learnflow)
- [ ] PVCs provisioned

### Backend Services
- [ ] All 5 FastAPI services running
- [ ] Dapr sidecars running
- [ ] Health endpoints responding
- [ ] Can invoke services via Dapr

### MCP Servers
- [ ] All 4 MCP servers running
- [ ] Tools accessible via MCP protocol
- [ ] Database queries working
- [ ] Kafka pub/sub working
- [ ] K8s operations working
- [ ] Code execution working

### Frontend
- [ ] Next.js app deployed
- [ ] Ingress routing configured
- [ ] Monaco Editor embedded
- [ ] Student pages accessible
- [ ] Teacher pages accessible
- [ ] API integration working

### End-to-End
- [ ] Student can login
- [ ] Student can view progress
- [ ] Student can chat with agents
- [ ] Student can run code
- [ ] Student can submit exercises
- [ ] Teacher can view class
- [ ] Teacher can see struggles
- [ ] Teacher can generate exercises

---

## Deliverables

1. **learnflow-app Repository**
   - All application code
   - Kubernetes manifests
   - Docker images
   - Configuration files

2. **Git History**
   - Commits should reference Skills used
   - Example: "Claude: deployed Kafka using kafka-k8s-setup skill"
   - Example: "Goose: created concepts-service using fastapi-dapr-agent"

3. **AGENTS.md**
   - Complete application documentation
   - Skills usage instructions
   - Architecture overview

4. **Demo Recording**
   - 5-10 minute video demonstrating:
     - Student learning flow
     - Teacher analytics
     - Multi-agent coordination
     - Struggle detection

---

## Next Phase

After Phase 7 completion, proceed to **Phase 8: Polish & Demo** where documentation is finalized and the demo is prepared for submission.
