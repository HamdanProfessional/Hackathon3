# LearnFlow Project Constitution

**Version**: 1.0.0 | **Ratified**: 2025-01-26 | **Last Amended**: 2025-01-26

---

## Core Principles

### I. Skills-First Development

**The Skills are the Product** - We're not just building an application; we're creating reusable Skills that teach AI agents how to build sophisticated cloud-native systems autonomously.

- Every feature MUST be implemented as a reusable Skill
- Skills MUST work across multiple AI agents (Claude Code, Goose, OpenAI Codex)
- Skills follow the MCP Code Execution pattern for token efficiency
- Skills are self-contained, independently testable, and documented
- Each Skill has clear purpose and defined boundaries

### II. MCP Code Execution Pattern (NON-NEGOTIABLE)

**Token Optimization is Critical** - Direct MCP integration loads 50,000+ tokens; Skills use scripts to reduce this by 80-98%.

**Required Structure**:
```
.claude/skills/<skill-name>/
├── SKILL.md              # ~100 tokens - instructions only
├── REFERENCE.md          # Deep docs - loaded on-demand only
└── scripts/              # Executed, never loaded into context
    ├── deploy.sh
    ├── verify.py
    └── mcp_client.py
```

**Token Budget**:
- SKILL.md: ~100 tokens (400-500 characters)
- REFERENCE.md: 0 tokens (loaded only when explicitly referenced)
- scripts/*: 0 tokens (executed, never loaded)
- Output: Minimal tokens (result only)

### III. Cloud-Native Architecture

**All Services are Cloud-Native** - Built for Kubernetes from day one.

- Containerized with Docker (multi-stage builds)
- Deployed via Kubernetes manifests or Helm charts
- Service mesh with Dapr (state management, pub/sub, service invocation)
- Event-driven with Kafka on Kubernetes
- No infrastructure lock-in (works on Minikube, DOKS, GKE, AKS)

### IV. Event-Driven Microservices

**Services are Stateless and Event-Driven** - No in-memory state; all state in database or Dapr state store.

**Event Topics** (Kafka):
- `learning.*` - Learning progress updates
- `code.*` - Code submission events
- `exercise.*` - Exercise generation and grading
- `struggle.*` - Struggle detection alerts

**State Management**:
- All microservices are stateless
- Conversation state from database
- Tenant isolation with proper auth
- Dapr state store for caching

### V. Test-First Development (NON-NEGOTIABLE)

**TDD is Mandatory** - Tests written before implementation.

- Red-Green-Refactor cycle strictly enforced
- pytest for backend (FastAPI)
- Jest/Playwright for frontend (Next.js)
- Integration tests for service communication
- E2E tests for critical user flows

**Testing Gates**:
- No code without tests
- All tests must pass before commit
- Coverage metrics monitored
- Performance tests for critical paths

### VI. Spec-Kit Plus Governance

**Specs Drive Implementation** - All features follow Spec-Kit Plus workflow.

1. `/sp.specify` - Create feature specification (business-focused, no implementation details)
2. `/sp.plan` - Generate implementation plan (technical design)
3. `/sp.tasks` - Break down into actionable tasks
4. `/sp.implement` - Execute implementation
5. `/sp.analyze` - Validate cross-artifact consistency

**Spec Quality Rules**:
- Specifications are technology-agnostic (no framework names in specs)
- Requirements are testable and unambiguous
- Success criteria are measurable (time, percentage, count)
- Maximum 3 [NEEDS CLARIFICATION] markers per spec

### VII. Conventional Commits (NON-NEGOTIABLE)

**Git Commits Follow Conventional Commits Specification**:

```
<type>(<scope>): <description>

# Types:
feat     - New feature
fix      - Bug fix
docs     - Documentation
style    - Code style
refactor - Refactoring
test     - Tests
chore    - Maintenance
```

**Git Workflow**:
- Feature branches: `###-feature-name`
- Pull requests required for main branch
- Automated tests run on all PRs
- Code review required before merge

### VIII. Observability & Documentation

**All Services are Observable** - Logging, metrics, and tracing from day one.

- Structured logging (JSON format)
- Prometheus metrics for critical operations
- Distributed tracing for service communication
- Health checks for all services
- Docusaurus documentation for all Skills

**Documentation Requirements**:
- AGENTS.md generated and up-to-date
- All Skills have SKILL.md and REFERENCE.md
- API documentation auto-generated from OpenAPI
- Architecture decision records (ADRs) for significant choices

---

## Technology Stack Constraints

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **API**: RESTful with OpenAPI specification
- **Auth**: JWT (stateless tokens)
- **Service Mesh**: Dapr (required for all microservices)
- **Messaging**: Kafka on Kubernetes
- **Database**: PostgreSQL (Neon for cloud)

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Editor**: Monaco (embedded code editor)

### Infrastructure
- **Containers**: Docker (multi-stage builds required)
- **Orchestration**: Kubernetes (Minikube for local, DOKS/GKE/AKS for cloud)
- **Package Manager**: Helm 3+
- **CI/CD**: GitHub Actions + Argo CD (GitOps)

---

## Development Workflow

### 1. Planning Phase (MANDATORY for complex features)
Use EnterPlanMode when:
- New feature implementation with multiple approaches
- Multi-file changes (> 3 files)
- Architectural decisions required
- User preferences matter

### 2. Testing First (MANDATORY)
Before ANY implementation:
1. Review existing tests
2. Write test first (TDD approach)
3. Run tests to establish baseline
4. Implement feature to make tests pass
5. Verify all tests pass

### 3. Git Workflow (MANDATORY)
After EVERY task completion:
1. Review changes: `git status`
2. Stage files: `git add`
3. Commit with conventional format
4. Push to main branch
5. Verify commit appears in git log

---

## Quality Gates

### Pre-Commit
- All tests pass
- Code formatted (Black for Python, Prettier for TypeScript)
- Linting passes (ESLint, Ruff)
- No [NEEDS CLARIFICATION] markers in code

### Pre-Merge
- At least one code review approval
- All CI checks pass
- Coverage threshold met (backend: 80%, frontend: 70%)
- Documentation updated
- Skills validated for token efficiency

### Pre-Deploy
- Integration tests pass
- E2E tests pass for critical flows
- Performance benchmarks met
- Security scan passes
- Rollback plan documented

---

## Governance

### Amendment Process
1. Proposal via GitHub issue
2. Discussion with team consensus
3. Update constitution with version bump
4. Migration plan for existing code
5. Retire old practices gracefully

### Constitution Authority
- This constitution is **non-negotiable** within project scope
- All specs, plans, and tasks MUST comply
- Conflicts require adjusting artifacts, not ignoring principles
- Principle changes require explicit amendment (see Amendment Process)

### Escalation Path
1. Agent disagreement → Lead Engineer decision
2. Technical blockers → Architect decision
3. Constitution conflicts → Project Lead decision
4. Process improvements → Team consensus

---

## Success Metrics

### Skill Quality
- Token efficiency: >80% reduction vs direct MCP
- Cross-agent compatibility: Works on Claude Code + Goose
- Execution success: >95% of skill invocations succeed

### Development Velocity
- Feature lead time: <2 days from spec to implementation
- Test coverage: >80% backend, >70% frontend
- Build time: <5 minutes for full CI/CD pipeline

### System Reliability
- Uptime: >99% for all services
- Response time: p95 <500ms for API calls
- Error rate: <0.1% for all endpoints

---

**Version**: 1.0.0 | **Ratified**: 2025-01-26 | **Last Amended**: 2025-01-26
