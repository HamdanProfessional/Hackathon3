# Feature Specification: Phase 4 - Backend Microservices

**Feature Branch**: `4-backend`
**Created**: 2025-01-26
**Status**: Draft
**Input**: Build six backend microservices for LearnFlow AI-powered Python learning platform with Dapr sidecars

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Receives Routed AI Tutoring (Priority: P1)

As a student learning Python, I need my questions to be automatically routed to the appropriate specialist agent so that I get relevant help without manually selecting the assistance type.

**Why this priority**: Core functionality - students cannot learn without query routing working. This is the primary value proposition.

**Independent Test**: Student sends query to triage endpoint, receives response from appropriate specialist service within 2 seconds.

**Acceptance Scenarios**:

1. **Given** a student asks "What is a variable?", **When** query is sent to triage service, **Then** response comes from concepts agent
2. **Given** a student asks "Why is my code not working?", **When** query is sent to triage service, **Then** response comes from debug agent
3. **Given** a student asks "I need more practice", **When** query is sent to triage service, **Then** response comes from exercise agent
4. **Given** a routed request, **When** specialist responds, **Then** response is appropriate to student's mastery level

---

### User Story 2 - Student Gets Adaptive Explanations (Priority: P1)

As a student, I need explanations that match my current understanding level so that I'm not overwhelmed by too-advanced or too-simple content.

**Why this priority**: Essential for personalized learning experience. Without this, platform cannot adapt to individual learners.

**Independent Test**: Students with different mastery levels receive appropriately complex explanations for the same concept.

**Acceptance Scenarios**:

1. **Given** a beginner student (20% mastery), **When** asking about variables, **Then** explanation uses simple language and basic examples
2. **Given** a proficient student (80% mastery), **When** asking about variables, **Then** explanation is concise with technical terminology
3. **Given** a student requests concept help, **When** concepts service responds, **Then** response includes code examples
4. **Given** explanation is provided, **When** student reviews it, **Then** content aligns with their module's curriculum

---

### User Story 3 - Student Receives Progressive Hints for Errors (Priority: P1)

As a student encountering an error, I need hints that guide me to the solution without giving the answer so that I learn debugging skills through practice.

**Why this priority**: Core pedagogical approach - learning through guided discovery. Without this, students don't develop problem-solving skills.

**Independent Test**: Student submits code with error, receives progressive hints that become more specific with each request.

**Acceptance Scenarios**:

1. **Given** code with a SyntaxError, **When** student requests hint, **Then** first hint identifies error category
2. **Given** first hint provided, **When** student requests another hint, **Then** second hint identifies specific line
3. **Given** second hint provided, **When** student requests final hint, **Then** third hint provides concrete suggestion
4. **Given** same error type repeated 3 times, **When** detected, **Then** struggle alert is published

---

### User Story 4 - Student Completes Auto-Graded Exercises (Priority: P1)

As a student, I need to complete coding exercises with automatic grading so that I can practice and receive immediate feedback.

**Why this priority**: Primary learning mechanism - without exercises, students cannot practice coding.

**Independent Test**: Student generates exercise, writes code, submits, and receives pass/fail feedback with score.

**Acceptance Scenarios**:

1. **Given** a student requests exercise, **When** exercise service generates, **Then** exercise includes instructions and starter code
2. **Given** an exercise, **When** student writes code and submits, **Then** service grades and returns pass/fail
3. **Given** submission passes, **When** feedback is returned, **Then** success message and score are provided
4. **Given** submission fails, **When** feedback is returned, **Then** constructive guidance is provided

---

### User Story 5 - Student Tracks Progress Over Time (Priority: P2)

As a student, I need to see my overall progress and mastery levels so that I know what I've learned and what to focus on next.

**Why this priority**: Important for motivation and learning direction, but students can still learn without tracking.

**Independent Test**: Student views dashboard showing mastery percentage, module progress, and learning streak.

**Acceptance Scenarios**:

1. **Given** a student has completed exercises, **When** progress is queried, **Then** overall mastery percentage is displayed
2. **Given** multiple modules, **When** progress is viewed, **Then** per-module mastery is shown
3. **Given** daily activity, **When** streak is calculated, **Then** consecutive days are displayed
4. **Given** new submission, **When** progress updates, **Then** mastery is recalculated

---

### User Story 6 - Developer Deploys Services Autonomously (Priority: P2)

As a developer, I need all six services to deploy autonomously using Skills so that I can demonstrate the platform's capabilities.

**Why this priority**: Important for hackathon demonstration of Skills, but services can be deployed manually if needed.

**Independent Test**: Single prompt to fastapi-dapr-agent skill deploys all six services with Dapr sidecars.

**Acceptance Scenarios**:

1. **Given** no services deployed, **When** fastapi-dapr-agent skill executes, **Then** all six services deploy
2. **Given** services deploy, **When** deployment completes, **Then** Dapr sidecars are attached
3. **Given** deployment, **When** health checks run, **Then** all services return healthy status
4. **Given** services running, **When** requests are made, **Then** services respond within SLA

---

### Edge Cases

- What happens when a specialist service is unavailable during routing?
- How does system handle concurrent requests for the same student data?
- What happens when code execution times out or exceeds resource limits?
- How does system handle student with no progress history (first-time user)?
- What happens when mastery calculation fails or returns unexpected values?
- How does system handle malformed code submissions?

---

## Requirements *(mandatory)*

### Functional Requirements

#### Service Architecture
- **FR-001**: System MUST provide six independent microservices (triage, concepts, debug, exercise, progress, code-review)
- **FR-002**: Each service MUST be stateless (no in-memory state)
- **FR-003**: Each service MUST expose REST API endpoints
- **FR-004**: Each service MUST include health check endpoint
- **FR-005**: Services MUST communicate via HTTP or service mesh
- **FR-006**: Services MUST be containerized with Docker
- **FR-007**: Services MUST deploy to Kubernetes
- **FR-008**: Services MUST have Dapr sidecar attached

#### Triage Service (Port 8001)
- **FR-009**: System MUST route queries to appropriate specialist based on keywords
- **FR-010**: System MUST classify "explain/what is/how" as concepts queries
- **FR-011**: System MUST classify "error/bug/fix" as debug queries
- **FR-012**: System MUST classify "exercise/practice/challenge" as exercise queries
- **FR-013**: System MUST return routing decision within 500ms

#### Concepts Service (Port 8002)
- **FR-014**: System MUST retrieve student mastery level before generating explanation
- **FR-015**: System MUST adjust explanation complexity based on mastery (0-40%, 41-70%, 71-90%, 91-100%)
- **FR-016**: System MUST provide code examples with explanations
- **FR-017**: System MUST align topics with Python curriculum modules

#### Debug Service (Port 8003)
- **FR-018**: System MUST parse error messages from student code
- **FR-019**: System MUST identify error type and location
- **FR-020**: System MUST provide progressive hints (3 levels)
- **FR-021**: System MUST detect repeated errors (same type 3+ times)
- **FR-022**: System MUST publish struggle alert when repeated errors detected

#### Exercise Service (Port 8004)
- **FR-023**: System MUST generate exercises from catalog or via AI
- **FR-024**: System MUST include instructions and starter code with exercise
- **FR-025**: System MUST grade submissions automatically
- **FR-026**: System MUST return pass/fail feedback
- **FR-027**: System MUST calculate and return score
- **FR-028**: System MUST provide hints on request

#### Progress Service (Port 8005)
- **FR-029**: System MUST calculate overall mastery as weighted average (exercise 40%, quiz 30%, quality 20%, streak 10%)
- **FR-030**: System MUST track per-module mastery levels
- **FR-031**: System MUST calculate learning streak (consecutive days of activity)
- **FR-032**: System MUST persist progress data to database
- **FR-033**: System MUST return progress within 500ms

#### Code Review Service (Port 8006)
- **FR-034**: System MUST analyze code for correctness
- **FR-035**: System MUST check code style (PEP 8 compliance)
- **FR-036**: System MUST evaluate code efficiency
- **FR-037**: System MUST assess code readability
- **FR-038**: System MUST provide constructive feedback

#### Event Publishing
- **FR-039**: Services MUST publish events to Kafka topics
- **FR-040**: System MUST publish learning progress events to `learning.progress` topic
- **FR-041**: System MUST publish code submission events to `code.submission` topic
- **FR-042**: System MUST publish exercise events to `exercise.attempt` topic
- **FR-043**: System MUST publish struggle alerts to `struggle.alert` topic

### Key Entities

- **Microservice**: An independent service with single responsibility (triage, concepts, debug, exercise, progress, code-review)
- **Dapr Sidecar**: A service mesh component attached to each microservice for service invocation and state management
- **Routing Decision**: The process of classifying a query and directing it to the appropriate specialist service
- **Mastery Level**: A percentage indicating student's understanding (Beginner 0-40%, Learning 41-70%, Proficient 71-90%, Mastered 91-100%)
- **Progressive Hints**: A sequence of hints that become increasingly specific (category → location → suggestion)
- **Exercise**: A coding challenge with instructions, starter code, and automated tests
- **Struggle Alert**: An event published when a student demonstrates difficulty (repeated errors, stuck time, low quiz scores)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All six services respond to health checks within 1 second
- **SC-002**: Services can invoke each other via Dapr without hard-coded dependencies
- **SC-003**: Events published to Kafka are received by subscribers within 2 seconds
- **SC-004**: Student data persists across service restarts
- **SC-005**: Services handle 100 concurrent requests with <500ms average response time
- **SC-006**: Zero-downtime deployment possible (rolling updates supported)
- **SC-007**: Services deploy autonomously using fastapi-dapr-agent skill
- **SC-008**: Triage accuracy >85% (queries routed to correct specialist)
- **SC-009**: Progressive hints become more specific with each request
- **SC-010**: Mastery calculation produces consistent results

---

## Assumptions

1. Phase 3 is complete (Kafka and PostgreSQL deployed)
2. PostgreSQL database has required tables created via migrations
3. Kafka topics are created and accessible
4. Dapr runtime is installed on Kubernetes cluster
5. Developer has Python 3.10+ and required packages installed
6. fastapi-dapr-agent skill exists and follows MCP Code Execution pattern

---

## Out of Scope

For Phase 4, the following are explicitly out of scope:

- Frontend user interface (Phase 5)
- MCP servers for AI agent integration (Phase 6)
- Database schema migrations (handled separately)
- Authentication and authorization (basic implementation only)
- OAuth2 or SSO integration (future enhancement)
- File storage for student submissions (in-memory or temporary)
- Performance optimization beyond basic SLAs
- Comprehensive logging and monitoring (Phase 8)

These will be addressed in later phases.
