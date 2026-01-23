# Phase 7: LearnFlow Autonomous Build Specification

**Status**: Draft
**Phase**: 7
**Focus**: Assemble complete LearnFlow application using AI agents and Skills

---

## Overview

This is the **culmination phase** where all components from Phases 1-6 are assembled into a working LearnFlow application. The key principle is:

> **DO NOT write application code manually. Use Skills to teach AI agents to build it autonomously.**

The application will be built entirely by AI agents using the Skills created in previous phases.

### What This Phase Delivers

A fully assembled LearnFlow application that:
1. Has all 6 backend services deployed and communicating
2. Has frontend with code editor and chat interface
3. Has all 4 MCP servers providing real-time data access
4. Demonstrates Skills-based autonomous deployment
5. Works with both Claude Code and Goose (cross-agent compatibility)

---

## Success Criteria

**Measurable Outcomes** (technology-agnostic):

- [ ] All services deployed and responding to health checks
- [ ] Student personas can complete learning flows
- [ ] Teacher portal displays class analytics
- [ ] Git history shows agentic workflow (Skill-based commits)
- [ ] Application built using both Claude Code and Goose
- [ ] Multi-agent system operational (Triage → Concepts/Debug/Exercise)

---

## User Stories

### P1: Student Learns Python

**As a** student named Maya
**I want** to learn about Python loops through the platform
**So that** I can practice coding with AI help

**Acceptance Criteria**:
- [ ] Given I log in, I see my dashboard with progress
- [ ] Given I ask "How do for loops work?", I get an explanation
- [ ] Given I complete an exercise on loops, my mastery increases
- [ ] Given I make an error, I get hints (not solutions)

**Persona: Maya**
- Goal: Learn Python for loops
- Current mastery: 60% → Target: 68%
- Flow: Login → Dashboard → Chat → Exercise → Progress

---

### P1: Student Gets Help Debugging

**As a** student named James
**I want** help when stuck on list comprehensions
**So that** I can understand the concept

**Acceptance Criteria**:
- [ ] Given I submit incorrect code 3 times, I get struggle alert
- [ ] Given I'm stuck, the Debug Agent provides progressive hints
- [ ] Given my teacher sees the alert, they assign an easier exercise
- [ ] Given I complete the easier exercise, my mastery improves

**Persona: James**
- Issue: List comprehensions (3 wrong answers)
- Detection: Struggle alert sent to teacher
- Resolution: Teacher generates easy exercise → James completes

---

### P2: Teacher Monitors Class

**As a** teacher named Mr. Rodriguez
**I want** to view my class's struggles
**So that** I can provide targeted help

**Acceptance Criteria**:
- [ ] Given I log in as teacher, I see my dashboard
- [ ] Given students are struggling, I see alerts
- [ ] Given I click "Generate Exercise", I can create custom exercises
- [ ] Given I assign an exercise, the student sees it

---

### P2: AI Agent Orchestrates Flow

**As an** AI agent using the Skills
**I want** to build the entire application autonomously
**So that** I demonstrate agentic AI capabilities

**Acceptance Criteria**:
- [ ] Given I invoke `kafka-k8s-setup` skill, Kafka deploys
- [ ] Given I invoke `postgres-k8s-setup` skill, PostgreSQL deploys
- [ ] Given I invoke `fastapi-dapr-agent` skill 6 times, all services deploy
- [ ] Given I invoke `mcp-code-execution` skill 4 times, all MCP servers deploy
- [ ] Given I invoke `nextjs-k8s-deploy` skill, frontend deploys
- [ ] All deployments succeed with single command

---

## Functional Requirements

### FR-1: Skills-Based Deployment

All components must deploy via Skills:
- `kafka-k8s-setup`: Deploy Kafka on Kubernetes
- `postgres-k8s-setup`: Deploy PostgreSQL on Kubernetes
- `fastapi-dapr-agent`: Generate FastAPI + Dapr microservices
- `mcp-code-execution`: Generate MCP servers with code execution
- `nextjs-k8s-deploy`: Deploy Next.js frontend

### FR-2: Multi-Agent Coordination

AI agents must coordinate via:
- Triage agent routes queries to specialists
- Events published to Kafka for async processing
- Dapr state management for shared data
- MCP servers provide real-time context

### FR-3: Student Learning Flow

Complete learning flow must work:
1. Login → Dashboard (view progress)
2. Chat → Ask question → Get explanation
3. Exercise → Write code → Run → Submit
4. Progress → Mastery updates

### FR-4: Teacher Monitoring Flow

Teacher workflow must work:
1. Login → Dashboard (view class)
2. View struggles → Identify students
3. Generate exercise → Assign to student
4. Monitor → View updated progress

---

## Non-Functional Requirements

### NFR-1: Token Efficiency

- MCP Code Execution pattern validated
- <500 tokens per AI agent session
- Scripts executed (not loaded into context)

### NFR-2: Cross-Agent Compatibility

- Skills work with Claude Code
- Skills work with Goose
- Same results from both agents

### NFR-3: Git History Quality

- Commits follow agentic workflow
- Commit messages reference Skills used
- History shows autonomous build process

---

## Out of Scope

This phase does NOT include:
- Writing application code manually
- Creating new Skills (use existing from Phases 1-6)
- Cloud deployment (see Phase 9)
- CI/CD automation (see Phase 10)

---

## Dependencies

### Internal Dependencies
- Phases 1-6: All Skills and components available

### External Dependencies
- Claude Code or Goose access
- Kubernetes cluster (Minikube or cloud)
- Container registry

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Skill execution fails | High | Test Skills independently first |
| Token limits exceeded | Medium | Use MCP Code Execution pattern |
| Service dependency issues | Medium | Deploy in correct order (infrastructure → services) |
| Cross-agent incompatibility | High | Test with both Claude Code and Goose |

---

## Glossary

| Term | Definition |
|------|------------|
| **Skills** | Reusable AI agent instructions for autonomous tasks |
| **Agentic Workflow** | AI agents performing complex tasks autonomously |
| **Cross-Agent Compatibility** | Skills work on multiple AI platforms |

---

## References

- Hackathon3.md: Complete project requirements
- AGENTS.md: Build instructions for learnflow-app
