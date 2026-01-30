# Skills Library

## Overview

The **Skills Library** is a repository of reusable Skills for building cloud-native, event-driven microservices using the MCP Code Execution Pattern. These Skills teach AI agents (Claude Code and Goose) how to autonomously build sophisticated applications.

**Project**: LearnFlow - An AI-powered Python learning platform
**Pattern**: MCP Code Execution for token efficiency (80-98% reduction)
**Agents**: Compatible with Claude Code and Goose

---

## Technology Stack

**Languages**: Python, TypeScript, JavaScript, Bash, YAML

**Frameworks & Tools**:
- **Frontend**: Next.js, Monaco Editor, React
- **Backend**: FastAPI, OpenAI SDK, Dapr
- **Infrastructure**: Kubernetes, Helm, Docker
- **Messaging**: Kafka, Redpanda
- **Database**: PostgreSQL (Neon)
- **Documentation**: Docusaurus
- **AI Agents**: Claude Code, Goose

---

## Project Structure

```
skills-library/
├── CLAUDE.md              # Project constitution and agent instructions
├── requirements.md        # Hackathon 3 requirements
├── AGENTS.md              # This file - AI agent documentation
├── specs/                 # Phase specifications
│   ├── phase-1-setup/
│   ├── phase-2-foundation/
│   └── phase-3-infrastructure/
└── .claude/
    ├── agents/           # Agent definitions
    │   ├── orchestrator.md
    │   ├── backend-specialist.md
    │   ├── frontend-specialist.md
    │   ├── cloudops-engineer.md
    │   ├── deployment-engineer.md
    │   ├── dapr-event-specialist.md
    │   ├── database-migration-specialist.md
    │   ├── spec-kit-architect.md
    │   ├── lead-engineer.md
    │   └── [more agents...]
    ├── commands/         # Spec-Kit Plus slash commands
    │   ├── sp.plan.md
    │   ├── sp.specify.md
    │   ├── sp.implement.md
    │   └── [more commands...]
    └── skills/           # Reusable Skills (MCP Code Execution pattern)
        ├── agents-md-gen/        # Generate AGENTS.md files
        ├── kafka-k8s-setup/      # Deploy Kafka on Kubernetes
        ├── postgres-k8s-setup/   # Deploy PostgreSQL on Kubernetes
        ├── fastapi-dapr-agent/   # Create FastAPI + Dapr microservices
        ├── mcp-code-execution/   # Create MCP servers
        ├── nextjs-k8s-deploy/    # Deploy Next.js apps
        ├── docusaurus-deploy/    # Deploy documentation
        └── [50+ more skills...]
```

---

## Conventions

### MCP Code Execution Pattern

All Skills follow the token-efficient pattern:

```text
.claude/skills/<skill-name>/
├── SKILL.md              # ~100 tokens - instructions only
├── REFERENCE.md          # Deep docs - loaded on-demand
└── scripts/              # Executed, never loaded into context
    ├── deploy.sh
    ├── verify.py
    └── generate.py
```

**Token Budget**:
- SKILL.md: ~100-250 tokens (keep minimal)
- REFERENCE.md: 0 tokens (loaded only when referenced)
- scripts/*: 0 tokens (executed, not loaded)
- Output: Minimal tokens (result only)

### Cross-Agent Compatibility

All Skills work with:
- **Claude Code** (primary)
- **Goose** (required for validation)
- **OpenAI Codex** (optional)

### Skill Structure

Every skill MUST have:
1. **SKILL.md** with YAML frontmatter (name, description)
2. **REFERENCE.md** with detailed documentation
3. **scripts/** directory with executable code
4. **Clear usage instructions** in Quick Start section

---

## How AI Agents Should Work

### Before Making Changes

1. **Read the specs** in `specs/` directory
2. **Understand the MCP Code Execution pattern**
3. **Check existing Skills** before creating new ones
4. **Review CLAUDE.md** for project conventions

### Implementation Guidelines

1. **Use Skills for common tasks** - Don't write code from scratch
2. **Test before implementing** - Write tests first
3. **Follow the pattern** - Keep SKILL.md minimal
4. **Validate token efficiency** - Check SKILL.md size
5. **Ensure cross-agent compatibility** - Test with both Claude and Goose

### Common Tasks

| Task | Skill to Use |
|------|--------------|
| Deploy Kafka | `kafka-k8s-setup` |
| Deploy PostgreSQL | `postgres-k8s-setup` |
| Create microservice | `fastapi-dapr-agent` |
| Create MCP server | `mcp-code-execution` |
| Deploy frontend | `nextjs-k8s-deploy` |
| Generate docs | `docusaurus-deploy` |
| Generate AGENTS.md | `agents-md-gen` |

---

## Hackathon 3 Required Skills

The following 7 Skills are required for the Hackathon:

| Skill | Status | Purpose |
|-------|--------|---------|
| `agents-md-gen` | ✓ Complete | Generate AGENTS.md files |
| `kafka-k8s-setup` | ✓ Complete | Deploy Kafka on K8s |
| `postgres-k8s-setup` | ✓ Complete | Deploy PostgreSQL on K8s |
| `fastapi-dapr-agent` | ✓ Complete | FastAPI + Dapr services |
| `mcp-code-execution` | ✓ Complete | MCP with code execution |
| `nextjs-k8s-deploy` | ✓ Complete | Deploy Next.js apps |
| `docusaurus-deploy` | ✓ Complete | Deploy documentation |

All required Skills are created and validated.

---

## LearnFlow Architecture

### Multi-Agent System

LearnFlow uses specialized AI agents for different tutoring tasks:

| Agent | Purpose | Kafka Topic |
|-------|---------|-------------|
| **Triage Agent** | Route queries to specialists | `learning.query` |
| **Concepts Agent** | Explain Python concepts | `learning.concept_request` |
| **Code Review Agent** | Analyze code quality | `code.review_request` |
| **Debug Agent** | Parse and explain errors | `code.error` |
| **Exercise Agent** | Generate coding challenges | `exercise.generate` |
| **Progress Agent** | Track mastery scores | `learning.progress_update` |

### Event-Driven Architecture

**Kafka Topics**:
- `learning.*` - Learning progress updates
- `code.*` - Code submission events
- `exercise.*` - Exercise generation and grading
- `struggle.*` - Struggle detection alerts

---

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project constitution and agent orchestration |
| `requirements.md` | Hackathon 3 requirements and evaluation criteria |
| `AGENTS.md` | This file - AI agent documentation |
| `specs/` | Phase-by-phase specifications |
| `.claude/skills/` | Reusable Skills for AI agents |

---

## Development Phases

| Phase | Status | Deliverables |
|-------|--------|--------------|
| 1. Setup | ✓ Complete | Environment, repos, cluster running |
| 2. Foundation Skills | ✓ Complete | `agents-md-gen`, `k8s-foundation` skills |
| 3. Infrastructure | ✓ Complete | Kafka + PostgreSQL deployed |
| 4. Backend Services | ✓ Complete | FastAPI + Dapr + Agent microservices |
| 5. Frontend | ✓ Complete | Next.js with Monaco editor |
| 6. Integration | ✓ Complete | MCP servers + Docusaurus |
| 7. LearnFlow Build | ✓ Complete | Complete application |
| 8. Polish & Demo | ✓ Complete | Documentation and demo |
| 9. Cloud Deployment | ✓ Complete (85%) | Deployed to DigitalOcean Kubernetes |
| 10. CI/CD | Pending | Argo CD + GitHub Actions |

**Overall Progress**: 9/10 phases complete (90%)
**Phase 9 Note**: 85% of success criteria met - LoadBalancer port 80 issue, NodePort working

---

## Testing Strategy

### Before Any Implementation
1. Review existing tests
2. Write test first (TDD)
3. Run tests to establish baseline
4. Implement to make tests pass

### Verification Scripts
- `scripts/verify-phase1.sh` - Phase 1 environment verification
- `.claude/skills/*/scripts/verify.py` - Skill-specific verification

---

## Git Workflow

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

### After Every Task
1. Review changes: `git status`
2. Stage files: `git add`
3. Commit with conventional format
4. Push to main branch

---

## Important Notes

### On Windows
All development should use **WSL2** for compatibility with Minikube, Docker, and kubectl.

### Token Optimization
Every Skill should follow MCP Code Execution pattern to minimize token usage while maintaining full capability.

### Cloud-Native Ready
This project is designed for cloud deployment (DigitalOcean, GKE, AKS) with production-ready Kubernetes configurations.

---

## Resources

- [Agentic AI Foundation (AAIF)](https://aaif.io/)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)
- [Goose Documentation](https://block.github.io/goose/)
- [MCP Documentation](https://modelcontextprotocol.io)
- [Dapr Documentation](https://dapr.io)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [MCP Code Execution Pattern](https://www.anthropic.com/engineering/code-execution-with-mcp)

---

## Contact & Submission

**Hackathon Submission**: [Google Form](https://forms.gle/Mrhf9XZsuXN4rWJf7)

**Two Repositories Required**:
1. `skills-library` (this repository) - Skills for building applications
2. `learnflow-app` - The actual LearnFlow application

**Remember**: The Skills are the product. Judges evaluate both the Skills and the application built using those Skills.
