---
slug: /architecture-overview
title: Architecture Overview
sidebar_position: 3
---

# System Architecture

LearnFlow follows an event-driven microservices architecture with AI agent integration.

## High-Level Architecture

```
                                    ┌─────────────────────────────────────┐
                                    │          Cloud / Local Cluster         │
                                    └─────────────────────────────────────┘
                                                         │
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Ingress Layer (NGinx/Traefik)                            │
│                        ┌─────────────────────────────────────┐                             │
│                        │           LearnFlow Frontend           │                             │
│                        │         (Next.js 15 + React)         │                             │
│                        └─────────────────────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                                         │
                    ┌─────────────────────────────────────┐
                    │          API Gateway (Optional)       │
                    │              (FastAPI)               │
                    └─────────────────────────────────────┘
                                                         │
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Backend Microservices Layer                                │
│                        ╔═════════════════════════════╗                                  │
│                        ║   Dapr Sidecar on Each Service  ║                                  │
│                        ╚═════════════════════════════╝                                  │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────────┬─────────────┐                        │
│  │ Triage  │Concepts │  Debug  │Exercise│  Progress  │ Code Review │                        │
│  │:8001   │ :8002   │ :8003   │ :8004   │  :8005     │  :8006      │                        │
│  └────┬────┴────┬────┴────┬────┴────┬────┴─────────┴────┬───────┘                        │
│       │        │        │        │        │             │                             │
│  Chat Service (:8007)                                                            │
│  └─────────────────────────────────────────────────────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                                         │
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MCP Servers Layer (AI Agent Integration)                     │
│  ┌──────────────┬───────────────┬───────────────┬────────────────┐                       │
│  │Database MCP   │Code Exec MCP  │Kafka Events  │K8s Operations│                       │
│  │:9001         │:9000          │:9002         │:9003          │                       │
│  └──────────────┴───────────────┴───────────────┴────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                                         │
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Data & Eventing Layer                                   │
│  ┌─────────────────┐                 ┌─────────────────────────────────┐                      │
│  │    PostgreSQL   │                 │            Kafka                │                      │
│  │  (Persistence)  │                 │      (Event Streaming)       │                      │
│  │  Port: 5432     │                 │  Topics:                         │                      │
│  │                  │                 │  - learning.progress            │                      │
│  │                  │                 │  - code.submission             │                      │
│  │                  │                 │  - exercise.attempt            │                      │
│  │                  │                 │  - struggle.alert              │                      │
│  └─────────────────┘                 └─────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Deep Dive

### Frontend (Next.js 15)

**Technology**: React 19, TypeScript, Tailwind CSS, Monaco Editor

**Key Pages**:
- `/` - Landing page
- `/(student)/dashboard` - Student dashboard
- `/(student)/exercise` - Code exercises
- `/(student)/chat` - AI tutor chat
- `/teacher/dashboard` - Teacher dashboard

**State Management**: Zustand with persistence

**API Integration**: Next.js API routes proxy to backend services

### Backend Services (FastAPI)

All services follow the same pattern:
- REST API with `/health` endpoint
- CORS enabled for frontend access
- Dapr client for service-to-service communication
- Kafka event publishing

#### Triage Service (Port 8001)
- Routes queries to appropriate specialist agents
- Keyword-based classification
- < 500ms response time

#### Concepts Service (Port 8002)
- Adaptive explanations based on mastery level
- 4 mastery tiers: Beginner (0-40%), Learning (41-70%), Proficient (71-90%), Mastered (91-100%)
- Code examples with explanations

#### Debug Service (Port 8003)
- Progressive hints (3 levels)
- Error pattern matching
- Struggle detection (3+ repeated errors)

#### Exercise Service (Port 8004)
- 40 exercises across 8 modules
- Auto-grading with test cases
- Integrates with MCP Code Execution

#### Progress Service (Port 8005)
- Mastery calculation (exercise 40%, quiz 30%, quality 20%, streak 10%)
- Per-module progress tracking
- Learning streak calculation
- SSE real-time updates for teachers

#### Code Review Service (Port 8006)
- PEP 8 compliance checking
- Code efficiency analysis
- Readability scoring
- Quality score (0-100)

#### Chat Service (Port 8007)
- PostgreSQL persistence for conversations
- Message history
- Conversation metadata

### MCP Servers

#### Database MCP Server (Port 9001)
**Tools**:
- `get_student_progress` - Get student progress data
- `get_exercises` - Get exercises catalog
- `submit_exercise` - Grade exercise submission
- `get_class_overview` - Teacher dashboard stats
- `get_struggle_alerts` - Students needing help

#### Code Execution MCP Server (Port 9000)
**Tools**:
- `execute_code` - Execute Python in sandbox (5s timeout, 50MB memory)
- `check_syntax` - Validate Python syntax
- `format_code` - Format with PEP 8

#### Kafka Events MCP Server (Port 9002) **NEW**
**Tools**:
- `publish_event` - Publish to Kafka topics
- `subscribe_topic` - Subscribe to topics and retrieve events
- `list_topics` - List all available topics
- `get_recent_events` - Get recent events from all topics

**Topics**:
- `learning.progress` - Concept learning events
- `code.submission` - Code review events
- `exercise.attempt` - Exercise submission events
- `struggle.alert` - Struggle detection alerts

#### Kubernetes Operations MCP Server (Port 9003) **NEW**
**Tools**:
- `get_pods` - Get all pods (optionally filtered by namespace)
- `get_services` - Get all services
- `get_pod_logs` - Get pod logs
- `get_cluster_info` - Cluster health status
- `check_service_health` - Combined health check for LearnFlow services

### Data Models

#### Student Progress
- Overall mastery percentage (weighted average)
- Per-module mastery scores
- Exercise completion count
- Learning streak (consecutive days)

#### Exercise
- ID, title, description, difficulty
- Instructions, starter code, solution
- Test cases for validation
- Hints (3 progressive levels)
- Points and module mapping

#### Struggle Alert
- Alert type (repeated_error, time_spent, low_quiz_score)
- Severity (high, medium, low)
- Context data (exercise_id, error_count, time_spent)
- Timestamp and resolution status

## Communication Patterns

### Service-to-Service (Dapr Invocation)
```python
# Triage → Concepts
await dapr.invoke_service(
    app_id="concepts-service",
    method="/chat",
    data={"student_id": "123", "message": "What is a variable?"}
)
```

### Event Publishing (Kafka)
```python
# All services publish events
await dapr.publish_event(
    topic="learning.progress",
    data={"student_id": "123", "concept": "variables", "mastery": 0.8}
)
```

### Frontend → Backend (Next.js API Routes)
```typescript
// Proxy via Next.js API route
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message, studentId })
});
```

## Security Considerations

1. **JWT Authentication**: Tokens stored in httpOnly cookies
2. **CORS**: Configured for frontend origin
3. **Input Validation**: Pydantic models validate all inputs
4. **Code Sandbox**: Resource limits (5s timeout, 50MB memory)
5. **Secrets**: Kubernetes Secret store for sensitive data

## Scalability

- **Horizontal Scaling**: Each service can be scaled independently
- **Stateless Design**: No in-memory state, enables horizontal scaling
- **Event-Driven**: Decoupled communication via Kafka
- **Resource Limits**: CPU/memory limits per container

## Monitoring

- **Health Checks**: `/health` endpoint on all services
- **Metrics**: Prometheus-compatible metrics (planned)
- **Logging**: Structured logs with correlation IDs (planned)
- **Tracing**: Distributed tracing (planned)

---

**Next**: [Backend API Reference](/backend-api) →
