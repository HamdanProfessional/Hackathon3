# LearnFlow Application

AI agents use this repository to build the LearnFlow Python learning platform.

---

## What is LearnFlow?

LearnFlow is an AI-powered Python learning platform that helps students learn Python through conversational AI agents.

**Multi-Agent System**:
- **Triage Agent** - Routes queries to specialists (explain → Concepts, error → Debug)
- **Concepts Agent** - Explains Python concepts from 8-module curriculum
- **Debug Agent** - Parses errors and provides hints before solutions
- **Exercise Agent** - Generates and auto-grades coding challenges
- **Progress Agent** - Tracks mastery scores and provides progress summaries
- **Code Review Agent** - Analyzes code for correctness, style, efficiency, and readability

**Event-Driven Architecture**:
- Kafka topics: `learning.*`, `code.*`, `exercise.*`, `struggle.*`
- Dapr for state management and service invocation
- Stateless microservices with FastAPI + Dapr sidecars

---

## How to Build This Application

> **CRITICAL**: DO NOT write application code manually. Use Skills to teach AI agents how to build it autonomously.

Use the following Skills to build LearnFlow components:

### 1. Infrastructure (Phase 3)

**Skills to use**: `kafka-k8s-setup`, `postgres-k8s-setup`

```bash
# Using Claude Code
claude
> Deploy Kafka for LearnFlow using kafka-k8s-setup skill
> Deploy PostgreSQL using postgres-k8s-setup skill

# Using Goose
goose
> Use kafka-k8s-setup skill to deploy Kafka
> Use postgres-k8s-setup skill to deploy PostgreSQL
```

### 2. Backend Services (Phase 4)

**Skill to use**: `fastapi-dapr-agent`

Create 6 microservices:

```bash
# Using Claude Code
claude
> Create triage-service using fastapi-dapr-agent skill (Port 8001, Agent: triage)
> Create concepts-service using fastapi-dapr-agent skill (Port 8002, Agent: concepts)
> Create debug-service using fastapi-dapr-agent skill (Port 8003, Agent: debug)
> Create exercise-service using fastapi-dapr-agent skill (Port 8004, Agent: exercise)
> Create progress-service using fastapi-dapr-agent skill (Port 8005, Agent: progress)
> Create code-review-service using fastapi-dapr-agent skill (Port 8006, Agent: code_review)
```

### 3. MCP Servers (Phase 6)

**Skill to use**: `mcp-code-execution`

Create 4 MCP servers:

```bash
# Using Claude Code
claude
> Create mcp-database-server using mcp-code-execution skill (Port 3001)
> Create mcp-kafka-server using mcp-code-execution skill (Port 3002)
> Create mcp-k8s-server using mcp-code-execution skill (Port 3003)
> Create mcp-code-execution-server using mcp-code-execution skill (Port 3004)
```

### 4. Frontend (Phase 5)

**Skill to use**: `nextjs-k8s-deploy`

```bash
# Using Claude Code
claude
> Deploy Next.js frontend using nextjs-k8s-deploy skill
> Include Monaco Editor for Python code execution
> Create student dashboard, chat interface, exercise page
> Create teacher portal with struggle alerts
```

### 5. Documentation (Phase 8)

**Skills to use**: `docusaurus-deploy`, `agents-md-gen`

```bash
# Using Claude Code
claude
> Generate comprehensive documentation using docusaurus-deploy skill
> Update AGENTS.md using agents-md-gen skill
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **AI Coding Agents** | Claude Code, Goose (Claude Code Router) | Execute Skills to build app |
| **Frontend** | Next.js + Monaco Editor | User interface |
| **Backend** | FastAPI + AsyncOpenAI SDK | AI-powered microservices |
| **Service Mesh** | Dapr 1.12+ | State, pub/sub, service invocation |
| **Messaging** | Kafka on Kubernetes | Event streaming |
| **Database** | PostgreSQL (Neon or self-hosted) | User data, progress, submissions |
| **Orchestration** | Kubernetes (Minikube for local, DOKS/GKE/AKS for cloud) | Deployment |
| **CI/CD** | Argo CD + GitHub Actions | GitOps-based deployment |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    LEARNFLOW APPLICATION                             │
│                                                                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │ │
│  │   Next.js     │    │   FastAPI     │    │   MCP Srv    │                   │ │
│  │  Frontend    │───▶│   Services    │───▶│  (Context)   │                   │ │
│  │  +Monaco Ed   │    │  + Dapr       │    │              │                   │ │
│  │              │    │  Sidecars    │    │              │                   │ │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐ │ │
│  │                      KAFKA (Pub/Sub)                          │ │ │
│  │  learning.* | code.* | exercise.* | struggle.*                      │ │ │
│  └──────────────────────────────────────────────────────────────────────┘ │ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐ │ │
│  │                     POSTGRESQL (State Store)                       │ │ │
│  └──────────────────────────────────────────────────────────────────────┘ │ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Python Curriculum (8 Modules)

| Module | Topics | Difficulty |
|--------|--------|------------|
| **1. Basics** | Variables, Data Types, I/O, Operators | Beginner |
| **2. Control Flow** | Conditionals, Loops, Break/Continue | Beginner |
| **3. Data Structures** | Lists, Tuples, Dictionaries, Sets | Intermediate |
| **4. Functions** | Defining, Parameters, Return, Scope | Intermediate |
| **5. OOP** | Classes, Objects, Inheritance, Encapsulation | Intermediate |
| **6. Files** | Reading/Writing, CSV, JSON | Advanced |
| **7. Errors** | Try/Except, Exceptions, Debugging | Advanced |
| **8. Libraries** | Installing Packages, APIs, Virtual Environments | Advanced |

---

## Mastery Calculation

Topic Mastery = weighted average:
- **Exercise completion**: 40%
- **Quiz scores**: 30%
- **Code quality ratings**: 20%
- **Consistency (streak)**: 10%

**Mastery Levels**:
- 0-40% → Beginner (Red)
- 41-70% → Learning (Yellow)
- 71-90% → Proficient (Green)
- 91-100% → Mastered (Blue)

---

## Business Rules

### Struggle Detection Triggers
- Same error type 3+ times
- Stuck on exercise > 10 minutes
- Quiz score < 50%
- Student says "I don't understand" or "I'm stuck"
- 5+ failed code executions in a row

### Code Execution Sandbox
- **Timeout**: 5 seconds
- **Memory**: 50MB
- **No file system access** (except temp)
- **No network access**
- **Allowed imports**: standard library only (MVP)

---

## Demo Personas

### Student Maya
- **Goal**: Learn Python for loops
- **Flow**: Login → Dashboard → Chat → Exercise → Quiz
- **Expected**: Mastery increases from 60% to 68%

### Student James
- **Struggle**: List comprehensions (3 wrong answers)
- **Detection**: Struggle alert sent to teacher
- **Resolution**: Teacher generates easy exercises → James completes

### Teacher Mr. Rodriguez
- **Actions**: View struggles → Generate exercises → Assign to students
- **Tools**: Dashboard analytics, Exercise generation

---

## Success Criteria

Build autonomously using Claude Code and Goose:

- [ ] Complete LearnFlow application assembled
- [ ] All 6 backend services deployed
- [ ] Frontend with Monaco Editor deployed
- [ ] All 4 MCP servers functional
- [ ] Student personas working (Maya, James)
- [ ] Teacher portal with analytics
- [ ] Git history shows agentic workflow

---

## Repository Structure

```
learnflow-app/
├── .claude/
│   └── skills/              # Skills copied from skills-library
├── frontend/              # Next.js application
├── backend/               # FastAPI microservices
│   ├── triage-service/
│   ├── concepts-service/
│   ├── debug-service/
│   ├── exercise-service/
│   ├── progress-service/
│   └── code-review-service/
├── infrastructure/         # Kubernetes manifests
├── docs/                  # Generated documentation
└── AGENTS.md             # This file
```

---

## Commit History Tip

Your git history should reflect an agentic workflow. Use messages like:

- "Claude: deployed Kafka using kafka-k8s-setup skill"
- "Claude: created concepts-service using fastapi-dapr-agent skill"
- "Goose: deployed PostgreSQL using postgres-k8s-setup skill"
- "Claude: deployed Next.js frontend using nextjs-k8s-deploy skill"

This demonstrates that the application was built autonomously by AI agents using Skills.

---

## License

MIT License - See LICENSE file for details
