# Phase 6: Integration (MCP Servers) Specification

**Status**: Draft
**Phase**: 6
**Focus**: Model Context Protocol servers for real-time AI agent context

---

## Overview

Build Model Context Protocol (MCP) servers that give AI agents real-time access to LearnFlow platform data. MCP servers provide:

- **Database Access**: Real-time student progress, code submissions, exercise history
- **Kafka Events**: Subscribe to learning events, struggle alerts
- **Kubernetes Operations**: Query pod status, service health, logs
- **Code Execution**: Execute student code in sandboxed environment

Following the **MCP Code Execution Pattern**, these servers expose tools that AI agents can call, with efficient token usage through script-based execution.

### What This Phase Delivers

Four independent MCP servers that:
1. Accept tool calls from AI agents via MCP protocol
2. Execute database queries to retrieve real-time data
3. Subscribe to Kafka topics for event streaming
4. Interact with Kubernetes for operational data
5. Execute Python code in isolated sandbox environment
6. Return minimal results to minimize token usage

---

## Success Criteria

**Measurable Outcomes** (technology-agnostic):

- [ ] All 4 MCP servers respond to health checks within 1 second
- [ ] AI agents can query student progress in real-time
- [ ] Code execution sandbox completes within 5 seconds timeout
- [ ] Kafka event subscription delivers events within 1 second
- [ ] Kubernetes operations queries return accurate status
- [ ] Token efficiency validated (<500 tokens per AI session)
- [ ] Zero manual intervention - autonomous deployment via Skills

---

## User Stories

### P1: AI Agent Accesses Student Progress

**As an** AI agent tutoring a student
**I want** to access the student's current progress in real-time
**So that** I can provide personalized guidance based on their mastery level

**Acceptance Criteria**:
- [ ] Given a student ID, the system returns their progress data
- [ ] Given the student has 68% mastery, the system returns correct level
- [ ] Given the student is on day 3 of their streak, this is reflected
- [ ] Query completes within 500ms

**Data Returned**:
- Overall mastery percentage
- Per-module mastery levels
- Recent exercise attempts
- Current learning streak

---

### P1: AI Agent Retrieves Code Submissions

**As an** AI agent helping debug code
**I want** to see the student's recent code submissions
**So that** I can identify patterns in their mistakes

**Acceptance Criteria**:
- [ ] Given a student ID, the system returns recent submissions
- [ ] Given the limit is 10, only 10 most recent are returned
- [ ] Code content includes error messages when present
- [ ] Submissions are ordered by timestamp (newest first)

---

### P1: AI Agent Subscribes to Learning Events

**As an** AI agent tracking student activity
**I want** to receive real-time updates when events occur
**So that** I can respond immediately to student actions

**Acceptance Criteria**:
- [ ] Given a student completes an exercise, the agent receives an event
- [ ] Given a student triggers a struggle alert, the agent receives an event
- [ ] Events are delivered within 1 second of occurrence
- [ ] Multiple agents can subscribe to the same events

---

### P2: AI Agent Executes Student Code

**As an** AI agent providing coding feedback
**I want** to safely execute Python code to test it
**So that** I can verify code works before telling the student

**Acceptance Criteria**:
- [ ] Given valid Python code, execution completes and returns output
- [ ] Given code has errors, execution returns error message
- [ ] Code execution times out after 5 seconds
- [ ] Code cannot access file system (except temp)
- [ ] Code cannot access network

**Sandbox Constraints**:
- Memory limit: 50MB
- Timeout: 5 seconds
- No network access
- Temp directory only for file I/O

---

### P2: AI Agent Queries Kubernetes Status

**As** an AI agent monitoring system health
**I want** to check if services are running
**So that** I can report issues to teachers

**Acceptance Criteria**:
- [ ] Given a query for pod status, the system returns accurate data
- [ ] Given a service is down, the system returns the error
- [ ] Queries complete within 1 second
- [ ] Logs can be retrieved for debugging

---

### P3: AI Agent Publishes Events

**As** an AI agent processing student actions
**I want** to publish events to the event stream
**So that** other agents can react to them

**Acceptance Criteria**:
- [ ] Given an exercise is completed, an event is published
- [ ] Given a struggle is detected, an alert event is published
- [ ] Event publishing succeeds even if some subscribers are down
- [ ] Events include relevant context data

---

## Functional Requirements

### FR-1: MCP Protocol Compliance

Servers must implement the MCP protocol:
- STDIO transport for local communication
- HTTP/SSE transport for remote communication
- Tool definitions with schema validation
- Error responses with helpful messages
- Resource cleanup on disconnect

### FR-2: Database Access

MCP Database Server provides tools for:
- Querying student progress (by student ID, module, topic)
- Retrieving code submissions (by student ID, limit)
- Fetching exercise history (by exercise ID, student)
- Getting conversation history (by conversation ID)
- Creating/updating data (with proper authorization)

### FR-3: Kafka Integration

MCP Kafka Server provides tools for:
- Publishing events to topics
- Subscribing to topics
- Listing available topics
- Getting topic statistics

### FR-4: Kubernetes Operations

MCP K8s Server provides tools for:
- Listing pods and services
- Checking pod status
- Retrieving pod logs
- Checking service health
- Describing resources

### FR-5: Code Execution

MCP Code Execution Server provides:
- Python code execution (Python 3.11+)
- Sandbox constraints (timeout, memory, no network)
- Output and error capture
- Security restrictions (no file system, no network)

---

## Non-Functional Requirements

### NFR-1: Performance

- Tool execution: <500ms average
- Database queries: <200ms average
- Code execution: completes within 5s timeout
- Event delivery: <1 second after occurrence

### NFR-2: Scalability

- Servers handle 10+ concurrent tool calls
- Database connection pooling efficient
- Event subscribers can scale independently
- Code execution can queue requests

### NFR-3: Reliability

- Servers restart gracefully if they crash
- Failed tool calls return error responses
- Event subscribers reconnect automatically
- Code execution timeouts don't crash server

### NFR-4: Security

- Database connections use credentials from secrets
- Only authorized tools can write data
- Code execution sandbox cannot escape
- Kubernetes queries respect RBAC

### NFR-5: Observability

- Structured logging for all tool calls
- Metrics for request count, latency, errors
- Health check endpoints for all servers

---

## Data Requirements

### MCP Tool Definitions

Each server exposes tools with:
- **name**: Unique tool identifier
- **description**: What the tool does
- **inputSchema**: JSON Schema for parameters
- **outputSchema**: JSON Schema for response

### Server Configuration

| Server | Port | Transport | Tools |
|--------|------|-----------|-------|
| **Database** | 3001 | stdio, SSE | 5 tools (get_progress, get_submissions, get_exercise, get_conversation, update_progress) |
| **Kafka** | 3002 | stdio, SSE | 4 tools (publish, subscribe, list_topics, get_stats) |
| **K8s** | 3003 | stdio, SSE | 5 tools (list_pods, get_pod_status, get_logs, check_health, describe) |
| **Code Execution** | 3004 | stdio, SSE | 2 tools (execute_code, validate_syntax) |

---

## Out of Scope

This phase does NOT include:
- Backend service implementation (see Phase 4)
- Frontend implementation (see Phase 5)
- Database schema creation
- Kafka topic creation
- Kubernetes cluster setup

---

## Assumptions

1. PostgreSQL database is deployed and accessible
2. Kafka is running with required topics
3. Kubernetes cluster is operational
4. Python 3.11+ is available for code execution
5. Network policies allow MCP server communication

---

## Constraints

1. MCP servers must follow MCP Code Execution pattern (script-based execution)
2. Token efficiency is critical (<500 tokens per session)
3. Code execution must be secure (no sandbox escape)
4. Cross-agent compatibility (Claude Code and Goose)
5. Servers deploy autonomously via Skills

---

## Edge Cases

1. **Database Connection Lost**: Return error, attempt reconnection, show cached data if available
2. **Kafka Connection Lost**: Queue events, attempt reconnection, alert on data loss
3. **Code Execution Timeout**: Kill process, return timeout error, log code for analysis
4. **Kubernetes API Unavailable**: Return cached data if available, show error
5. **Malformed Tool Input**: Return validation error with specific issue
6. **Concurrent Code Execution**: Queue requests, execute serially or in parallel pools
7. **Large Query Results**: Paginate results, return summary with count
8. **Event Subscriber Overload**: Alert on high lag, suggest scaling

---

## Dependencies

### Internal Dependencies
- Phase 3: Infrastructure (Kafka, PostgreSQL deployed)
- Phase 4: Backend Services (API endpoints available)

### External Dependencies
- Python 3.11+ runtime
- PostgreSQL client library
- Kafka client library
- Kubernetes client library

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Database query performance | Medium | Connection pooling, query optimization, result caching |
| Kafka consumer lag | High | Alert on lag, suggest scaling, implement backpressure |
| Code execution security | High | Container isolation, resource limits, no network |
| Token efficiency | High | Script-based execution, minimal output, lazy loading |
| MCP protocol version | Low | Version compatibility check, graceful degradation |

---

## Glossary

| Term | Definition |
|------|------------|
| **MCP** | Model Context Protocol - standard for AI agent data access |
| **Tool** | Function exposed by MCP server for AI agents to call |
| **Transport** | Communication method (stdio for local, SSE for remote) |
| **Sandbox** | Isolated execution environment with restrictions |
| **Subscription** | Connection to Kafka topic to receive events |

---

## References

- Hackathon3.md: Complete project requirements
- Phase 4 spec: Backend service APIs
- MCP Code Execution Pattern: Token optimization strategy
