# Phase 4: Backend Services Specification

**Status**: Draft
**Phase**: 4
**Focus**: Backend microservices for LearnFlow multi-agent learning platform

---

## Overview

Build the backend services that power the LearnFlow multi-agent learning platform. These services enable conversational AI tutoring for Python learning through:
- **Intelligent Query Routing**: Direct student questions to appropriate specialist agents
- **Concept Explanation**: Adaptive explanations based on student mastery level
- **Error Analysis**: Parse errors and provide progressive hints
- **Exercise Generation**: Auto-graded coding challenges with hints
- **Progress Tracking**: Calculate mastery scores and learning streaks
- **Code Review**: Analyze code for correctness, style, efficiency, and readability

### What This Phase Delivers

Six independent microservices that can:
1. Accept student queries via REST APIs
2. Communicate with each other for service orchestration
3. Publish/subscribe to events for asynchronous processing
4. Maintain state through external data stores
5. Scale independently based on load

---

## Success Criteria

**Measurable Outcomes** (technology-agnostic):

- [ ] All six services respond to health checks within 1 second
- [ ] Services can invoke each other without hard-coded dependencies
- [ ] Events published by one service are received by subscribers within 2 seconds
- [ ] Student data persists across service restarts
- [ ] Services handle 100 concurrent requests with <500ms average response time
- [ ] Zero-downtime deployment possible (rolling updates supported)
- [ ] Services deploy autonomously using defined Skills

---

## User Stories

### P1: Student Query Routing

**As a** student learning Python
**I want** my questions to be automatically routed to the right specialist
**So that** I get relevant help without manually selecting the assistance type

**Acceptance Criteria**:
- [ ] Given a student query, the system identifies if it's about concepts, debugging, or exercises
- [ ] Query is routed to appropriate specialist service
- [ ] Routing decision completes within 500ms
- [ ] System logs routing decisions for analytics

**Notes**:
- "explain", "what is", "how does" → Concepts Agent
- "error", "bug", "not working" → Debug Agent
- "exercise", "practice", "challenge" → Exercise Agent

---

### P1: Adaptive Concept Explanations

**As a** student
**I want** explanations that match my current understanding level
**So that** I'm not overwhelmed by too-advanced or too-simple content

**Acceptance Criteria**:
- [ ] Given a concept request, system retrieves student's mastery level
- [ ] Explanation complexity adjusts based on mastery (Beginner/Learning/Proficient/Mastered)
- [ ] System provides code examples relevant to the concept
- [ ] Topics covered align with 8-module Python curriculum

**Mastery Level Definitions**:
- **Beginner (0-40%)**: Simple language, minimal jargon, basic examples
- **Learning (41-70%)**: Standard explanations, some terminology
- **Proficient (71-90%)**: Concise explanations, technical terms
- **Mastered (91-100%)**: Advanced concepts, edge cases, best practices

---

### P1: Progressive Debugging Hints

**As a** student encountering an error
**I want** hints that guide me to the solution without giving the answer
**So that** I learn debugging skills through practice

**Acceptance Criteria**:
- [ ] Given code with error, system identifies error type and location
- [ ] System provides progressive hints (not direct solutions)
- [ ] Each hint brings student closer to solution
- [ ] System detects repeated errors (same type 3+ times) and alerts teacher

**Hint Progression**:
1. First hint: Error category and general area
2. Second hint: Specific line or concept issue
3. Third hint: Concrete suggestion (but not solution)

---

### P1: Auto-Graded Exercises

**As a** student
**I want** immediate feedback on coding exercises
**So that** I know if I understand the concept and can correct mistakes

**Acceptance Criteria**:
- [ ] Given exercise request, system generates appropriate challenge
- [ ] Exercise difficulty matches student's current module and mastery
- [ ] Submission is auto-graded against test cases
- [ ] Feedback includes pass/fail status and hints
- [ ] Completed exercises update progress tracking

**Exercise Generation**:
- 120+ exercises across 8 modules
- Multiple difficulty levels per concept
- Test cases validate correctness
- Hints available on request

---

### P2: Mastery Progress Tracking

**As a** student
**I want** to see my overall progress and mastery levels
**So that** I know what I've learned and what to focus on next

**Acceptance Criteria**:
- [ ] System calculates mastery score per topic using weighted formula
- [ ] Mastery level displayed (Beginner/Learning/Proficient/Mastered)
- [ ] Progress updates after each activity (exercise, quiz, code submission)
- [ ] Streak tracking for consistency (days active in last 30 days)

**Mastery Formula**:
- Exercise completion: 40%
- Quiz scores: 30%
- Code quality ratings: 20%
- Consistency (streak): 10%

---

### P2: Code Quality Analysis

**As a** student
**I want** feedback on my code quality beyond just correctness
**So that** I learn to write clean, maintainable Python

**Acceptance Criteria**:
- [ ] Given code submission, system analyzes for correctness
- [ ] System checks style compliance (PEP 8)
- [ ] System assesses efficiency (time/space complexity)
- [ ] System evaluates readability (naming, comments, structure)
- [ ] Overall quality score (0-100) provided with breakdown

**Quality Metrics**:
- Correctness: Code runs without errors
- Style: Follows PEP 8 conventions
- Efficiency: Appropriate for problem size
- Readability: Clear names and structure

---

### P3: Struggle Detection

**As a** teacher
**I want** alerts when students are struggling
**So that** I can provide targeted help before they give up

**Acceptance Criteria**:
- [ ] System detects struggle triggers (same error 3+ times, stuck >10 min, quiz <50%)
- [ ] Alert includes student ID, topic, and struggle type
- [ ] Teacher dashboard shows active struggles
- [ ] System allows teacher to assign remedial exercises

**Struggle Triggers**:
- Same error type 3+ times
- Stuck on exercise > 10 minutes
- Quiz score < 50%
- Student says "I don't understand" or "I'm stuck"
- 5+ failed code executions in a row

---

## Functional Requirements

### FR-1: Service Communication

Services must communicate without hard-coded dependencies:
- Services discover each other through a service registry
- Communication happens through standardized protocols
- Failed service calls retry with exponential backoff
- Circuit breakers prevent cascading failures

### FR-2: Event Streaming

Services publish domain events for asynchronous processing:
- `learning.*` events for learning activities
- `code.*` events for code submissions
- `exercise.*` events for exercise attempts
- `struggle.*` events for struggle detection

### FR-3: State Management

Services maintain no in-memory state:
- All persistent data stored externally
- Session state retrieved on each request
- Conversation history stored per student
- Services are horizontally scalable

### FR-4: API Contract

Each service exposes a consistent API:
- Health check endpoint for monitoring
- Standardized request/response formats
- Error responses with helpful messages
- API documentation auto-generated

### FR-5: AI Agent Integration

Services integrate with AI models for intelligence:
- Agent prompts separate from business logic
- Model provider configurable (OpenAI, local, etc.)
- Rate limiting for API calls
- Fallback behavior when AI unavailable

---

## Non-Functional Requirements

### NFR-1: Performance

- API response time: <500ms (p95)
- Event processing latency: <2 seconds
- Concurrent request handling: 100+ simultaneous users
- Service startup time: <30 seconds

### NFR-2: Scalability

- Services scale horizontally (add instances)
- Statelessness enables any instance to handle any request
- Database connections pooled efficiently
- Event consumers can scale independently

### NFR-3: Reliability

- Services health-check every 10 seconds
- Failed requests retry up to 3 times
- Graceful degradation when dependencies unavailable
- No single point of failure

### NFR-4: Observability

- Structured logging with correlation IDs
- Metrics for request count, latency, errors
- Distributed tracing for service calls
- Alert on error rates >5%

### NFR-5: Security

- Authentication required for all student/teacher endpoints
- Authorization checks for teacher-only features
- Secrets stored securely (not in code/environment variables)
- Input validation and sanitization

---

## Data Requirements

### Student Data

- Unique identifier (UUID)
- Name and email
- Role (student/teacher)
- Current progress per topic
- Learning streak

### Progress Data

- Student ID
- Topic/module reference
- Mastery score (0-100)
- Mastery level (Beginner/Learning/Proficient/Mastered)
- Last updated timestamp

### Exercise Data

- Unique identifier
- Module and topic reference
- Difficulty level
- Test cases for validation
- Hint progression

### Submission Data

- Student ID
- Exercise ID
- Code submission
- Result (pass/fail)
- Timestamp
- Hints requested

### Conversation Data

- Student ID
- Messages (JSON array)
- Associated topic
- Timestamp

---

## Out of Scope

This phase does NOT include:
- Frontend implementation (see Phase 5)
- Database migrations (handled in setup)
- Authentication service (assumed external)
- Container orchestration setup (assumed existing)
- CI/CD pipelines

---

## Assumptions

1. Container orchestration platform is available (Kubernetes-compatible)
2. Message broker is deployed and accessible
3. Database is provisioned with required schemas
4. Authentication service provides user identity
5. Service registry or discovery mechanism exists
6. AI model API is accessible with valid credentials

---

## Constraints

1. Services must use async patterns for I/O operations
2. No hard-coded service URLs or dependencies
3. All state stored externally (no in-memory session state)
4. Services must be deployable via Skills (autonomous deployment)
5. Cross-agent compatibility (Claude Code and Goose)

---

## Edge Cases

1. **AI Service Unavailable**: Return cached response or graceful degradation
2. **Database Connection Lost**: Retry with backoff, return cached data if available
3. **Event Publishing Failure**: Log to dead-letter queue for replay
4. **Malformed Input**: Return validation error with specific issue
5. **Concurrent Updates**: Use optimistic locking or last-write-wins with timestamp
6. **Long-Running Operations**: Return immediately, process asynchronously, notify via event
7. **Struggle Detection Storm**: Rate-limit alerts to avoid notification spam
8. **Exercise Generation Fails**: Return pre-defined fallback exercise

---

## Dependencies

### Internal Dependencies
- Phase 3: Infrastructure (Kafka, PostgreSQL deployed)
- Phase 2: Foundation Skills (skills for deployment exist)

### External Dependencies
- AI model API (OpenAI-compatible)
- Authentication provider
- Monitoring/observability platform

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI API rate limits | High | Implement caching, fallback to local models |
| Event delivery delays | Medium | Monitor lag, alert on threshold, replay failed events |
| Database performance | Medium | Connection pooling, query optimization, caching |
| Service discovery failure | High | Hardcode fallback URLs for critical services |

---

## Glossary

| Term | Definition |
|------|------------|
| **Agent** | AI-powered service that handles specific tutoring tasks |
| **Mastery** | Measure of student proficiency (0-100%) |
| **Sidecar** | Companion process that handles cross-cutting concerns |
| **Event** | Message published when something of interest happens |
| **Service Mesh** | Infrastructure layer that handles service-to-service communication |
| **Stateless** | Service maintains no session data between requests |

---

## References

- Hackathon3.md: Complete project requirements
- Phase 3 spec: Infrastructure deployment details
- MCP Code Execution Pattern: Token optimization strategy
