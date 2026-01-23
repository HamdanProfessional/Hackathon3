# Phase 5: Frontend User Interface - Tasks

**Phase**: 5
**Focus**: Build web-based user interface for LearnFlow

---

## Phase 1: Setup (Project Initialization)

**Goal**: Initialize Next.js project and verify infrastructure readiness

**Tasks**:
- [ ] T001 Verify backend services running: `kubectl get pods -n learnflow`
- [ ] T002 Verify API endpoints accessible (test health endpoints)
- [ ] T003 Get API base URL for environment config
- [ ] T004 Create `frontend/` directory structure
- [ ] T005 Initialize Next.js project: `npx create-next-app@latest --typescript --tailwind --app`
- [ ] T006 Configure `frontend/next.config.js` for standalone output
- [ ] T007 Create `frontend/.env.local` with API_URL
- [ ] T008 [P] Create `frontend/tsconfig.json` with strict mode
- [ ] T009 [P] Create `frontend/tailwind.config.ts` with mastery colors
- [ ] T010 Create `frontend/components.json` for component paths

---

## Phase 2: Foundational (State Management & API)

**Goal**: Set up shared state and API client

**Tasks**:
- [ ] T011 Install Zustand: `npm install zustand`
- [ ] T012 [P] Create `frontend/stores/userStore.ts` (user, student, teacher state)
- [ ] T013 [P] Create `frontend/stores/codeStore.ts` (code, output, error state)
- [ ] T014 [P] Create `frontend/stores/chatStore.ts` (messages, conversationId, typing)
- [ ] T015 [P] Create `frontend/stores/progressStore.ts` (mastery, streak, activity)
- [ ] T016 [P] Create `frontend/lib/api.ts` (base API client with auth)
- [ ] T017 [P] Create `frontend/lib/execute.ts` (code execution API)
- [ ] T018 Create `frontend/lib/auth.ts` (token management)
- [ ] T019 Create `frontend/types/index.ts` (TypeScript types)

---

## Phase 3: User Story - Student Progress Visualization (P1)

**Story**: As a student learning Python, I want to see my overall progress and mastery levels so that I know what I've learned and what to focus on next.

**Independent Test Criteria**:
- Student dashboard displays overall progress
- Module cards show mastery percentage with correct color
- Learning streak displayed accurately
- Continue Learning button navigates to current topic

**Tasks**:
- [ ] T020 [P] Create `frontend/components/ProgressCard.tsx` (circular progress, module info)
- [ ] T021 [US1] Create `frontend/components/ModuleCard.tsx` (module name, mastery bar, status badge)
- [ ] T022 [US1] Create `frontend/components/ModuleGrid.tsx` (grid of modules)
- [ ] T023 [US1] Create `frontend/components/ActivityList.tsx` (recent activity items)
- [ ] T024 [US1] Implement `frontend/app/(student)/dashboard/page.tsx`
- [ ] T025 [US1] Add GET /api/v1/progress/{student_id} API call
- [ ] T026 [US1] Add mastery level color mapping (Red/Yellow/Green/Blue)
- [ ] T027 [US1] Implement Continue Learning navigation
- [ ] T028 [US1] Write tests for dashboard components
- [ ] T029 [US1] Verify dashboard loads within 3 seconds

---

## Phase 4: User Story - Interactive Code Exercises (P1)

**Story**: As a student, I want to write and execute Python code in the browser so that I can practice coding without installing anything.

**Independent Test Criteria**:
- Exercise page loads Monaco Editor with Python syntax
- Run button executes code and shows output
- Submit button sends code for grading
- Hints display progressively
- Errors shown with helpful messages

**Tasks**:
- [ ] T030 Install Monaco Editor: `npm install @monaco-editor/react`
- [ ] T031 [P] Create `frontend/components/MonacoEditor.tsx` (lazy loaded)
- [ ] T032 [P] Create `frontend/components/EditorPanel.tsx` (editor container)
- [ ] T033 [P] Create `frontend/components/EditorToolbar.tsx` (Run/Submit/Hint buttons)
- [ ] T034 [P] Create `frontend/components/OutputPanel.tsx` (output/error display)
- [ ] T035 [US2] Create `frontend/components/ExercisePrompt.tsx` (instructions, test cases)
- [ ] T036 [US2] Implement `frontend/app/(student)/exercise/[id]/page.tsx`
- [ ] T037 [US2] Implement Run button handler (call /api/execute)
- [ ] T038 [US2] Implement Submit button handler (call /api/v1/exercise/submit)
- [ ] T039 [US2] Implement Hint button handler (progressive hints)
- [ ] T040 [US2] Add code state persistence (localStorage)
- [ ] T041 [US2] Write tests for editor components
- [ ] T042 [US2] Verify Monaco loads within 2 seconds

---

## Phase 5: User Story - Conversational AI Tutoring (P1)

**Story**: As a student, I want to chat with an AI tutor about Python concepts so that I can get help when I'm stuck.

**Independent Test Criteria**:
- Chat page shows conversation interface
- Messages display with role indicators
- AI responses stream in real-time
- Agent indicator shows which agent is responding
- Quick action suggestions available

**Tasks**:
- [ ] T043 [P] Create `frontend/components/ChatLayout.tsx` (chat container)
- [ ] T044 [P] Create `frontend/components/ChatHistory.tsx` (message list)
- [ ] T045 [P] Create `frontend/components/ChatInput.tsx` (textarea + send button)
- [ ] T046 [P] Create `frontend/components/MessageBubble.tsx` (message with agent)
- [ ] T047 [US3] Implement `frontend/app/(student)/chat/page.tsx`
- [ ] T048 [US3] Implement SSE streaming for AI responses
- [ ] T049 [US3] Add agent indicator display (Concepts/Debug/Exercise/Progress)
- [ ] T050 [US3] Add quick action buttons (Explain for loops, Debug my code, etc.)
- [ ] T051 [US3] Implement message history persistence
- [ ] T052 [US3] Add typing indicator during streaming
- [ ] T053 [US3] Write tests for chat components
- [ ] T054 [US3] Verify chat responses stream within 500ms

---

## Phase 6: User Story - Exercise Navigation (P1)

**Story**: As a student, I want to browse and discover coding exercises so that I can practice specific Python topics.

**Independent Test Criteria**:
- Modules page shows all 8 Python modules
- Clicking module shows topics within it
- Topics show completion status
- Exercises filtered by difficulty

**Tasks**:
- [ ] T055 [P] Create `frontend/components/TopicList.tsx` (topics with status)
- [ ] T056 [P] Create `frontend/components/TopicCard.tsx` (topic with start button)
- [ ] T057 [US4] Create `frontend/components/ExerciseList.tsx` (exercises by difficulty)
- [ ] T058 [US4] Implement `frontend/app/(student)/modules/[id]/page.tsx`
- [ ] T059 [US4] Implement topic filtering by difficulty
- [ ] T060 [US4] Add completion status indicators
- [ ] T061 [US4] Implement "Next Exercise" recommendation
- [ ] T062 [US4] Write tests for navigation components

---

## Phase 7: User Story - Teacher Class Dashboard (P2)

**Story**: As a teacher, I want to see an overview of my class progress so that I can identify which students need help.

**Independent Test Criteria**:
- Teacher dashboard shows class overview statistics
- Active students count displayed
- Struggling students highlighted
- Average class mastery shown

**Tasks**:
- [ ] T063 [P] Create `frontend/components/ClassOverview.tsx` (stat cards)
- [ ] T064 [P] Create `frontend/components/StatCard.tsx` (metric with icon)
- [ ] T065 [US5] Implement `frontend/app/(teacher)/dashboard/page.tsx`
- [ ] T066 [US5] Add GET /api/v1/progress/struggles API call
- [ ] T067 [US5] Calculate class statistics from progress data
- [ ] T068 [US5] Implement student count displays
- [ ] T069 [US5] Add mastery level aggregation
- [ ] T070 [US5] Write tests for dashboard components

---

## Phase 8: User Story - Struggle Alert Notifications (P2)

**Story**: As a teacher, I want to receive alerts when students are struggling so that I can provide timely help.

**Independent Test Criteria**:
- Struggle alerts appear in real-time
- Alert shows student name and topic
- Alert shows struggle reason and duration
- Generate exercise action available

**Tasks**:
- [ ] T071 [P] Create `frontend/components/StruggleAlerts.tsx` (alert list)
- [ ] T072 [P] Create `frontend/components/AlertCard.tsx` (individual alert)
- [ ] T073 [US6] Implement SSE subscription to struggle alerts
- [ ] T074 [US6] Add student avatar and name display
- [ ] T075 [US6] Add struggle reason display
- [ ] T076 [US6] Add "View Work" button (navigate to student submissions)
- [ ] T077 [US6] Add urgency indicator (high/medium/low)
- [ ] T078 [US6] Write tests for alert components
- [ ] T079 [US6] Verify alerts appear within 2 seconds of trigger

---

## Phase 9: User Story - Exercise Generation for Students (P2)

**Story**: As a teacher, I want to generate custom exercises for struggling students so that I can provide targeted practice.

**Independent Test Criteria**:
- Teacher can select student and topic
- Exercise generates with chosen difficulty
- Assigned exercise appears in student dashboard
- Teacher sees completion result

**Tasks**:
- [ ] T080 [P] Create `frontend/components/ExerciseGenerator.tsx` (form UI)
- [ ] T081 [US7] Implement topic dropdown (8 modules)
- [ ] T082 [US7] Implement difficulty selector (beginner/intermediate/advanced)
- [ ] T083 [US7] Implement POST /api/v1/exercise/generate API call
- [ ] T084 [US7] Implement POST /api/v1/progress/struggles/assign API call
- [ ] T085 [US7] Add success confirmation after assignment
- [ ] T086 [US7] Write tests for generator components

---

## Phase 10: User Story - User Authentication (P3)

**Story**: As a user (student or teacher), I want to log in securely so that my progress and data are protected.

**Independent Test Criteria**:
- Login page displays email/password fields
- Valid credentials redirect to appropriate dashboard
- Student sees student dashboard, teacher sees teacher dashboard
- Logout clears session

**Tasks**:
- [ ] T087 Install Better Auth: `npm install better-auth`
- [ ] T088 [P] Create `frontend/app/(auth)/login/page.tsx` (login form)
- [ ] T089 [P] Create `frontend/app/(auth)/layout.tsx` (auth layout)
- [ ] T090 [US8] Implement login form submission
- [ ] T091 [US8] Implement role-based routing (middleware.ts)
- [ ] T092 [US8] Add session persistence (httpOnly cookies)
- [ ] T093 [US8] Implement logout functionality
- [ ] T094 [US8] Add protected route middleware
- [ ] T095 [US8] Write tests for auth flow

---

## Phase 11: Polish & Cross-Cutting Concerns

**Goal**: Finalize styling, responsiveness, and deployment

**Tasks**:
- [ ] T096 Configure mastery level colors in tailwind.config.ts
- [ ] T097 Add responsive breakpoints (mobile/tablet/desktop)
- [ ] T098 Add loading states for all async operations
- [ ] T099 Add error boundaries for graceful failures
- [ ] T100 Create `frontend/app/globals.css` with base styles
- [ ] T101 Add ARIA labels for accessibility
- [ ] T102 Add keyboard navigation support
- [ ] T103 Optimize images and assets
- [ ] T104 Create `frontend/Dockerfile` (multi-stage build)
- [ ] T105 Create `frontend/.dockerignore`
- [ ] T106 Create `frontend/k8s/deployment.yaml`
- [ ] T107 Create `frontend/k8s/service.yaml`
- [ ] T108 Create `frontend/k8s/ingress.yaml`
- [ ] T109 Build and push container image
- [ ] T110 Deploy to Kubernetes using `nextjs-k8s-deploy` skill
- [ ] T111 Verify deployment: `kubectl get pods -n learnflow -l app=learnflow-frontend`
- [ ] T112 Run E2E tests from quickstart.md
- [ ] T113 Verify Lighthouse score >90
- [ ] T114 Verify responsive on desktop and tablet

---

## Task Dependencies

```
Phase 1 (Setup)
    │
    ▼
Phase 2 (Foundational)
    │
    ├─▶ Phase 3 (Progress Visualization - US1)
    │
    ├─▶ Phase 4 (Code Exercises - US2)
    │
    ├─▶ Phase 5 (Chat Interface - US3)
    │
    ├─▶ Phase 6 (Navigation - US4)
    │
    ├─▶ Phase 7 (Teacher Dashboard - US5)
    │
    ├─▶ Phase 8 (Struggle Alerts - US6)
    │
    ├─▶ Phase 9 (Exercise Generation - US7)
    │
    └─▶ Phase 10 (Authentication - US8)
          │
          ▼
    Phase 11 (Polish)
```

---

## Parallel Execution Opportunities

**Phase 2**:
- T012, T013, T014, T015 can run in parallel (Zustand stores)
- T016, T017 can run in parallel (API clients)

**Phase 3-10**:
- User story phases can proceed independently after Phase 2
- Component creation tasks marked [P] can run in parallel

---

## MVP Scope

**Minimum Viable Product**: Phases 1-5 (Setup, Foundational, Progress Visualization, Code Exercises, Chat Interface)

This delivers:
- Project structure ready
- Student dashboard working
- Code editor functional
- Chat interface operational

**Additional Phases**: Add navigation, teacher portal, authentication for complete feature set.
