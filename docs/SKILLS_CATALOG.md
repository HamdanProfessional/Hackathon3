# Skills Catalog

**Generated**: 2026-01-23 14:28:29
**Total Skills**: 54

---

## AI & Agents

### "agent-orchestrator"

⚠️ ~5815 tokens

"Orchestrates AI agent initialization with database context, JWT authentication, and session management. Use when wiring up new agents, implementing stateless AI workflows, or integrating agents with backend services in Phase III."

### "mcp-tool-maker"

⚠️ ~4385 tokens

"Creates MCP (Model Context Protocol) tools to expose backend functionality to AI agents. Essential for Phase III OpenAI ChatKit integration and AI-driven task management."

### agents-md-gen

✓ ~239 tokens

Generate AGENTS.md files for codebase documentation to help AI agents understand project structure and conventions. Use when user asks to generate AGENTS.md, create project documentation, or setup AI-friendly documentation.

### conversation-history-manager

⚠️ ~3120 tokens

Implement conversation history management patterns for database-backed AI chat applications with stateless agent architecture. Use when implementing: (1) Stateless AI agent context loading (no in-memory state), (2) Cursor-based conversation pagination, (3) Message history querying and filtering, (4) Soft delete patterns with audit trails, (5) Conversation metadata aggregation, (6) History archival and cleanup strategies, (7) Tenant isolation and security patterns, or (8) Performance optimization with database indexes. This skill provides SQLModel query patterns, pagination utilities, and production-ready conversation management code.

### mcp-code-execution

✓ ~157 tokens

Create MCP servers using Code Execution pattern for efficient AI integration.

### stateless-agent-enforcer

⚠️ ~3032 tokens

Validate and enforce stateless agent architecture compliance with constitutional requirements. Use when: (1) Reviewing agent code for stateless violations, (2) Running CI/CD validation for in-memory state detection, (3) Testing agent code for horizontal scaling compatibility, (4) Creating compliance tests for instance restart scenarios, (5) Documenting stateless architecture decisions in ADRs, (6) Detecting anti-patterns like unbounded caches or global state, or (7) Ensuring constitutional compliance with "NO in-memory conversation state" requirement. This skill provides static analysis tools, test templates, code review checklists, and enforcement patterns for Phase III agent development.

## Architecture

### "architecture-planner"

⚠️ ~4497 tokens

"Creates comprehensive implementation plans with component architecture, data models, API design, task breakdown, dependencies, and testing strategy. Use when planning feature implementations, designing system architecture, or breaking down complex features into actionable tasks across all development phases."

### "spec-architect"

⚠️ ~1367 tokens

"Generates Spec-Kit Plus compliant feature specifications for the Todo App. Use when designing features or creating specs following the project's spec-driven development workflow."

### phase-transition

⚠️ ~846 tokens

Guide architectural phase transitions in Evolution of TODO project. Validates current phase completion, creates migration ADRs, updates constitution, and generates transition plans. Use when Claude needs to transition between phases (CLI → Web App → AI Chatbot → Kubernetes → Cloud), validate phase readiness, or create migration strategies for architectural upgrades.

## Backend

### "backend-scaffolder"

⚠️ ~3539 tokens

"Scaffolds complete FastAPI vertical slices (Model, Schema, Router) with SQLModel, JWT auth, and pytest tests. Use for Phase II backend implementations."

### "crud-builder"

⚠️ ~4679 tokens

"Generates complete CRUD operations for data models including SQLModel schemas, FastAPI routers, Pydantic request/response models, and pytest tests. Use when scaffolding new resources, adding CRUD endpoints, or implementing standard database operations."

### "db-migration-wizard"

⚠️ ~3032 tokens

"Automates Alembic database migrations: generates migration scripts, handles schema changes, converts data types, and ensures database-code alignment. Use when database schema needs to evolve."

### "fastapi-endpoint-generator"

⚠️ ~4350 tokens

"Generates custom FastAPI endpoints with request validation, response models, error handling, and documentation. Use for non-CRUD endpoints like analytics, batch operations, complex queries, or business logic endpoints."

### fastapi-dapr-agent

✓ ~155 tokens

Create FastAPI microservices with Dapr sidecar and AI agent integration.

## Documentation

### "adr-generator"

⚠️ ~3728 tokens

"Creates Architecture Decision Records (ADRs) documenting significant architectural decisions with context, options considered, rationale, and consequences. Use when architectural decisions need formal documentation, tradeoff analysis is required, or team alignment on technical choices is needed."

### "doc-generator"

⚠️ ~4794 tokens

"Generates comprehensive documentation for APIs, components, architecture, and deployment. Creates README files, API documentation, architecture diagrams, and deployment guides. Use when documentation is missing, outdated, or needs to be created from code."

### "phr-documenter"

⚠️ ~4240 tokens

"Automates Prompt History Record (PHR) creation with proper frontmatter, routing (constitution/feature/general), metadata extraction, and validation. Use after completing user requests to document implementation work, planning sessions, debugging, or spec creation."

## Event-Driven

### "dapr-event-flow"

⚠️ ~4486 tokens

"Automates Dapr event-driven architecture: configures pub/sub components, implements event publishers, creates subscribers, and tests event flow. Use for Phase V microservices communication."

### dapr-events

⚠️ ~2408 tokens

Dapr event-driven architecture skills for pub/sub, state management, and service-to-service communication. Use when implementing event-driven microservices, configuring Dapr components, setting up Kafka/Redpanda, or creating event publishers and subscribers. Essential for Phase V cloud deployment with event streaming.

## Frontend

### "cli-builder"

⚠️ ~4603 tokens

"Builds command-line interface (CLI) applications using Click, Typer, or argparse. Creates commands, subcommands, options, arguments, and help documentation. Use when building CLI tools, scripts, or Phase I applications."

### "console-ui-builder"

⚠️ ~4688 tokens

"Builds rich, interactive console UIs using Rich, Textual, and other terminal UI libraries. Creates progress bars, tables, panels, syntax highlighting, interactive menus, and TUI applications. Use when building CLI tools that need visual polish or full terminal UIs."

### "frontend-component"

⚠️ ~3889 tokens

"Builds Next.js 16+ App Router components with TypeScript, Tailwind CSS, and proper API integration. Use for UI implementation tasks in Phase II/III."

### agent-builder

⚠️ ~614 tokens

Build AI agents using AsyncOpenAI with Google Gemini for task management chatbots. Use when Claude needs to create stateless AI agents that integrate with MCP tools for CRUD operations, manage conversation persistence, and understand natural language commands for todo management.

### mcp-builder

⚠️ ~672 tokens

Convert slash commands from .claude/commands/ into a fully functional MCP (Model Context Protocol) server using the Official MCP SDK. Use when Claude needs to create reusable spec-driven workflows across all AI development tools, or when users want to expose their custom commands as MCP prompts for use in any MCP-compatible IDE.

## Infrastructure

### "deployment-validator"

⚠️ ~4397 tokens

"Validates deployment configurations, health checks, resource limits, environment variables, and production readiness. Use after deployment to ensure services are running correctly, or before deployment to catch configuration errors."

### "k8s-deployer"

⚠️ ~2945 tokens

"Generates deployment configurations for the Todo App: Vercel deployment, Docker containers, Kubernetes manifests, and Dapr components. Use for Phase IV/V deployment tasks."

### "k8s-troubleshoot"

⚠️ ~3588 tokens

"Diagnoses and fixes Kubernetes deployment issues: pod failures, ImagePullBackOff, CrashLoopBackOff, service connectivity, resource limits, and Dapr sidecar problems."

### cloud-deployer

⚠️ ~2945 tokens

Cloud deployment automation skills for CI/CD pipelines, container registry management, and production deployments. Use when setting up GitHub Actions workflows, automating deployments to cloud platforms (DOKS/GKE/AKS), configuring build pipelines, or implementing continuous delivery. Essential for Phase V automated deployment.

### cloud-deployment

⚠️ ~922 tokens

Deploy Evolution of TODO to production cloud Kubernetes with event-driven architecture using Kafka, Dapr integration, and CI/CD pipelines. Use when Claude needs to set up cloud infrastructure on DigitalOcean/GKE/AKS, configure Kafka event streaming, implement Dapr building blocks, or create automated deployment pipelines for microservices.

### deploy-vercel

⚠️ ~473 tokens

Deploy frontend (Next.js) and backend (FastAPI) applications to Vercel with automatic environment variable configuration, build optimization, and production deployment. Use when Claude needs to: (1) Deploy a Next.js frontend to Vercel, (2) Deploy a FastAPI backend to Vercel, (3) Configure environment variables for production, (4) Handle both initial deployment and updates to existing deployments, (5) Troubleshoot common Vercel deployment issues

### docusaurus-deploy

✓ ~224 tokens

Deploy Docusaurus documentation sites with auto-generation from code and specs. Use when user asks to deploy docs, setup documentation, or generate API documentation.

### k8s-foundation

✓ ~220 tokens

Kubernetes foundation operations - namespaces, ConfigMaps, Secrets, cluster validation

### kafka-k8s-setup

✓ ~146 tokens

Deploy Apache Kafka on Kubernetes using Helm for event-driven architecture.

### kubernetes-helm

⚠️ ~2056 tokens

Kubernetes deployment and Helm chart management skills. Use when deploying applications to Kubernetes (Minikube/DOKS/GKE/AKS), creating or updating Helm charts, managing Kubernetes resources, or troubleshooting deployment issues. Includes multi-stage Docker builds, Helm 3 chart structure, Kubernetes manifests, and cloud deployment automation for the Todo App phases IV and V.

### kubernetes-setup

⚠️ ~1276 tokens

Set up complete Kubernetes environment for TODO app supporting both local Minikube development and cloud deployment (DigitalOcean DOKS, GKE, AKS). Use when Claude needs to create Kubernetes manifests, Helm charts, configure services, deploy containerized applications, or integrate AI DevOps tools like kubectl-ai and kagent.

### nextjs-k8s-deploy

✓ ~228 tokens

Deploy Next.js applications on Kubernetes with Docker and ingress configuration. Use when user asks to deploy Next.js app, setup frontend, or configure web UI deployment.

### postgres-k8s-setup

✓ ~234 tokens

Deploy PostgreSQL on Kubernetes using Helm for LearnFlow database persistence. Use when user asks to deploy PostgreSQL, setup database, or configure data persistence for the learning platform.

### vercel-deploy

⚠️ ~2050 tokens

Comprehensive Vercel deployment automation for frontend and backend applications with production optimization, error handling, validation, and rollback capabilities. Use when Claude needs to: (1) Deploy Next.js frontend applications to Vercel, (2) Deploy FastAPI/Python backend APIs to Vercel serverless functions, (3) Handle environment variable configuration and secrets management, (4) Optimize build processes and caching strategies, (5) Validate deployment readiness and troubleshoot deployment issues, (6) Perform rollback operations for failed deployments

## Other

### "api-schema-sync"

⚠️ ~4006 tokens

"Synchronizes API contracts between FastAPI backend (Pydantic) and Next.js frontend (TypeScript). Handles type conversions, validates schema alignment, and fixes integration issues."

### "cors-fixer"

⚠️ ~3624 tokens

"Diagnoses and fixes CORS (Cross-Origin Resource Sharing) errors between frontend and backend. Handles credentials mode conflicts, wildcard origins, JWT authentication, and environment-specific CORS policies."

### "monorepo-setup"

⚠️ ~3527 tokens

"Sets up and configures monorepo structure with workspace management, shared dependencies, build orchestration, and cross-package tooling. Use when initializing a new monorepo, migrating to monorepo architecture, or configuring workspace tools."

### "performance-analyzer"

⚠️ ~5266 tokens

"Analyzes application performance including API response times, database queries, frontend rendering, bundle sizes, and resource usage. Identifies bottlenecks and provides optimization recommendations. Use when performance issues arise or for proactive performance audits."

### "python-uv-setup"

⚠️ ~3381 tokens

"Sets up Python projects using uv (ultra-fast Python package manager). Configures pyproject.toml, manages virtual environments, handles dependencies, and integrates with modern Python tooling. Use when initializing Python projects or migrating from pip/poetry to uv."

### chatkit-integrator

⚠️ ~1803 tokens

Integrate OpenAI Chatkit into Next.js applications with database-backed conversation persistence. Use when implementing AI chat interfaces that require: (1) OpenAI Chatkit React components for chat UI, (2) Database-backed conversation history (PostgreSQL/Neon), (3) Stateless agent architecture with message persistence, (4) Custom backend adapter for FastAPI integration, (5) JWT-authenticated chat endpoints, (6) Real-time message updates via HTTP polling, or (7) Multi-conversation management with tenant isolation. This skill provides complete backend (FastAPI + SQLModel) and frontend (Next.js + TypeScript) integration patterns.

### git-committer

⚠️ ~1989 tokens

Enforce Conventional Commits specification for git commit messages. Use when Claude needs to create git commits, validate commit message format, set up commit hooks, or help users follow Conventional Commits standard (feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert types with optional scopes, breaking changes, and issue references). Automatically triggered when user says "make a commit", "create a conventional commit", "commit with proper format", or "enforce commit standards".

### i18n-bilingual-translator

⚠️ ~2264 tokens

Implement English/Urdu bilingual internationalization (i18n) in Next.js applications with RTL support. Use when implementing: (1) English/Urdu language switching, (2) RTL (right-to-left) layout for Urdu text, (3) Locale-based routing and middleware, (4) Translation management with next-intl, (5) Urdu typography with Noto Nastaliq font, (6) Bidirectional text handling, or (7) Language switcher UI components. This skill provides complete setup for App Router with server/client component translations, RTL styles, and production-ready bilingual support.

### monitoring-setup

⚠️ ~2971 tokens

Monitoring and observability setup skills for Prometheus, Grafana, alerting, and logging. Use when setting up application monitoring, creating dashboards, configuring alerts, implementing distributed tracing, or establishing observability for Kubernetes deployments. Essential for Phase V production monitoring.

### skill-creator

⚠️ ~4547 tokens

Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.

### skill-registry

✓ ~205 tokens

Maintain registry of all Skills with search, validation, and catalog generation

## Testing

### "e2e-tester"

⚠️ ~1747 tokens

"Creates and runs comprehensive end-to-end tests for the Evolution of TODO project. Tests complete user workflows across frontend and backend, validates API integrations, and verifies production deployments. Works with pytest, Playwright, and production testing."

### "integration-tester"

⚠️ ~4872 tokens

"Creates comprehensive integration tests for API endpoints, frontend-backend communication, database operations, and third-party services. Use when testing component interactions, E2E workflows, or validating system integration."

### console-app-tester

⚠️ ~426 tokens

Interactive testing and validation of Python console applications with Rich UI. Use when Claude needs to: (1) Test command-line interfaces (CLI) built with Rich/Click/Typer, (2) Verify console app functionality matches specifications, (3) Create automated tests for console applications, (4) Validate user input handling and error messages, (5) Test in-memory data operations

### test-generator

⚠️ ~1036 tokens

Generate comprehensive test suites for Evolution of TODO project including unit tests, integration tests, and E2E tests. Use when Claude needs to create test coverage for FastAPI backend, React frontend, MCP tools, or API endpoints based on specifications and acceptance criteria.

### test-skill

✓ ~173 tokens

Test and validate Skills by executing them and measuring token usage
