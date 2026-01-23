# Phase 5: Frontend User Interface - Data Model

**Phase**: 5
**Status**: Draft

---

## Component Structure

### Page Components

| Component | Route | Purpose | Props |
|-----------|-------|---------|-------|
| **LoginPage** | `/login` | User authentication | - |
| **StudentDashboard** | `/dashboard` | Progress overview | progress, modules, activities |
| **ModuleDetail** | `/modules/[id]` | Module topics | module, topics |
| **ExercisePage** | `/exercise/[id]` | Code editor | exercise, submission |
| **ChatInterface** | `/chat` | AI tutoring | messages, conversationId |
| **TeacherDashboard** | `/teacher/dashboard` | Class overview | struggles, students |

---

## Reusable UI Components

| Component | Purpose | Props |
|-----------|---------|-------|
| **ProgressCard** | Circular progress with module info | value, module, onContinue |
| **ModuleCard** | Module with mastery bar | module, mastery, onClick |
| **ModuleGrid** | Grid of modules | modules |
| **ActivityList** | Recent activity items | activities |
| **MonacoEditor** | Lazy-loaded code editor | code, onChange, language |
| **EditorPanel** | Editor container with toolbar | exercise, code, onChange |
| **EditorToolbar** | Run/Submit/Hint buttons | onRun, onSubmit, onHint |
| **OutputPanel** | Code execution output | output, error |
| **ChatLayout** | Chat container | messages, onSend |
| **ChatHistory** | Message list | messages, isTyping |
| **ChatInput** | Input with send button | onSend, disabled |
| **MessageBubble** | Individual message | message, agent |
| **ClassOverview** | Teacher stats | stats, struggles |
| **StatCard** | Metric card | title, value, icon |
| **StruggleAlerts** | Alert list | struggles |
| **AlertCard** | Individual alert | struggle, onViewWork |
| **ExerciseGenerator** | Generate form | studentId, onGenerate |

---

## Zustand Stores

### userStore

```typescript
interface UserStore {
  // State
  user: User | null
  student: Student | null
  teacher: Teacher | null
  isAuthenticated: boolean

  // Actions
  setUser: (user: User) => void
  setStudent: (student: Student) => void
  setTeacher: (teacher: Teacher) => void
  logout: () => void
}
```

### codeStore

```typescript
interface CodeStore {
  // State
  code: string
  output: string
  error: string
  isRunning: boolean
  isSubmitting: boolean

  // Actions
  setCode: (code: string) => void
  setOutput: (output: string) => void
  setError: (error: string) => void
  runCode: () => Promise<void>
  submitCode: (exerciseId: string) => Promise<void>
  clear: () => void
}
```

### chatStore

```typescript
interface ChatStore {
  // State
  messages: Message[]
  conversationId: string | null
  isTyping: boolean

  // Actions
  addMessage: (message: Message) => void
  setTyping: (typing: boolean) => void
  clearChat: () => void
  sendMessage: (content: string) => Promise<void>
}
```

### progressStore

```typescript
interface ProgressStore {
  // State
  progress: StudentProgress | null
  modules: Module[]
  activities: Activity[]
  struggles: StruggleAlert[]

  // Actions
  setProgress: (progress: StudentProgress) => void
  setModules: (modules: Module[]) => void
  addActivity: (activity: Activity) => void
  setStruggles: (struggles: StruggleAlert[]) => void
}
```

---

## TypeScript Types

### User Types

```typescript
interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher'
  avatar?: string
}

interface Student extends User {
  role: 'student'
  currentModule: string
  currentTopic: string
  streak: number
}

interface Teacher extends User {
  role: 'teacher'
  classes: string[]
}
```

### Progress Types

```typescript
interface StudentProgress {
  studentId: string
  overallMastery: number
  modules: ModuleProgress[]
  lastActive: string
}

interface ModuleProgress {
  module: string
  mastery: number
  level: MasteryLevel
  topicsCompleted: number
  topicsTotal: number
}

type MasteryLevel = 'Beginner' | 'Learning' | 'Proficient' | 'Mastered'
```

### Exercise Types

```typescript
interface Exercise {
  id: string
  title: string
  description: string
  module: string
  topic: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  starterCode: string
  testCases: TestCase[]
  hints: string[]
}

interface TestCase {
  input: string
  expected: string
  hidden?: boolean
}

interface ExerciseSubmission {
  exerciseId: string
  code: string
  passed: boolean
  testResults: TestResult
  hintsShown: number
}

interface TestResult {
  totalCases: number
  passedCases: number
  failedCases: FailedCase[]
}

interface FailedCase {
  caseId: string
  expected: string
  actual: string
}
```

### Chat Types

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  agent?: 'concepts' | 'debug' | 'exercise' | 'progress'
  timestamp: string
}

interface Conversation {
  id: string
  studentId: string
  topic?: string
  messages: Message[]
  startedAt: string
  updatedAt: string
}
```

### Teacher Types

```typescript
interface StruggleAlert {
  id: string
  studentId: string
  studentName: string
  studentAvatar?: string
  topic: string
  struggleType: 'repeated_error' | 'timeout' | 'low_quiz'
  errorCount?: number
  duration?: number
  severity: 'high' | 'medium' | 'low'
  firstSeen: string
  lastSeen: string
}

interface ClassStats {
  totalStudents: number
  activeNow: number
  strugglingCount: number
  averageMastery: number
}
```

---

## API Client Functions

### API Functions

```typescript
// Progress API
async function getProgress(studentId: string): Promise<StudentProgress>
async function updateProgress(studentId: string, data: ProgressUpdate): Promise<void>

// Exercise API
async function generateExercise(request: ExerciseRequest): Promise<Exercise>
async function submitExercise(submission: ExerciseSubmission): Promise<TestResult>
async function getExercise(exerciseId: string): Promise<Exercise>

// Chat API
async function sendMessage(request: ChatRequest): Promise<void> // SSE stream
async function getConversation(conversationId: string): Promise<Conversation>

// Teacher API
async function getStruggles(classId: string): Promise<StruggleAlert[]>
async function assignExercise(request: AssignmentRequest): Promise<void>
async function getClassStats(classId: string): Promise<ClassStats>
```

---

## Data Flow

### Student Dashboard Data Flow

```
Component Mount → userStore.setUser()
              → progressStore.setProgress() ← API: /api/v1/progress/{id}
              → Render ProgressCard, ModuleGrid
```

### Exercise Page Data Flow

```
Component Mount → Get exercise data ← API: /api/v1/exercise/{id}
              → codeStore.setCode(starterCode)
              → User edits code → codeStore.setCode()
              → Run → codeStore.runCode() ← API: /api/execute
              → Submit → codeStore.submitCode() ← API: /api/v1/exercise/submit
              → progressStore.addActivity() ← Update local state
```

### Chat Data Flow

```
Component Mount → chatStore.setConversationId()
              → User types → chatStore.sendMessage()
              → SSE stream → Append messages to chatStore
              → Render MessageBubble components
```

### Teacher Dashboard Data Flow

```
Component Mount → SSE subscribe to /api/struggles/stream
              → Get class stats ← API: /api/v1/class/stats
              → Render ClassOverview, StruggleAlerts
              → Alert received → Update struggleStore
              → Generate exercise → API: /api/v1/exercise/generate
              → Assign → API: /api/v1/struggles/assign
```

---

## State Persistence

### Local Storage Keys

```typescript
const STORAGE_KEYS = {
  AUTH_TOKEN: 'learnflow_token',
  CODE_DRAFT: 'learnflow_code_draft_{exerciseId}',
  CHISTORY_CACHE: 'learnflow_history_{conversationId}',
}
```

### Session Storage Keys

```typescript
const SESSION_KEYS = {
  CURRENT_EXERCISE: 'learnflow_current_exercise',
  NAVIGATION_HISTORY: 'learnflow_nav_history',
}
```
