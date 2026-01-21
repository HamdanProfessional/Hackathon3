# Phase 5: Frontend Development Specification

**Status**: Draft
**Phase**: 5
**Focus**: Build Next.js frontend with Monaco Editor for LearnFlow

---

## Overview

Build the web-based user interface for the LearnFlow multi-agent learning platform. The frontend provides:
- **Student Dashboard**: Progress tracking, module navigation, coding exercises
- **Chat Interface**: Conversational AI tutoring with real-time responses
- **Code Editor**: Monaco Editor with Python syntax highlighting and execution
- **Teacher Portal**: Class progress monitoring, struggle alerts, exercise generation

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | Next.js 14+ (App Router) | React framework with SSR |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Editor** | Monaco Editor | VS Code's editor component |
| **State** | Zustand | Lightweight state management |
| **Auth** | Better Auth | Authentication |
| **API** | fetch/axios | Backend integration |

---

## Success Criteria

- [ ] Next.js application deployed to Minikube
- [ ] Monaco Editor embedded and functional
- [ ] Student dashboard with progress visualization
- [ ] Chat interface with AI agents
- [ ] Code execution sandbox working
- [ ] Teacher portal with class analytics
- [ ] JWT authentication integrated
- [ ] Responsive design (mobile + desktop)
- [ ] Zero manual intervention - autonomous deployment via Skills

---

## Architecture

### Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                     NEXT.JS APP                                   │ │
│  │                                                                  │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │ │
│  │  │  Student   │  │    Chat    │  │  Teacher   │                 │ │
│  │  │ Dashboard  │  │ Interface  │  │  Portal    │                 │ │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘                 │ │
│  │        │                │                │                        │ │
│  │        └────────────────┴────────────────┘                        │ │
│  │                         │                                         │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │                  MONACO EDITOR                              │  │ │
│  │  │  ┌──────────────────────────────────────────────────────┐ │  │ │
│  │  │  │  Python Code | Syntax Highlight | Auto-indent        │ │  │ │
│  │  │  └──────────────────────────────────────────────────────┘ │  │ │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │  │ │
│  │  │  │   Run    │  │  Submit  │  │  Hint    │               │  │ │
│  │  │  └──────────┘  └──────────┘  └──────────┘               │  │ │
│  │  └────────────────────────────────────────────────────────────┘  │ │
│  │                                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │              STATE MANAGEMENT (Zustand)                    │  │ │
│  │  │  • User Session  • Code State  • Chat History  • Progress  │  │ │
│  │  └────────────────────────────────────────────────────────────┘  │ │
│  │                                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │              API CLIENT (Dapr/Kubernetes)                  │  │ │
│  │  └────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      KUBERNETES CLUSTER                                │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │ Ingress/Node │  │  Next.js     │  │    API       │                │
│  │    Port      │──►   Frontend   │──►   Gateway    │                │
│  │     :3000    │  │  Container   │  │    (Kong)    │                │
│  └──────────────┘  └──────────────┘  └──────┬───────┘                │
│                                             │                          │
│                                             ▼                          │
│                                    Backend Services (Phase 4)          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Page Structure

### App Router Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx           # Login page
│   └── layout.tsx             # Auth layout
├── (student)/
│   ├── dashboard/
│   │   └── page.tsx           # Student dashboard
│   ├── modules/
│   │   └── [id]/
│   │       └── page.tsx       # Module detail page
│   ├── exercise/
│   │   └── [id]/
│   │       └── page.tsx       # Exercise page with Monaco
│   ├── chat/
│   │   └── page.tsx           # Chat interface
│   └── layout.tsx             # Student layout
├── (teacher)/
│   ├── dashboard/
│   │   └── page.tsx           # Teacher dashboard
│   ├── class/
│   │   └── [id]/
│   │       └── page.tsx       # Class analytics
│   ├── struggles/
│   │   └── page.tsx           # Struggle alerts
│   └── layout.tsx             # Teacher layout
├── api/
│   └── proxy/                 # API proxy for backend services
├── layout.tsx                 # Root layout
└── page.tsx                   # Landing page
```

---

## Requirements

### 1. Authentication

**Framework**: Better Auth

**Features**:
- Email/password login
- JWT token storage (httpOnly cookies)
- Role-based routing (student vs teacher)
- Session persistence
- Protected routes middleware

**Pages**:
- `/login` - Login form
- `/register` - Registration form (optional for MVP)
- `/logout` - Logout action

**Middleware**:
```typescript
// middleware.ts
export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/teacher/:path*"]
}
```

---

### 2. Student Dashboard

**Route**: `/dashboard`

**Components**:
```tsx
// Progress Overview Card
<ProgressCard>
  <CircularProgress value={68} color="yellow" />
  <h2>Module 2: Control Flow</h2>
  <p>60% Complete • 3 day streak</p>
  <Button>Continue Learning</Button>
</ProgressCard>

// Module Grid
<ModuleGrid>
  {modules.map(module => (
    <ModuleCard mastery={module.mastery}>
      <Icon>{module.icon}</Icon>
      <h3>{module.name}</h3>
      <ProgressBar value={module.mastery} />
      <StatusBadge level={getLevel(module.mastery)} />
    </ModuleCard>
  ))}
</ModuleGrid>

// Recent Activity
<ActivityList>
  <ActivityItem type="exercise" title="For Loops Quiz" score="80%" />
  <ActivityItem type="code" title="Print Statement Exercise" status="passed" />
</ActivityList>
```

**Data Requirements**:
- Student progress from `/api/v1/progress/{student_id}`
- Module list from static config or API
- Recent activity from progress service

---

### 3. Module Detail Page

**Route**: `/modules/[id]`

**Components**:
```tsx
<ModuleHeader>
  <h1>Module 2: Control Flow</h1>
  <ProgressBar value={0.60} />
  <Tabs>
    <Tab>Overview</Tab>
    <Tab>Topics</Tab>
    <Tab>Exercises</Tab>
    <Tab>Quiz</Tab>
  </Tabs>
</ModuleHeader>

<TopicList>
  {topics.map(topic => (
    <TopicCard completed={topic.completed}>
      <h3>{topic.name}</h3>
      <p>{topic.description}</p>
      <Button>Start</Button>
    </TopicCard>
  ))}
</TopicList>
```

**Interactive Features**:
- Mark topic as complete
- Launch exercise for topic
- View topic explanation
- Practice quiz

---

### 4. Exercise Page (Monaco Editor)

**Route**: `/exercise/[id]`

**Components**:
```tsx
<ExerciseLayout>
  <ExercisePanel>
    <ExerciseHeader>
      <h2>For Loops Practice</h2>
      <DifficultyBadge level="easy" />
      <Points value={10} />
    </ExerciseHeader>

    <ExercisePrompt>
      <p>Write a for loop that prints numbers 1 to 5</p>
      <Hint>Use range(1, 6)</Hint>
    </ExercisePrompt>

    <TestCaseList>
      <TestCase input="1, 5" output="1\n2\n3\n4\n5" />
    </TestCaseList>
  </ExercisePanel>

  <EditorPanel>
    <MonacoEditor
      language="python"
      defaultValue="# Your code here"
      onChange={(code) => setCode(code)}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        tabSize: 4,
      }}
    />

    <EditorToolbar>
      <Button onClick={runCode}>▶ Run</Button>
      <Button onClick={submitCode}>✓ Submit</Button>
      <Button onClick={getHint}>💡 Hint</Button>
    </EditorToolbar>

    <OutputPanel>
      {output && <pre>{output}</pre>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </OutputPanel>
  </EditorPanel>
</ExerciseLayout>
```

**Monaco Editor Features**:
- Python syntax highlighting
- Auto-indentation
- Bracket matching
- Error squiggles
- Dark/light theme support
- Full-screen mode

**Code Execution**:
```typescript
async function runCode() {
  const response = await fetch('/api/execute', {
    method: 'POST',
    body: JSON.stringify({ code }),
  })
  const { output, error } = await response.json()
  setOutput(output)
  setError(error)
}
```

---

### 5. Chat Interface

**Route**: `/chat`

**Components**:
```tsx
<ChatLayout>
  <ChatHistory>
    {messages.map(msg => (
      <MessageBubble role={msg.role}>
        <Avatar agent={msg.agent} />
        <MessageContent>{msg.content}</MessageContent>
        <Timestamp>{msg.timestamp}</Timestamp>
      </MessageBubble>
    ))}
  </ChatHistory>

  <ChatInput>
    <textarea
      placeholder="Ask about Python concepts, get help debugging..."
      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
    />
    <Button onClick={sendMessage}>Send</Button>
  </ChatInput>

  <QuickActions>
    <Button>Explain for loops</Button>
    <Button>Debug my code</Button>
    <Button>Generate exercise</Button>
  </QuickActions>
</ChatLayout>
```

**Features**:
- Real-time streaming responses (Server-Sent Events or WebSocket)
- Agent indicator (which agent is responding)
- Code syntax highlighting in responses
- Quick action suggestions
- Conversation history persistence

**API Integration**:
```typescript
// Streaming response
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message, conversationId }),
})

const reader = response.body.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const chunk = new TextDecoder().decode(value)
  appendMessage(chunk)
}
```

---

### 6. Teacher Portal

**Route**: `/teacher/dashboard`

**Components**:
```tsx
<TeacherDashboard>
  <ClassOverview>
    <StatCard title="Total Students" value={24} />
    <StatCard title="Active Now" value={8} />
    <StatCard title="Struggling" value={3} urgent />
    <StatCard title="Avg Mastery" value={62}% />
  </ClassOverview>

  <StruggleAlerts>
    {struggles.map(struggle => (
      <AlertCard urgency={struggle.severity}>
        <StudentAvatar src={struggle.student.avatar} />
        <div>
          <h4>{struggle.student.name}</h4>
          <p>{struggle.reason}</p>
          <p>Same error: {struggle.errorCount}x • Stuck: {struggle.duration}</p>
        </div>
        <Button onClick={() => viewStudentWork(struggle.studentId)}>
          View Work
        </Button>
      </AlertCard>
    ))}
  </StruggleAlerts>

  <ClassProgressTable>
    <Table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Module</th>
          <th>Mastery</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map(student => (
          <tr>
            <td>{student.name}</td>
            <td>{student.currentModule}</td>
            <td><ProgressBar value={student.mastery} /></td>
            <td><StatusBadge level={getLevel(student.mastery)} /></td>
            <td>
              <Button onClick={() => generateExercise(student.id)}>
                Generate Exercise
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </ClassProgressTable>
</TeacherDashboard>
```

**Features**:
- Class overview statistics
- Real-time struggle alerts (via WebSocket)
- Student progress table
- Individual student drill-down
- Exercise generation interface

---

## State Management

### Zustand Store

```typescript
// stores/userStore.ts
interface UserStore {
  user: User | null
  student: Student | null
  teacher: Teacher | null
  setUser: (user: User) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  student: null,
  teacher: null,
  setUser: (user) => set({ user, student: user.student, teacher: user.teacher }),
  logout: () => set({ user: null, student: null, teacher: null }),
}))

// stores/codeStore.ts
interface CodeStore {
  code: string
  output: string
  error: string
  setCode: (code: string) => void
  setOutput: (output: string) => void
  setError: (error: string) => void
  runCode: () => Promise<void>
}

export const useCodeStore = create<CodeStore>((set, get) => ({
  code: '',
  output: '',
  error: '',
  setCode: (code) => set({ code }),
  setOutput: (output) => set({ output }),
  setError: (error) => set({ error }),
  runCode: async () => {
    const { code } = get()
    const response = await fetch('/api/execute', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
    const result = await response.json()
    set({ output: result.output, error: result.error })
  },
}))

// stores/chatStore.ts
interface ChatStore {
  messages: Message[]
  conversationId: string | null
  isTyping: boolean
  addMessage: (message: Message) => void
  setTyping: (typing: boolean) => void
  clearChat: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  conversationId: null,
  isTyping: false,
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  setTyping: (isTyping) => set({ isTyping }),
  clearChat: () => set({ messages: [], conversationId: null }),
}))
```

---

## Styling

### Tailwind CSS Configuration

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mastery: {
          beginner: '#ef4444',  // Red
          learning: '#eab308',  // Yellow
          proficient: '#22c55e', // Green
          mastered: '#3b82f6',   // Blue
        },
      },
      animation: {
        'typing': 'typing 1s infinite',
      },
      keyframes: {
        typing: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
export default config
```

---

## API Integration

### Backend Service Proxy

```typescript
// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function callAgent(agent: string, data: any) {
  const response = await fetch(`${BASE_URL}/api/v1/${agent}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function getProgress(studentId: string) {
  const response = await fetch(`${BASE_URL}/api/v1/progress/${studentId}`)
  return response.json()
}

export async function submitExercise(exerciseId: string, code: string) {
  const response = await fetch(`${BASE_URL}/api/v1/exercise/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ exercise_id: exerciseId, code }),
  })
  return response.json()
}
```

---

## Skills Used

### nextjs-k8s-deploy

**Location**: `.claude/skills/nextjs-k8s-deploy/`

**Scripts**:
- `scripts/deploy.sh` - Deploys Next.js app to Kubernetes
- `scripts/ingress.sh` - Configures Ingress routing
- `scripts/verify.py` - Verifies deployment health

**Usage**:
```bash
# Deploy Next.js app
./.claude/skills/nextjs-k8s-deploy/scripts/deploy.sh

# Configure ingress
./.claude/skills/nextjs-k8s-deploy/scripts/ingress.sh

# Verify deployment
python .claude/skills/nextjs-k8s-deploy/scripts/verify.py
```

---

## Docker Configuration

### Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

---

## Validation

### Health Checks

```bash
# Check Next.js pod
kubectl get pods -n learnflow -l app=learnflow-frontend

# Check service endpoint
kubectl get svc -n learnflow learnflow-frontend

# Test ingress
curl -I https://learnflow.local
```

### E2E Test Scenarios

1. **Student Login Flow**
   - Navigate to `/login`
   - Enter credentials
   - Redirect to `/dashboard`
   - Verify progress displays

2. **Exercise Completion Flow**
   - Navigate to `/exercise/[id]`
   - Write code in Monaco
   - Click "Run"
   - Verify output displays
   - Click "Submit"
   - Verify success message

3. **Chat Flow**
   - Navigate to `/chat`
   - Send message
   - Verify agent response
   - Verify streaming works

---

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| Mobile responsive | ✓ |
| Dark mode support | ✓ |
| Accessibility (WCAG 2.1) | AA |

---

## Dependencies

**Required**:
- Backend services deployed (from Phase 4)
- Kong API Gateway configured
- TLS certificates (for production)

**Blocking**:
- Phase 4 must be complete
- API endpoints must be accessible

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Monaco Editor bundle size | High | Medium | Use dynamic import, code splitting |
| CORS issues with API | Medium | Medium | Configure API gateway properly |
| State management complexity | Medium | Low | Keep Zustand stores simple |
| Real-time chat latency | Medium | High | Use WebSocket, implement retries |

---

## Deliverables

1. **Next.js Application**
   - All 6 page types implemented
   - Monaco Editor integrated
   - Authentication working

2. **Kubernetes Deployment**
   - Container image built and pushed
   - Deployment configured
   - Ingress routing set up

3. **Documentation**
   - Component storybook (optional)
   - API integration guide
   - Deployment playbook

---

## Next Phase

After Phase 5 completion, proceed to **Phase 6: Integration** where MCP servers will be created to provide real-time context to AI agents.
