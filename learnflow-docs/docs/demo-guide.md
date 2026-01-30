---
slug: /demo-guide
title: Demo Guide & Test Scenarios
sidebar_position: 9
---

# Demo Guide & Test Scenarios

This guide provides step-by-step scenarios for demonstrating LearnFlow's capabilities. Perfect for hackathon judging, stakeholder demos, or user testing.

---

## Quick Demo (5 Minutes)

### Scenario: Student Learning Journey

**Purpose**: Show the complete learning experience

**Steps:**

1. **Visit Student Dashboard** (http://localhost:3001)
   - Shows mastery score, module progress, learning streak
   - Clean, intuitive interface

2. **Start an Exercise** → "Python Basics" → "Print Statement"
   - In-browser Monaco editor with syntax highlighting
   - Clear instructions: "Print 'Hello, World!'"
   - Starter code provided

3. **Write and Run Code**
   - Type: `print('Hello, World!')`
   - Click "Run" → See output: "Hello, World!"
   - Code executes in <1 second

4. **Submit and Get Feedback**
   - Click "Submit" → Immediate grading
   - Feedback: "Perfect! Your code works correctly."
   - Points earned: +10, mastery updated

5. **Ask AI Tutor for Help**
   - Click chat icon in sidebar
   - Type: "What is a variable?"
   - AI responds with adaptive explanation based on mastery level

**Key Features Shown:**
- Clean, modern UI
- Interactive code editor
- Instant feedback
- AI-powered tutoring
- Progress tracking

---

## Full Demo Scenarios

### Scenario 1: First-Time User Experience (10 min)

**Persona**: New student with no prior coding experience

**Demonstrates**: Onboarding, placement, adaptive learning

**Steps:**

1. **Sign Up**
   ```
   URL: http://localhost:3001/signup
   Name: Demo Student
   Email: demo@learnflow.dev
   Password: demo123
   ```

2. **Placement Quiz**
   - 5 questions assessing current Python knowledge
   - Determines starting mastery level
   - Suggests first module

3. **First Exercise**
   - Guided through print statement exercise
   - Progressive hints available if stuck
   - Success animation on completion

4. **Dashboard Tour**
   - View updated mastery score
   - See learning streak (1 day)
   - Points leaderboard position

**Success Criteria:**
- Student completes first exercise successfully
- Dashboard reflects progress
- AI tutor provides helpful responses

---

### Scenario 2: Struggling Student (8 min)

**Persona**: Student having difficulty with loops

**Demonstrates**: Struggle detection, progressive hints, teacher alerts

**Steps:**

1. **Access Challenging Exercise**
   - Module: "Control Flow"
   - Exercise: "For Loop Basics"
   - Task: "Print numbers 1-5 using a for loop"

2. **Intentionally Make Mistakes**
   - Attempt 1: Forget colon → Syntax error
   - Attempt 2: Wrong indentation → Error shown
   - Attempt 3: Off-by-one error → Test fails

3. **Use Progressive Hints**
   - Hint 1: "You need a for loop with range()"
   - Hint 2: "The syntax is: for i in range(n):"
   - Hint 3: Nearly complete solution

4. **Check Teacher Alerts**
   - Log in as teacher (teacher@learnflow.dev / teacher123)
   - View Struggle Alerts → See student flagged
   - Review student code and errors

5. **Provide Personal Help**
   - Send custom hint to student
   - Student receives in chat
   - Student completes exercise

**Success Criteria:**
- Struggle detected after 3 failed attempts
- Hints progress from general to specific
- Teacher alert created
- Student successfully completes after guidance

---

### Scenario 3: Advanced Student Acceleration (7 min)

**Persona**: Student with prior Python experience

**Demonstrates**: Adaptive content, accelerated paths, code review

**Steps:**

1. **Placement Quiz Results**
   - Score: 85% (advanced)
   - Suggested: Start at "Functions" module
   - Skip basics

2. **Complete Challenging Exercise**
   - Exercise: "List Comprehensions"
   - Write efficient one-liner solution
   - Get bonus points for code quality

3. **Code Review Feedback**
   - Submit solution
   - AI code review analyzes quality
   - Suggests optimization (optional)

4. **Accelerate Through Modules**
   - Complete multiple exercises quickly
   - Mastery rises rapidly
   - Unlock advanced content

**Success Criteria:**
- Placement identifies advanced level
- Content appropriate for skill level
- Can progress at own pace
- Quality feedback provided

---

### Scenario 4: Teacher Classroom Management (10 min)

**Persona**: Teacher managing class of 30 students

**Demonstrates**: Analytics, alerts, bulk operations

**Steps:**

1. **Class Overview Dashboard**
   - View all 30 students
   - See aggregate mastery: 62% average
   - Identify students at risk

2. **Review Struggle Alerts**
   - 5 high-priority alerts
   - 3 students stuck on loops
   - 2 students inactive for 5+ days

3. **Exercise Analytics**
   - Identify hardest exercise: "Nested Loops"
   - Pass rate: only 45%
   - Common errors: Indentation, logic

4. **Intervention Actions**
   - Send hints to struggling students
   - Schedule review session for nested loops
   - Create easier practice exercises

5. **Export Report**
   - Generate weekly progress report
   - Export as CSV for admin

**Success Criteria:**
- Full class visibility
- Proactive struggle detection
- Data-driven intervention
- Easy report generation

---

### Scenario 5: MCP Server Integration (10 min)

**Persona**: Developer integrating with LearnFlow

**Demonstrates**: MCP servers, AI agent integration

**Prerequisites**: MCP servers running on ports 9000-9003

**Steps:**

1. **Verify MCP Servers Running**
   ```bash
   curl http://localhost:9000/health  # Code Execution MCP
   curl http://localhost:9001/health  # Database MCP
   curl http://localhost:9002/health  # Kafka Events MCP
   curl http://localhost:9003/health  # K8s Operations MCP
   ```

2. **Test Code Execution MCP**
   ```bash
   curl -X POST http://localhost:9000/tools/call \
     -H "Content-Type: application/json" \
     -d '{
       "name": "execute_code",
       "arguments": {
         "code": "for i in range(5): print(i**2)"
       }
     }'
   ```
   Expected output: `0, 1, 4, 9, 16`

3. **Test Database MCP**
   ```bash
   curl -X POST http://localhost:9001/tools/call \
     -H "Content-Type: application/json" \
     -d '{
       "name": "get_student_progress",
       "arguments": {
         "student_id": "00000000-0000-0000-0000-000000000001"
       }
     }'
   ```
   Returns: Student progress data

4. **Test Kafka Events MCP**
   ```bash
   curl -X POST http://localhost:9002/tools/call \
     -H "Content-Type: application/json" \
     -d '{
       "name": "publish_event",
       "arguments": {
         "topic": "learning.progress",
         "data": {
           "student_id": "demo-student",
           "concept": "variables",
           "mastery_level": "learning"
         }
       }
     }'
   ```

5. **Test K8s Operations MCP**
   ```bash
   curl -X POST http://localhost:9003/tools/call \
     -H "Content-Type: application/json" \
     -d '{
       "name": "get_pods",
       "arguments": {
         "namespace": "learnflow"
       }
     }'
   ```
   Returns: List of running pods

**Success Criteria:**
- All MCP servers respond correctly
- Code execution produces expected output
- Database queries return valid data
- Events publish to Kafka
- K8s operations succeed

---

### Scenario 6: Event-Driven Architecture (8 min)

**Persona**: System administrator verifying event flow

**Demonstrates**: Kafka, Dapr pub/sub, event streaming

**Prerequisites**: Full stack running

**Steps:**

1. **Verify Kafka Topics**
   ```bash
   # List topics
   docker exec learnflow-kafka-1 kafka-topics --list \
     --bootstrap-server localhost:9092

   # Expected topics:
   # - learning.progress
   # - code.submission
   # - exercise.attempt
   # - struggle.alert
   ```

2. **Trigger Learning Event**
   - Complete exercise as student
   - Event publishes to `learning.progress` topic

3. **Consume Event**
   ```bash
   docker exec learnflow-kafka-1 kafka-console-consumer \
     --bootstrap-server localhost:9092 \
     --topic learning.progress \
     --from-beginning --max-messages 1
   ```

4. **Verify Subscriber Processing**
   - Progress service consumes event
   - Student mastery updated
   - Check dashboard for changes

5. **Test Struggle Alert Flow**
   - Fail exercise 3 times
   - Alert publishes to `struggle.alert`
   - Teacher dashboard updates

**Success Criteria:**
- Events publish correctly
- Consumers process events
- State updates propagate
- End-to-end flow verified

---

## Test Scenarios for Judging

### Technical Excellence Tests

**Test 1: System Health**
```bash
# All services healthy
curl http://localhost:8001/health  # Triage
curl http://localhost:8002/health  # Concepts
curl http://localhost:8003/health  # Debug
curl http://localhost:8004/health  # Exercise
curl http://localhost:8005/health  # Progress
curl http://localhost:8006/health  # Code Review

# Frontend accessible
curl http://localhost:3001

# MCP servers running
curl http://localhost:9000/health
curl http://localhost:9001/health
curl http://localhost:9002/health
curl http://localhost:9003/health
```

**Test 2: End-to-End User Flow**
1. Sign up new user
2. Complete placement quiz
3. Finish first exercise
4. Ask AI tutor question
5. View updated progress

**Test 3: AI Responsiveness**
```bash
# Send chat message to triage
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is a variable?",
    "student_id": "demo-student"
  }'

# Should return within 5 seconds
```

**Test 4: Code Execution Safety**
```bash
# Try malicious code
curl -X POST http://localhost:9000/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "execute_code",
    "arguments": {
      "code": "import os; os.system('rm -rf /')"
    }
  }'

# Should be blocked or safe
```

---

### Innovation Highlights

**1. Adaptive AI Tutor**
- Content adjusts to mastery level
- Progressive hints build problem-solving
- Struggle detection triggers intervention

**2. Event-Driven Microservices**
- 7 independent services communicating via Kafka
- Dapr sidecars for pub/sub abstraction
- Scalable, resilient architecture

**3. MCP Server Integration**
- Standard protocol for AI agent access
- Database, code execution, events, K8s operations
- Enables third-party AI integration

**4. Safe Code Execution**
- Sandboxed Python execution
- Resource limits (5s timeout, 50MB memory)
- No file I/O or network access

---

## Demo Script (Hackathon Presentation)

**Opening (30 seconds)**
> "LearnFlow is an AI-powered Python learning platform that adapts to each student's level. Let me show you how it works."

**Demo (3 minutes)**
1. Show student dashboard with progress metrics
2. Complete an exercise with instant feedback
3. Ask AI tutor for help
4. Show teacher dashboard with struggle alerts

**Technical Deep Dive (2 minutes)**
> "Behind the scenes, we have 7 microservices communicating via Kafka. The architecture uses Dapr for event-driven messaging and exposes 4 MCP servers for AI agent integration."

**Closing (30 seconds)**
> "LearnFlow makes learning Python personalized, engaging, and effective. Thank you!"

---

## Troubleshooting Demo Issues

### Services Not Starting

**Problem**: Docker containers fail to start

**Solution**:
```bash
# Check available memory
docker system df

# Free up space if needed
docker system prune -a

# Restart services
docker-compose down && docker-compose up -d
```

### Database Empty

**Problem**: No exercises or students in database

**Solution**:
```bash
# Reinitialize database
docker-compose exec postgres psql -U learnflow -d learnflow \
  -c "TRUNCATE TABLE students, exercises CASCADE;"

# Restart backend to reseed
docker-compose restart exercise-service progress-service
```

### Frontend Can't Reach Backend

**Problem**: API calls failing in browser console

**Solution**:
```bash
# Check backend is running
curl http://localhost:8001/health

# Check CORS settings
docker-compose logs backend | grep -i cors

# Restart frontend
docker-compose restart frontend
```

---

## Next Steps

- [Local Setup](/local-setup) - Deploy for demo
- [Student Guide](/student-guide) - User documentation
- [Teacher Guide](/teacher-guide) - Instructor documentation
- [Backend API](/backend-api) - API reference

---

**Ready to demo?** Start services with: `docker-compose -f docker-compose.dev.yml up -d`
