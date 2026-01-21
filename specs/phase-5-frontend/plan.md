# Phase 5: Frontend Development - Implementation Plan

**Phase**: 5
**Focus**: Build Next.js frontend with Monaco Editor for LearnFlow
**Status**: Draft

---

## Architecture Overview

Building a Next.js 14 web application with:

- **App Router** - React Server Components
- **Monaco Editor** - Embedded code editor with Python syntax
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Better Auth** - Authentication

### Key Pages

1. **Login** - `/login` - Authentication
2. **Student Dashboard** - `/dashboard` - Progress overview
3. **Module Detail** - `/modules/[id]` - Module topics
4. **Exercise Page** - `/exercise/[id]` - Monaco editor with code execution
5. **Chat Interface** - `/chat` - AI tutoring
6. **Teacher Dashboard** - `/teacher/dashboard` - Class analytics

---

## Implementation Strategy

### Approach: Skills-Based Autonomous Build

**Principle**: Use `nextjs-k8s-deploy` skill to scaffold and deploy frontend.

**Build Process**:
1. Use `nextjs-k8s-deploy` skill to generate Next.js app
2. Install Monaco Editor and dependencies
3. Implement pages with App Router
4. Add API integration layer
5. Configure authentication
6. Deploy to Kubernetes

---

## Step-by-Step Implementation

### Step 1: Prerequisites Verification

**Goal**: Ensure backend services from Phase 4 are ready.

**Actions**:
- [ ] Verify all 5 backend services running
- [ ] Verify API endpoints accessible
- [ ] Verify Kong API Gateway configured
- [ ] Get API base URL

**Commands**:
```bash
# Check backend services
kubectl get pods -n learnflow

# Check services
kubectl get svc -n learnflow

# Test API gateway
curl http://api-gateway:8000/health
```

---

### Step 2: Next.js App Scaffolding

**Using nextjs-k8s-deploy Skill**:
```bash
python .claude/skills/nextjs-k8s-deploy/scripts/generate.py \
    --name learnflow-frontend \
    --typescript \
    --tailwind \
    --app-router
```

**Project Structure**:
```
learnflow-frontend/
├── app/
│   ├── (auth)/
│   ├── (student)/
│   ├── (teacher)/
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── student/
│   ├── teacher/
│   └── chat/
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── store.ts
├── styles/
│   └── globals.css
├── public/
│   └── icons/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

### Step 3: Dependencies Installation

**Install Required Packages**:
```bash
# Monaco Editor
npm install @monaco-editor/react

# State Management
npm install zustand

# Authentication
npm install better-auth
npm install better-auth/react

# HTTP Client
npm install axios

# UI Components
npm install @headlessui/react
npm install @heroicons/react

# Utilities
npm install date-fns
npm install clsx
npm install tailwind-merge
```

---

### Step 4: Authentication Setup

**Implement Better Auth**:

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  secret: process.env.AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
})

// middleware.ts
export { auth as middleware } from "@/lib/auth"
export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/teacher/:path*"]
}
```

**Login Page**:
```tsx
// app/(auth)/login/page.tsx
"use client"

import { authClient } from "@/lib/auth"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await authClient.signIn.email({ email, password })
    window.location.href = "/dashboard"
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

---

### Step 5: Student Dashboard

**Implement Dashboard**:

```tsx
// app/(student)/dashboard/page.tsx
"use client"

import { useUserStore } from "@/lib/store"
import { useEffect } from "react"
import ProgressCard from "@/components/student/ProgressCard"
import ModuleGrid from "@/components/student/ModuleGrid"
import ActivityList from "@/components/student/ActivityList"

export default function DashboardPage() {
  const { student, fetchProgress } = useUserStore()

  useEffect(() => {
    fetchProgress()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {student?.name}!</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProgressCard progress={student?.progress} />
          <ModuleGrid modules={student?.modules} />
        </div>
        <div>
          <ActivityList activities={student?.recentActivity} />
        </div>
      </div>
    </div>
  )
}
```

**Progress Card Component**:
```tsx
// components/student/ProgressCard.tsx
interface ProgressCardProps {
  progress: {
    currentModule: string
    mastery: number
    streak: number
  }
}

export default function ProgressCard({ progress }: ProgressCardProps) {
  const level = getLevel(progress.mastery)
  const color = getLevelColor(level)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Current Progress</h2>
        <span className={`px-3 py-1 rounded-full text-sm bg-${color}-100 text-${color}-800`}>
          {level}
        </span>
      </div>

      <div className="relative pt-1">
        <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${progress.mastery * 100}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${color}-500`}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">{progress.streak}</p>
          <p className="text-sm text-gray-500">Day Streak</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{Math.round(progress.mastery * 100)}%</p>
          <p className="text-sm text-gray-500">Mastery</p>
        </div>
      </div>
    </div>
  )
}
```

---

### Step 6: Monaco Editor Integration

**Install Monaco Editor**:
```bash
npm install @monaco-editor/react
```

**Create Editor Component**:
```tsx
// components/editor/MonacoEditor.tsx
"use client"

import Editor from "@monaco-editor/react"
import { useState } from "react"

interface MonacoEditorProps {
  defaultValue?: string
  onChange?: (value: string) => void
  onRun?: (code: string) => void
  onSubmit?: (code: string) => void
}

export default function MonacoEditor({
  defaultValue = "# Your code here",
  onChange,
  onRun,
  onSubmit,
}: MonacoEditorProps) {
  const [code, setCode] = useState(defaultValue)

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || ""
    setCode(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 border rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            tabSize: 4,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onRun?.(code)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ▶ Run
        </button>
        <button
          onClick={() => onSubmit?.(code)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ✓ Submit
        </button>
        <button
          onClick={() => {/* Get hint */}}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          💡 Hint
        </button>
      </div>
    </div>
  )
}
```

---

### Step 7: Exercise Page

**Implement Exercise Page**:

```tsx
// app/(student)/exercise/[id]/page.tsx
"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import MonacoEditor from "@/components/editor/MonacoEditor"
import OutputPanel from "@/components/exercise/OutputPanel"
import ExercisePrompt from "@/components/exercise/ExercisePrompt"

export default function ExercisePage() {
  const params = useParams()
  const [exercise, setExercise] = useState(null)
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchExercise(params.id)
  }, [params.id])

  const fetchExercise = async (id: string) => {
    const response = await fetch(`/api/exercise/${id}`)
    const data = await response.json()
    setExercise(data)
  }

  const handleRun = async (code: string) => {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
    const result = await response.json()
    setOutput(result.output)
    setError(result.error)
  }

  const handleSubmit = async (code: string) => {
    const response = await fetch(`/api/exercise/${params.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
    const result = await response.json()
    if (result.passed) {
      alert("Exercise passed! 🎉")
    }
  }

  return (
    <div className="h-screen flex">
      <div className="w-1/2 p-6 overflow-y-auto">
        <ExercisePrompt exercise={exercise} />
      </div>
      <div className="w-1/2 flex flex-col">
        <div className="flex-1 p-4">
          <MonacoEditor
            defaultValue={exercise?.starter_code}
            onRun={handleRun}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="h-1/3 p-4 border-t">
          <OutputPanel output={output} error={error} />
        </div>
      </div>
    </div>
  )
}
```

---

### Step 8: Chat Interface

**Implement Chat Page**:

```tsx
// app/(student)/chat/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useChatStore } from "@/lib/store"

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, addMessage, isTyping } = useChatStore()
  const [input, setInput] = useState("")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    addMessage({ role: "user", content: input })
    setInput("")

    // Send to backend
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    })

    // Stream response
    const reader = response.body?.getReader()
    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = new TextDecoder().decode(value)
        addMessage({ role: "assistant", content: chunk })
      }
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-2xl px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-gray-500">Agent is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about Python concepts, get help debugging..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

### Step 9: Teacher Portal

**Implement Teacher Dashboard**:

```tsx
// app/(teacher)/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"

export default function TeacherDashboard() {
  const [stats, setStats] = useState(null)
  const [struggles, setStruggles] = useState([])

  useEffect(() => {
    fetchStats()
    fetchStruggles()
  }, [])

  const fetchStats = async () => {
    const response = await fetch("/api/teacher/stats")
    const data = await response.json()
    setStats(data)
  }

  const fetchStruggles = async () => {
    const response = await fetch("/api/teacher/struggles")
    const data = await response.json()
    setStruggles(data)
  }

  const generateExercise = async (studentId: string) => {
    // Generate custom exercise for struggling student
    await fetch(`/api/teacher/generate-exercise/${studentId}`, {
      method: "POST",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Students" value={stats?.totalStudents} />
        <StatCard title="Active Now" value={stats?.activeNow} />
        <StatCard title="Struggling" value={stats?.struggling} urgent />
        <StatCard title="Avg Mastery" value={`${stats?.avgMastery}%`} />
      </div>

      {/* Struggle Alerts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Struggle Alerts</h2>
        </div>
        <div className="divide-y">
          {struggles.map((struggle) => (
            <div key={struggle.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{struggle.studentName}</h3>
                <p className="text-sm text-gray-500">{struggle.reason}</p>
                <p className="text-sm text-gray-400">
                  Same error: {struggle.errorCount}x • Stuck: {struggle.duration}
                </p>
              </div>
              <button
                onClick={() => generateExercise(struggle.studentId)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Generate Exercise
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

### Step 10: API Integration Layer

**Create API Client**:

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function callAgent(
  agent: string,
  data: Record<string, unknown>
) {
  const response = await fetch(`${API_BASE}/api/v1/${agent}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function getProgress(studentId: string) {
  const response = await fetch(`${API_BASE}/api/v1/progress/${studentId}`)
  return response.json()
}

export async function submitExercise(exerciseId: string, code: string) {
  const response = await fetch(`${API_BASE}/api/v1/exercise/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ exercise_id: exerciseId, code }),
  })
  return response.json()
}

export async function executeCode(code: string) {
  const response = await fetch(`${API_BASE}/api/v1/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  })
  return response.json()
}
```

**API Routes**:
```typescript
// app/api/execute/route.ts
import { executeCode } from "@/lib/api"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { code } = await request.json()

  // Call backend execution service
  const result = await executeCode(code)

  return NextResponse.json(result)
}
```

---

### Step 11: State Management

**Create Zustand Stores**:

```typescript
// lib/store.ts
import { create } from "zustand"

interface User {
  id: string
  email: string
  name: string
  role: "student" | "teacher"
}

interface StudentProgress {
  currentModule: string
  mastery: number
  modules: Module[]
  recentActivity: Activity[]
  streak: number
}

interface UserStore {
  user: User | null
  student: StudentProgress | null
  setUser: (user: User) => void
  fetchProgress: () => Promise<void>
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  student: null,
  setUser: (user) => set({ user }),
  fetchProgress: async () => {
    const { user } = get()
    if (!user) return

    const progress = await getProgress(user.id)
    set({ student: progress })
  },
}))

interface Message {
  role: "user" | "assistant"
  content: string
  agent?: string
}

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
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (isTyping) => set({ isTyping }),
  clearChat: () => set({ messages: [], conversationId: null }),
}))

interface CodeStore {
  code: string
  output: string
  error: string
  setCode: (code: string) => void
  setOutput: (output: string) => void
  setError: (error: string) => void
}

export const useCodeStore = create<CodeStore>((set) => ({
  code: "",
  output: "",
  error: "",
  setCode: (code) => set({ code }),
  setOutput: (output) => set({ output }),
  setError: (error) => set({ error }),
}))
```

---

### Step 12: Styling with Tailwind

**Configure Tailwind**:

```javascript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mastery: {
          beginner: "#ef4444",
          learning: "#eab308",
          proficient: "#22c55e",
          mastered: "#3b82f6",
        },
      },
      animation: {
        "typing": "typing 1s infinite",
      },
      keyframes: {
        typing: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
}
export default config
```

**Global Styles**:
```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
}

.monaco-editor {
  padding: 0 !important;
}
```

---

### Step 13: Kubernetes Deployment

**Using nextjs-k8s-deploy Skill**:
```bash
# Deploy to Kubernetes
./.claude/skills/nextjs-k8s-deploy/scripts/deploy.sh

# Configure ingress
./.claude/skills/nextjs-k8s-deploy/scripts/ingress.sh
```

**Dockerfile**:
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

CMD ["node", "server.js"]
```

---

## Testing Strategy

### Component Tests
```bash
# Test React components
npm test
```

### E2E Tests
```bash
# Test user flows
npx playwright test
```

### Accessibility Tests
```bash
# Check a11y
npm run lighthouse
```

---

## Success Criteria Validation

- [ ] Next.js app deployed to `learnflow` namespace
- [ ] All 6 page types implemented
- [ ] Monaco Editor embedded and functional
- [ ] Student dashboard displays progress
- [ ] Chat interface with AI agents working
- [ ] Code execution sandbox working
- [ ] Teacher portal with struggle alerts
- [ ] JWT authentication integrated
- [ ] Responsive design verified
- [ ] Zero manual intervention

---

## Rollback Plan

If deployment fails:
1. Check pod logs: `kubectl logs -n learnflow learnflow-frontend-*`
2. Check build logs: `kubectl describe pod -n learnflow learnflow-frontend-*`
3. Rollback: `kubectl rollout undo deployment/learnflow-frontend`
4. Verify API connectivity

---

## Dependencies

**Required**:
- Backend services deployed (Phase 4)
- Kong API Gateway configured
- TLS certificates (for production)

**Blocking**:
- Phase 4 must be complete
- API endpoints must be accessible
