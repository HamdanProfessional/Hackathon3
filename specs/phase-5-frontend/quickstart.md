# Phase 5: Frontend User Interface - Quickstart Scenarios

**Phase**: 5
**Status**: Draft

---

## Scenario 1: Student Logs In and Views Progress

### Flow

```
Browser → Frontend → Backend API → Dashboard Display
```

### Steps

1. **Navigate to login page**
   ```
   GET /login
   Response: Login form with email/password fields
   ```

2. **Submit credentials**
   ```
   POST /api/auth/login
   Request: { email: "student@example.com", password: "***" }
   Response: { token: "jwt-token", user: { id, name, role } }
   ```

3. **Redirect to dashboard**
   ```
   Response: 302 Redirect to /dashboard
   ```

4. **Fetch progress data**
   ```
   GET /api/v1/progress/student-456
   Headers: Authorization: Bearer jwt-token
   Response: {
     overallMastery: 68,
     modules: [
       { module: "basics", mastery: 85, level: "Proficient" },
       { module: "control-flow", mastery: 60, level: "Learning" }
     ],
     streak: 3
   }
   ```

### Expected UI

```
┌─────────────────────────────────────────────────────────────┐
│  LearnFlow - Student Dashboard                             │
├─────────────────────────────────────────────────────────────┤
│  Welcome back, Maya!                                       │
│                                                             │
│  Overall Progress: ████████░░ 68%                          │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Basics     │  │ Control Flow │  │  Data Struc  │      │
│  │  ████████░   │  │  █████░░░░   │  │  ████░░░░░   │      │
│  │  Proficient   │  │   Learning   │  │   Beginner   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  Recent Activity:                                            │
│  • For Loops Quiz - Score: 80%                             │
│  • Print Statement Exercise - Passed                        │
│                                                             │
│  🔥 3 day streak!                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Scenario 2: Student Completes Exercise with Monaco

### Flow

```
Browser → Exercise Page → Monaco Editor → Run Code → Submit → Grade → Update Progress
```

### Steps

1. **Navigate to exercise**
   ```
   GET /exercise/ex-123
   Response: Exercise page with Monaco Editor
   ```

2. **Load exercise data**
   ```
   GET /api/v1/exercise/ex-123
   Response: {
     title: "For Loops Practice",
     description: "Write a for loop that prints 1 to 5",
     starterCode: "# Your code here",
     difficulty: "beginner"
   }
   ```

3. **Student writes code**
   ```python
   for i in range(1, 6):
       print(i)
   ```

4. **Click Run button**
   ```
   POST /api/execute
   Request: { code: "for i in range(1, 6):\n    print(i)" }
   Response: {
     output: "1\n2\n3\n4\n5\n",
     error: null
   }
   ```

5. **Click Submit button**
   ```
   POST /api/v1/exercise/submit
   Request: {
     exercise_id: "ex-123",
     code: "for i in range(1, 6):\n    print(i)"
   }
   Response: {
     passed: true,
     testResults: {
       totalCases: 5,
       passedCases: 5,
       failedCases: []
     },
     masteryUpdate: {
       previousScore: 68,
       newScore: 72
     }
   }
   ```

### Expected UI

```
┌─────────────────────────────────────────────────────────────┐
│  For Loops Practice                    Difficulty: Beginner   │
├─────────────────────────────────────────────────────────────┤
│  Instructions:                                               │
│  Write a for loop that prints numbers 1 to 5               │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  1 │ for i in range(1, 6):                          │ │
│  │  2 │     print(i)                                     │ │
│  │ 3 │                                                  │ │
│  │  │                                                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [▶ Run]  [✓ Submit]  [💡 Hint]                             │
│                                                             │
│  Output:                                                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 1                                                  │ │
│  │ 2                                                  │ │
│  │ 3                                                  │ │
│  │ 4                                                  │ │
│  │ 5                                                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ✓ Correct! Mastery: 68% → 72%                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Scenario 3: Student Chats with AI Tutor

### Flow

```
Browser → Chat Page → SSE Stream → Message Display
```

### Steps

1. **Navigate to chat**
   ```
   GET /chat
   Response: Chat interface with message history
   ```

2. **Send message**
   ```
   POST /api/chat
   Request: {
     message: "How do for loops work?",
     conversationId: "conv-123" or null
   }
   ```

3. **Receive SSE stream**
   ```
   Content-Type: text/event-stream

   data: {"agent":"concepts","content":"A for loop"}
   data: {"agent":"concepts","content":" lets you"}
   data: {"agent":"concepts","content":" iterate..."}
   data: [DONE]
   ```

### Expected UI

```
┌─────────────────────────────────────────────────────────────┐
│  LearnFlow Chat                                    ● Typing... │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🧑 You                                           10:30 │ │
│  │ How do for loops work?                            10:30 │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🤖 Concepts Agent                                 10:30 │ │
│  │ A for loop lets you repeat code for each item...   │ │
│  │ Example:                                            │ │
│  │ for item in ['apple', 'banana']:                   │ │
│  │     print(item)                                     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🧑 You                                           10:31 │ │
│  │ Can you show another example?                         │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Quick Actions:                                              │
│  [Explain for loops]  [Debug my code]  [Generate exercise]  │
├─────────────────────────────────────────────────────────────┤
│  [───────────textarea──────────] [Send]                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Scenario 4: Teacher Views Struggle Alerts

### Flow

```
Browser → Teacher Dashboard → SSE Subscribe → Alert Display → Assign Exercise
```

### Steps

1. **Navigate to teacher dashboard**
   ```
   GET /teacher/dashboard
   Response: Teacher dashboard with stats
   ```

2. **Subscribe to struggle alerts (SSE)**
   ```
   GET /api/struggles/stream
   Headers: Authorization: Bearer teacher-token
   Response: SSE stream
   ```

3. **Alert received**
   ```
   data: {
     "id": "struggle-456",
     "studentId": "student-789",
     "studentName": "James Wilson",
     "topic": "data-structures:list-comprehensions",
     "struggleType": "repeated_error",
     "errorCount": 3,
     "severity": "high"
   }
   ```

4. **Generate remedial exercise**
   ```
   POST /api/v1/exercise/generate
   Request: {
     studentId: "student-789",
     topic: "data-structures:lists",
     difficulty: "beginner"
   }
   Response: { exerciseId: "ex-456" }
   ```

5. **Assign to student**
   ```
   POST /api/v1/struggles/assign
   Request: {
     studentId: "student-789",
     exerciseId: "ex-456",
     note: "Practice this before trying list comprehensions again"
   }
   ```

### Expected UI

```
┌─────────────────────────────────────────────────────────────┐
│  Teacher Dashboard                                        James  │
├─────────────────────────────────────────────────────────────┤
│  Class Overview                                             │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐ │
│  │ Students  │  │  Active   │  │Struggling │  │   Avg     │ │
│  │    24     │  │    8      │  │    3      │  │   62%     │ │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘ │
│                                                             │
│  ⚠️ Struggle Alerts (3)                                    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  JW  ───────►  List comprehensions                │ │
│  │  James Wilson                                      │ │
│  │  Same error: 3x • Stuck for 12 min                │ │
│  │  [View Work] [Generate Exercise]                    │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Class Progress Table:                                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Student     │ Module      │ Mastery │ Actions  │    │
│  │─────────────┼─────────────┼─────────┼─────────┤    │
│  │ Maya S.    │ Basics      │ ████████ │ [Gen]   │    │
│  │ James W.    │ Data Struct │ ████░░░░ │ [Gen]   │    │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Test Setup

### Prerequisites

```bash
# Deploy frontend (after implementation)
npm run build
kubectl apply -f frontend/k8s/

# Verify deployment
kubectl get pods -n learnflow -l app=learnflow-frontend
```

### Create Test Data

```sql
-- Insert test students
INSERT INTO students (id, email, name, role) VALUES
  ('student-456', 'maya@example.com', 'Maya Student', 'student'),
  ('student-789', 'james@example.com', 'James Wilson', 'student');

-- Insert progress
INSERT INTO student_progress (student_id, module, mastery_score, mastery_level) VALUES
  ('student-456', 'basics', 85.0, 'Proficient'),
  ('student-456', 'control-flow', 60.0, 'Learning');
```

### Run Scenarios

```bash
# Scenario 1: Login and view progress
# Open browser to http://localhost:3000/login
# Enter credentials and navigate

# Scenario 2: Complete exercise
# Navigate to http://localhost:3000/exercise/ex-123
# Write code, click Run, click Submit

# Scenario 3: Chat with AI
# Navigate to http://localhost:3000/chat
# Type message and observe streaming

# Scenario 4: Teacher alerts
# Login as teacher, navigate to /teacher/dashboard
# Wait for or trigger struggle alert
```

---

## Validation Checklist

- [ ] Login works for student role
- [ ] Login works for teacher role
- [ ] Dashboard displays correct progress
- [ ] Mastery level colors correct (Red/Yellow/Green/Blue)
- [ ] Monaco Editor loads within 2 seconds
- [ ] Run executes code and shows output
- [ ] Submit grades exercise and updates mastery
- [ ] Chat streams responses in real-time
- [ ] Quick action buttons work
- [ ] Struggle alerts appear in real-time
- [ ] Exercise generation works
- [ ] All pages responsive on desktop/tablet
- [ ] Lighthouse score >90
