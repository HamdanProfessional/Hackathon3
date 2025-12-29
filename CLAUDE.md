# LearnFlow - Hackathon 3: Reusable Intelligence and Cloud-Native Mastery

## Project Overview

**LearnFlow** is an AI-powered learning platform that helps students learn Python programming through conversational AI agents. This project demonstrates the **MCP Code Execution Pattern with Skills** for building cloud-native, event-driven microservices.

### The Core Philosophy
> **The Skills are the Product** - We're not just building an application; we're creating reusable Skills that teach AI agents how to build sophisticated cloud-native systems autonomously.

### Technology Stack
| Component | Technology |
|-----------|------------|
| **AI Coding Agents** | Claude Code, Goose (LLM-agnostic) |
| **Frontend** | Next.js + Monaco Editor (embedded code editor) |
| **Backend** | FastAPI + OpenAI SDK |
| **Auth** | Better Auth |
| **Service Mesh** | Dapr (state management, pub/sub, service invocation) |
| **Messaging** | Kafka on Kubernetes |
| **Database** | Neon PostgreSQL |
| **API Gateway** | Kong API Gateway on Kubernetes |
| **AI Context** | MCP Servers (real-time data access) |
| **Orchestration** | Kubernetes (Minikube for local, DOKS/GKE/AKS for cloud) |
| **CI/CD** | Argo CD + GitHub Actions (GitOps) |
| **Documentation** | Docusaurus |

---

## Project Structure

This repository is the **skills-library** that contains reusable Skills for building LearnFlow and similar cloud-native applications.

```
skills-library/
├── CLAUDE.md              # This file - project constitution
├── requirements.md        # Hackathon 3 requirements
├── .claude/
│   ├── agents/           # Agent definitions (orchestrator, specialists)
│   ├── commands/         # Slash commands for Spec-Kit Plus
│   └── skills/           # Reusable Skills (MCP Code Execution pattern)
│       ├── agents-md-gen/
│       ├── kafka-k8s-setup/
│       ├── postgres-k8s-setup/
│       ├── fastapi-dapr-agent/
│       ├── mcp-code-execution/
│       ├── nextjs-k8s-deploy/
│       └── docusaurus-deploy/
└── docs/
    └── skill-development-guide.md
```

---

## LearnFlow Application Architecture

### Multi-Agent System
| Agent | Purpose & Capabilities |
|-------|------------------------|
| **Triage Agent** | Routes queries: "explain" → Concepts, "error" → Debug |
| **Concepts Agent** | Explains Python concepts with examples, adapts to student level |
| **Code Review Agent** | Analyzes code for correctness, PEP 8 style, efficiency |
| **Debug Agent** | Parses errors, identifies root causes, provides hints |
| **Exercise Agent** | Generates and auto-grades coding challenges |
| **Progress Agent** | Tracks mastery scores and provides progress summaries |

### Event-Driven Architecture (Kafka Topics)
| Topic Pattern | Purpose |
|---------------|---------|
| `learning.*` | Learning progress updates |
| `code.*` | Code submission events |
| `exercise.*` | Exercise generation and grading |
| `struggle.*` | Struggle detection alerts |

### Business Rules
- **Mastery Calculation**: Weighted average (Exercise 40%, Quiz 30%, Code Quality 20%, Streak 10%)
- **Struggle Detection**: Same error 3+ times, stuck > 10m, quiz score < 50%, explicit help request, 5+ failed executions
- **Code Sandbox**: 5s timeout, 50MB memory, no network, temp file access only

---

## MCP Code Execution Pattern

### The Token Problem
Direct MCP integration loads tool definitions into context, consuming 50,000+ tokens before any work begins.

### The Solution
Skills with **Code Execution Pattern**:
1. `SKILL.md` (~100 tokens) - Instructions
2. `scripts/*.py` (0 tokens) - Executed, not loaded
3. Only final result enters context (minimal tokens)

**Result: 80-98% token reduction while maintaining full capability**

### Skill Template Structure
```
.claude/skills/<skill-name>/
├── SKILL.md              # Minimal instructions (~100 tokens)
├── REFERENCE.md          # Deep docs (loaded on-demand)
└── scripts/
    ├── deploy.sh         # Executes commands (0 tokens)
    ├── verify.py         # Returns minimal result (0 tokens)
    └── mcp_client.py     # Wraps MCP calls (optional)
```

---

## Required Skills for Hackathon 3

| Skill | Purpose | Status |
|-------|---------|--------|
| `agents-md-gen` | Generate AGENTS.md files | Pending |
| `kafka-k8s-setup` | Deploy Kafka on K8s | Pending |
| `postgres-k8s-setup` | Deploy PostgreSQL on K8s | Pending |
| `fastapi-dapr-agent` | FastAPI + Dapr services | Pending |
| `mcp-code-execution` | MCP with code execution pattern | Pending |
| `nextjs-k8s-deploy` | Deploy Next.js apps | Pending |
| `docusaurus-deploy` | Deploy documentation | Pending |

### Bonus Skills
- `prometheus-grafana-setup`
- `argocd-app-deployment`
- `kafka-stream-processor`
- `pg-data-backup-restore`
- `dapr-pubsub-binding`
- `mcp-state-management`
- `nextjs-perf-optimize`
- `docusaurus-search-config`

---

## Orchestration Patterns

### Pattern 1: Full-Stack LearnFlow Feature
```
1. architect (with architecture-planner): Create implementation plan
2. spec-kit-architect (with spec-architect): Write/validate spec
3. lead-engineer: Review and approve plan
4. Parallel:
   - backend-specialist (with fastapi-dapr-agent skill): Implement microservice
   - frontend-specialist (with nextjs-k8s-deploy skill): Build UI
5. dapr-event-specialist (with dapr-pubsub-binding skill): Configure pub/sub
6. deployment-engineer (with k8s-deployer skill): Deploy to Minikube
```

### Pattern 2: Infrastructure Setup with Skills
```
1. cloudops-engineer (with kafka-k8s-setup skill):
   - Execute: scripts/deploy.sh
   - Verify: scripts/verify.py
2. cloudops-engineer (with postgres-k8s-setup skill):
   - Execute: scripts/deploy.sh
   - Run migration scripts
3. deployment-engineer (with k8s-troubleshoot skill): Verify all pods running
```

### Pattern 3: Event-Driven Microservice
```
1. architect: Design event flow (Kafka topics)
2. dapr-event-specialist (with dapr-event-flow skill):
   - Configure Dapr components
   - Set up pub/sub subscriptions
3. backend-specialist (with fastapi-dapr-agent skill):
   - Implement event publisher
   - Implement event subscriber
4. cloudops-engineer (with kafka-stream-processor skill): Deploy Kafka processor
```

---

## Agent Responsibilities

### Orchestrator (Meta-Agent)
- **Role**: Coordinate specialist agents for complex multi-domain tasks
- **Key Skills**: agent-orchestrator, task-breaker
- **DO**: Delegate, coordinate, synthesize results
- **DON'T**: Write implementation code directly, override agent outputs

### Architect
- **Role**: System architecture, implementation planning
- **Key Skills**: architecture-planner, adr-generator, spec-architect
- **Use When**: Planning features, evaluating tradeoffs, creating ADRs

### Backend Specialist
- **Role**: FastAPI, SQLModel, JWT auth, MCP tools
- **Key Skills**: backend-scaffolder, crud-builder, mcp-tool-maker, agent-orchestrator
- **Use When**: API endpoints, database models, AI agent integration

### Frontend Specialist
- **Role**: Next.js, TypeScript, Tailwind CSS, Monaco Editor
- **Key Skills**: frontend-component, api-schema-sync
- **Use When**: UI components, API integration, code editor integration

### Dapr Event Specialist
- **Role**: Dapr pub/sub, event streaming
- **Key Skills**: dapr-event-flow, dapr-events
- **Use When**: Event-driven architecture, Kafka integration

### CloudOps Engineer
- **Role**: Docker, Helm charts, Dapr, Kafka/Redpanda
- **Key Skills**: infrastructure, cloud-devops, k8s-deployer
- **Use When**: Containerization, Kubernetes deployment

### Deployment Engineer
- **Role**: Kubernetes deployments, troubleshooting
- **Key Skills**: k8s-deployer, k8s-troubleshoot, deployment-validator
- **Use When**: Deploying to Minikube/DOKS, pod failures

### Database Migration Specialist
- **Role**: Alembic migrations, schema changes
- **Key Skills**: db-migration-wizard
- **Use When**: Adding/modifying database columns, tables

### Spec-Kit Architect
- **Role**: Spec-Kit Plus governance, feature specs
- **Key Skills**: spec-architect, phr-documenter
- **Use When**: Writing feature specifications, validating compliance

### Lead Engineer
- **Role**: Development standards, code quality, git workflow
- **Key Skills**: git-committer, code-reviewer, performance-analyzer
- **Use When**: Code reviews, enforcing standards, git commits

---

## Development Workflow

### 1. Planning Phase (MANDATORY for complex features)
```markdown
Use EnterPlanMode when:
- New feature implementation with multiple approaches
- Multi-file changes (> 3 files)
- Architectural decisions required
- User preferences matter
```

### 2. Testing First (MANDATORY)
```markdown
Before ANY implementation:
1. Review existing tests in tests/ directory
2. Write test first (TDD approach)
3. Run tests to establish baseline
4. Implement feature to make tests pass
5. Verify all tests pass
```

### 3. Git Workflow (MANDATORY)
```markdown
After EVERY task completion:
1. Review changes: git status
2. Stage files: git add
3. Commit with conventional format:
   <type>(<scope>): <description>
4. Push to main branch
5. Verify commit appears in git log
```

---

## Evaluation Criteria

| Criterion | Weight | Gold Standard |
|-----------|--------|---------------|
| **Skills Autonomy** | 15% | Single prompt → running K8s deployment |
| **Token Efficiency** | 10% | Skills use scripts for execution |
| **Cross-Agent Compatibility** | 5% | Same skill works on Claude Code AND Goose |
| **Architecture** | 20% | Dapr patterns, Kafka pub/sub, stateless services |
| **MCP Integration** | 10% | MCP provides rich context |
| **Documentation** | 10% | Docusaurus site via Skills |
| **Spec-Kit Plus Usage** | 15% | Specs translate to agentic instructions |
| **LearnFlow Completion** | 15% | Application built entirely via skills |

---

## Phase Roadmap

| Phase | Deliverables |
|-------|--------------|
| 1. Setup | Environment ready, repos created, Minikube running |
| 2. Foundation Skills | `agents-md-gen`, `k8s-foundation` skills working |
| 3. Infrastructure | Kafka + PostgreSQL deployed via Skills |
| 4. Backend Services | FastAPI + Dapr + Agent microservices |
| 5. Frontend | Next.js with Monaco editor deployed |
| 6. Integration | MCP servers + Docusaurus documentation |
| 7. LearnFlow Build | Complete application via Claude + Goose |
| 8. Polish & Demo | Documentation complete, demo ready |
| 9. Cloud Deployment | Deploy on Azure, Google, or Oracle Cloud |
| 10. Continuous Deployment | Argo CD with GitHub Actions |

---

## Key Commands

### Slash Commands (Spec-Kit Plus)
- `/sp.plan` - Create implementation plan
- `/sp.specify` - Generate feature specification
- `/sp.implement` - Implement from specification
- `/sp.tasks` - Show task breakdown
- `/sp.adr` - Create Architecture Decision Record
- `/sp.constitution` - View project constitution

### Skills (Invoke directly)
- `kafka-k8s-setup` - Deploy Kafka on Kubernetes
- `postgres-k8s-setup` - Deploy PostgreSQL on Kubernetes
- `fastapi-dapr-agent` - Create FastAPI + Dapr microservice
- `mcp-code-execution` - MCP with code execution pattern
- `nextjs-k8s-deploy` - Deploy Next.js applications
- `docusaurus-deploy` - Deploy documentation site

---

## Important Notes

### On Windows
Do all development using **WSL** for compatibility with Minikube, Docker, and kubectl.

### Token Optimization
Every Skill should follow the MCP Code Execution pattern:
- SKILL.md: ~100 tokens (instructions only)
- scripts/*: 0 tokens (executed, never loaded)
- REFERENCE.md: 0 tokens (loaded on-demand only)
- Output: Minimal tokens (result only)

### Cross-Agent Compatibility
All Skills must work with:
- Claude Code (primary)
- Goose (required for validation)
- OpenAI Codex (optional)

### Stateless Services
All microservices must be stateless:
- No in-memory state
- All state in database or Dapr state store
- Conversation history from database
- Tenant isolation with proper auth

---

## Resources

- [Agentic AI Foundation (AAIF)](https://aaif.io/)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)
- [Goose Documentation](https://block.github.io/goose/)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Dapr](https://dapr.io)
- [Kafka](https://kafka.apache.org/)
- [Kubernetes](https://kubernetes.io/docs/)
- [Minikube](https://minikube.sigs.k8s.io/docs/)
- [Helm](https://helm.sh/docs/)
- [MCP Code Execution Pattern](https://www.anthropic.com/engineering/code-execution-with-mcp)

---

## Submission

**Submit via:** [Google Form](https://forms.gle/Mrhf9XZsuXN4rWJf7)

**Two Repositories Required:**
1. `skills-library` - This repository with all Skills
2. `learnflow-app` - The application built using these Skills

**Remember:** The Skills are the product. Judges will evaluate both the development process behind your Skills AND test the Skills with Claude Code and Goose.
