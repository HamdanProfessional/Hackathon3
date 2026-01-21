# Phase 7: LearnFlow Build - Tasks

**Phase**: 7
**Focus**: Assemble and test complete LearnFlow application

---

## Task Breakdown

### Category 1: Repository Setup

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.1.1 | Create learnflow-app repository | Pending | Git init |
| 7.1.2 | Copy Skills from skills-library | Pending | .claude/skills/ |
| 7.1.3 | Create AGENTS.md | Pending | Project documentation |
| 7.1.4 | Create README.md | Pending | Project overview |
| 7.1.5 | Create .gitignore | Pending | Standard excludes |
| 7.1.6 | Initialize git repository | Pending | First commit |

---

### Category 2: Environment Setup

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.2.1 | Clean Minikube environment | Pending | minikube delete |
| 7.2.2 | Start Minikube with resources | Pending | 4 CPU, 8GB RAM |
| 7.2.3 | Verify cluster connectivity | Pending | kubectl cluster-info |
| 7.2.4 | Verify Docker available | Pending | docker --version |
| 7.2.5 | Verify Helm available | Pending | helm version |

---

### Category 3: Infrastructure Deployment

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.3.1 | Deploy Kafka using skill (Claude) | Pending | kafka-k8s-setup |
| 7.3.2 | Verify Kafka deployment | Pending | Pods running |
| 7.3.3 | Create Kafka topics | Pending | 4 topics |
| 7.3.4 | Deploy PostgreSQL using skill (Claude) | Pending | postgres-k8s-setup |
| 7.3.5 | Verify PostgreSQL deployment | Pending | Pods running |
| 7.3.6 | Run database migrations | Pending | Schema created |

---

### Category 4: Backend Services (Claude)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.4.1 | Create triage-service (Claude) | Pending | fastapi-dapr-agent |
| 7.4.2 | Create concepts-service (Claude) | Pending | fastapi-dapr-agent |
| 7.4.3 | Create debug-service (Claude) | Pending | fastapi-dapr-agent |
| 7.4.4 | Create exercise-service (Claude) | Pending | fastapi-dapr-agent |
| 7.4.5 | Create progress-service (Claude) | Pending | fastapi-dapr-agent |
| 7.4.6 | Verify all backend pods running | Pending | 5 services |
| 7.4.7 | Verify all health endpoints | Pending | All return 200 |

---

### Category 5: MCP Servers (Claude)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.5.1 | Create mcp-database-server (Claude) | Pending | mcp-code-execution |
| 7.5.2 | Create mcp-kafka-server (Claude) | Pending | mcp-code-execution |
| 7.5.3 | Create mcp-k8s-server (Claude) | Pending | mcp-code-execution |
| 7.5.4 | Create mcp-code-execution-server (Claude) | Pending | mcp-code-execution |
| 7.5.5 | Verify all MCP pods running | Pending | 4 servers |
| 7.5.6 | Test MCP tool access | Pending | All tools |

---

### Category 6: Frontend (Claude)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.6.1 | Deploy Next.js frontend (Claude) | Pending | nextjs-k8s-deploy |
| 7.6.2 | Verify frontend pod running | Pending | Pod ready |
| 7.6.3 | Configure ingress (Claude) | Pending | Domain routing |
| 7.6.4 | Verify frontend accessible | Pending | HTTP response |
| 7.6.5 | Verify Monaco Editor loaded | Pending | UI check |

---

### Category 7: Dapr Configuration

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.7.1 | Create Dapr pubsub component | Pending | Kafka |
| 7.7.2 | Create Dapr state store component | Pending | PostgreSQL |
| 7.7.3 | Apply Dapr components | Pending | kubectl apply |
| 7.7.4 | Verify Dapr sidecars running | Pending | All services |
| 7.7.5 | Test service-to-service communication | Pending | Dapr invoke |

---

### Category 8: Testing - Student Flows

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.8.1 | Test Maya: Login flow | Pending | End-to-end |
| 7.8.2 | Test Maya: View dashboard | Pending | Progress displays |
| 7.8.3 | Test Maya: Ask question | Pending | Chat response |
| 7.8.4 | Test Maya: Run code | Pending | Output displays |
| 7.8.5 | Test Maya: Complete exercise | Pending | Success |
| 7.8.6 | Test Maya: Take quiz | Pending | Score recorded |

---

### Category 9: Testing - Teacher Flows

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.9.1 | Test Teacher: Login flow | Pending | End-to-end |
| 7.9.2 | Test Teacher: View dashboard | Pending | Stats display |
| 7.9.3 | Test Teacher: View struggles | Pending | James listed |
| 7.9.4 | Test Teacher: Generate exercise | Pending | 3 exercises |
| 7.9.5 | Test Teacher: Assign to student | Pending | Notification sent |

---

### Category 10: Testing - Struggle Detection

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.10.1 | Test James: Fail exercise 3x | Pending | Same error |
| 7.10.2 | Verify struggle alert published | Pending | Kafka topic |
| 7.10.3 | Verify teacher sees alert | Pending | Dashboard |
| 7.10.4 | Test James: Complete easier exercise | Pending | Success |
| 7.10.5 | Verify struggle resolved | Pending | Alert cleared |

---

### Category 11: Testing - Event Flow

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.11.1 | Test learning.progress events | Pending | Published |
| 7.11.2 | Test code.submission events | Pending | Published |
| 7.11.3 | Test exercise.attempt events | Pending | Published |
| 7.11.4 | Test struggle.alert events | Pending | Published |
| 7.11.5 | Verify event consumption | Pending | Services receive |

---

### Category 12: Cross-Agent Test - Goose

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.12.1 | Clean environment | Pending | minikube delete |
| 7.12.2 | Start Minikube | Pending | 4 CPU, 8GB RAM |
| 7.12.3 | Build with Goose (full) | Pending | Single prompt |
| 7.12.4 | Verify Kafka deployed (Goose) | Pending | Pods running |
| 7.12.5 | Verify PostgreSQL deployed (Goose) | Pending | Pods running |
| 7.12.6 | Verify backend services (Goose) | Pending | 5 services |
| 7.12.7 | Verify MCP servers (Goose) | Pending | 4 servers |
| 7.12.8 | Verify frontend (Goose) | Pending | Accessible |
| 7.12.9 | Run smoke tests (Goose build) | Pending | All pass |

---

### Category 13: Token Efficiency

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.13.1 | Measure SKILL.md token usage | Pending | All skills |
| 7.13.2 | Measure script execution tokens | Pending | Should be 0 |
| 7.13.3 | Measure output token usage | Pending | Minimal |
| 7.13.4 | Calculate token reduction | Pending | vs direct MCP |
| 7.13.5 | Document token efficiency | Pending | Report |

---

### Category 14: Documentation

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.14.1 | Update AGENTS.md | Pending | Complete state |
| 7.14.2 | Update README.md | Pending | Build instructions |
| 7.14.3 | Create architecture diagram | Pending | Visual |
| 7.14.4 | Document API endpoints | Pending | OpenAPI |
| 7.14.5 | Document Skills used | Pending | Catalog |

---

### Category 15: Git History

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.15.1 | Review git commits | Pending | Agentic messages |
| 7.15.2 | Verify Skills referenced | Pending | In commits |
| 7.15.3 | Tag release | Pending | v1.0.0 |
| 7.15.4 | Create release notes | Pending | Summary |

---

### Category 16: Validation

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.16.1 | Verify all success criteria met | Pending | Check spec.md |
| 7.16.2 | Run full E2E test suite | Pending | All scenarios |
| 7.16.3 | Verify cross-agent compatibility | Pending | Claude + Goose |
| 7.16.4 | Verify single prompt → deployment | Pending | Autonomous |
| 7.16.5 | Create build summary | Pending | For submission |

---

## Status Tracking

- **Total Tasks**: 78
- **Completed**: 0
- **In Progress**: 0
- **Pending**: 78
- **Blocked**: 0

---

## Notes

- DO NOT write code manually
- Use Skills for all build steps
- Test with both Claude Code and Goose
- Document token efficiency
- Verify autonomous deployment
