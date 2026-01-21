# Phase 6: Integration (MCP Servers) - Tasks

**Phase**: 6
**Focus**: Create MCP servers for real-time AI agent context

---

## Task Breakdown

### Category 1: Prerequisites

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 6.1.1 | Verify backend services running | Pending | Phase 4 services |
| 6.1.2 | Verify PostgreSQL accessible | Pending | Connection test |
| 6.1.3 | Verify Kafka accessible | Pending | Connection test |
| 6.1.4 | Install MCP Python SDK | Pending | `pip install mcp` |
| 6.1.5 | Verify `mcp-code-execution` skill exists | Pending | Check `.claude/skills/` |

---

### Category 2: MCP Database Server

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 6.2.1 | Generate mcp-database-server scaffold | Pending | Use mcp-code-execution skill |
| 6.2.2 | Implement get_student_progress tool | Pending | Query student_progress table |
| 6.2.3 | Implement get_code_submissions tool | Pending | Query code_submissions table |
| 6.2.4 | Implement get_exercise_history tool | Pending | Query exercise_attempts table |
| 6.2.5 | Implement get_struggling_students tool | Pending | Aggregation query |
| 6.2.6 | Add async PostgreSQL connection pool | Pending | asyncpg |
| 6.2.7 | Add error handling and validation | Pending | All tools |
| 6.2.8 | Write tests for all tools | Pending | pytest |
| 6.2.9 | Deploy mcp-database-server | Pending | Kubernetes |
| 6.2.10 | Verify tool access | Pending | MCP client test |

---

### Category 3: MCP Kafka Server

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 6.3.1 | Generate mcp-kafka-server scaffold | Pending | Use mcp-code-execution skill |
| 6.3.2 | Implement publish_learning_event tool | Pending | Publish to topics |
| 6.3.3 | Implement subscribe_to_events tool | Pending | Kafka consumer |
| 6.3.4 | Implement get_event_history tool | Pending | Event store query |
| 6.3.5 | Implement publish_struggle_alert tool | Pending | Alert publishing |
| 6.3.6 | Add AIOKafka producer/consumer | Pending | aiokafka |
| 6.3.7 | Add event schemas | Pending | Validation |
| 6.3.8 | Write tests for all tools | Pending | pytest |
| 6.3.9 | Deploy mcp-kafka-server | Pending | Kubernetes |
| 6.3.10 | Verify pub/sub working | Pending | End-to-end test |

---

### Category 4: MCP Kubernetes Server

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 6.4.1 | Generate mcp-k8s-server scaffold | Pending | Use mcp-code-execution skill |
| 6.4.2 | Implement get_pod_status tool | Pending | kubectl get pods |
| 6.4.3 | Implement get_service_logs tool | Pending | kubectl logs |
| 6.4.4 | Implement check_service_health tool | Pending | HTTP health checks |
| 6.4.5 | Implement describe_pod tool | Pending | kubectl describe |
| 6.4.6 | Implement get_kafka_topics tool | Pending | Kafka topic list |
| 6.4.7 | Add subprocess wrappers for kubectl | Pending | Safe execution |
| 6.4.8 | Add RBAC permissions | Pending | ServiceAccount + Role |
| 6.4.9 | Write tests for all tools | Pending | pytest |
| 6.4.10 | Deploy mcp-k8s-server | Pending | Kubernetes |
| 6.4.11 | Verify k8s operations | Pending | All tools |

---

### Category 5: MCP Code Execution Server

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 6.5.1 | Generate mcp-code-execution-server scaffold | Pending | Use mcp-code-execution skill |
| 6.5.2 | Implement execute_code tool | Pending | Sandboxed execution |
| 6.5.3 | Implement test_with_test_cases tool | Pending | Auto-grading |
| 6.5.4 | Add prlimit for resource constraints | Pending | CPU, memory limits |
| 6.5.5 | Add timeout handling | Pending | 5 second default |
| 6.5.6 | Add temp file cleanup | Pending | Post-execution |
| 6.5.7 | Add security restrictions | Pending | No network, temp only |
| 6.5.8 | Write tests for all tools | Pending | pytest |
| 6.5.9 | Deploy mcp-code-execution-server | Pending | Kubernetes |
| 6.5.10 | Verify code execution | Pending | Python code test |

---

### Category 6: Kubernetes Configuration

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 6.6.1 | Create namespace for MCP servers | Pending | learnflow namespace |
| 6.6.2 | Create ServiceAccount for mcp-k8s-server | Pending | RBAC |
| 6.6.3 | Create Role for pod/logs access | Pending | RBAC |
| 6.6.4 | Create RoleBinding | Pending | RBAC |
| 6.6.5 | Create Secrets for DB credentials | Pending | MCP servers |
| 6.6.6 | Create ConfigMaps for configuration | Pending | Kafka brokers, etc. |
| 6.6.7 | Apply RBAC configuration | Pending | kubectl apply |
| 6.6.8 | Verify RBAC permissions | Pending | Test access |

---

### Category 7: Deployment

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 6.7.1 | Build Docker image for mcp-database-server | Pending | 4 images total |
| 6.7.2 | Build Docker image for mcp-kafka-server | Pending | |
| 6.7.3 | Build Docker image for mcp-k8s-server | Pending | |
| 6.7.4 | Build Docker image for mcp-code-execution-server | Pending | |
| 6.7.5 | Push all images to registry | Pending | |
| 6.7.6 | Deploy mcp-database-server | Pending | kubectl apply |
| 6.7.7 | Deploy mcp-kafka-server | Pending | kubectl apply |
| 6.7.8 | Deploy mcp-k8s-server | Pending | kubectl apply |
| 6.7.9 | Deploy mcp-code-execution-server | Pending | kubectl apply |
| 6.7.10 | Verify all pods running | Pending | kubectl get pods |

---

### Category 8: Testing

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 6.8.1 | Test mcp-database-server tools | Pending | All tools |
| 6.8.2 | Test mcp-kafka-server tools | Pending | All tools |
| 6.8.3 | Test mcp-k8s-server tools | Pending | All tools |
| 6.8.4 | Test mcp-code-execution-server tools | Pending | All tools |
| 6.8.5 | Test MCP protocol communication | Pending | Client-server |
| 6.8.6 | Test error handling | Pending | All servers |
| 6.8.7 | Test concurrent requests | Pending | Load test |
| 6.8.8 | Measure token efficiency | Pending | < 500 tokens |

---

### Category 9: Validation

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 6.9.1 | Verify all success criteria met | Pending | Check spec.md |
| 6.9.2 | Test with backend services | Pending | Integration |
| 6.9.3 | Verify event streaming | Pending | Kafka flow |
| 6.9.4 | Verify database access | Pending | Queries |
| 6.9.5 | Verify k8s operations | Pending | Pods, logs |
| 6.9.6 | Verify code execution | Pending | Sandbox |
| 6.9.7 | Check resource usage | Pending | CPU/memory |
| 6.9.8 | Document MCP tool schemas | Pending | For AI agents |

---

## Status Tracking

- **Total Tasks**: 56
- **Completed**: 0
- **In Progress**: 0
- **Pending**: 56
- **Blocked**: 0

---

## Notes

- All MCP servers follow MCP Code Execution pattern
- Token efficiency: < 500 tokens per session
- Each server exposes 4-6 tools
- stdio transport for local, SSE for remote
- Zero manual intervention - autonomous build via Skills
