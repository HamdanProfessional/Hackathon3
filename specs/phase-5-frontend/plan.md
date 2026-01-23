# Phase 5: Frontend User Interface - Implementation Plan

**Phase**: 5
**Focus**: Build web-based user interface for LearnFlow
**Status**: Draft

---

## Technical Context

### System Overview

This phase implements a responsive web application serving both students and teachers. The application:

1. **Renders in browsers** without requiring plugins
2. **Communicates with backend services** via HTTP APIs
3. **Streams real-time updates** via WebSocket or SSE
4. **Persists user state** across page navigation
5. **Deploys autonomously** via Skills

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 14+ (App Router) | React framework with SSR, file-based routing |
| **Language** | TypeScript | Type safety for complex UI state |
| **Styling** | Tailwind CSS | Utility-first CSS, responsive design |
| **Editor** | Monaco Editor | VS Code's editor component, Python support |
| **State** | Zustand | Lightweight state management |
| **Auth** | Better Auth | Simple, flexible authentication |
| **API** | fetch/axios | HTTP client for backend communication |
| **Real-time** | WebSocket/SSE | Streaming chat responses |
| **Container** | Docker | Standard packaging |
| **Orchestration** | Kubernetes | Existing cluster from Phase 1 |

### Unknowns Requiring Research

- [RESEARCH-1] Monaco Editor optimal bundle strategy for code splitting
- [RESEARCH-2] WebSocket vs SSE for chat streaming (latency/reliability)
- [RESEARCH-3] State management pattern for complex multi-user flows
- [RESEARCH-4] Optimal strategy for real-time struggle alerts to teachers

---

## Constitution Check

### Applicable Principles

From `.specify/memory/constitution.md`:

| Principle | Compliance | Notes |
|-----------|------------|-------|
| **Skills-First Development** | ✅ PASS | Frontend deployable via `nextjs-k8s-deploy` skill |
| **Token Efficiency** | ✅ PASS | Code execution via MCP server (not direct integration) |
| **Stateless Services** | ✅ PASS | State in browser/Zustand, backend remains stateless |
| **Cross-Agent Compatibility** | ✅ PASS | Skills work with Claude Code and Goose |
| **Event-Driven Architecture** | ✅ PASS | Frontend subscribes to struggle alerts via WebSocket |

### Non-Compliant Items

None identified. All design decisions align with project constitution.

---

## Phase 0: Research & Decisions

> **Output**: `research.md`

See [research.md](./research.md) for detailed decisions on:
- Monaco Editor lazy loading (dynamic import)
- SSE chosen over WebSocket (simpler, sufficient for chat)
- Zustand store structure (user, code, chat, progress)
- SSE for struggle alerts (teacher dashboard)

---

## Phase 1: Design & Contracts

### Component Structure

> **Output**: `data-model.md`

See [data-model.md](./data-model.md) for component definitions:
- Page components (Dashboard, Chat, Exercise, etc.)
- Reusable UI components (ProgressCard, ModuleCard, etc.)
- State stores (userStore, codeStore, chatStore, progressStore)
- API client functions

### Page Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/login` | LoginPage | User authentication |
| `/dashboard` | StudentDashboard | Student progress overview |
| `/modules/[id]` | ModuleDetail | Module topics and exercises |
| `/exercise/[id]` | ExercisePage | Code editor with exercise |
| `/chat` | ChatInterface | AI tutoring chat |
| `/teacher/dashboard` | TeacherDashboard | Class overview and alerts |

### Quickstart Scenarios

> **Output**: `quickstart.md`

See [quickstart.md](./quickstart.md) for integration test scenarios:
1. Student logs in and views progress
2. Student completes exercise with Monaco Editor
3. Student chats with AI tutor
4. Teacher views struggle alerts and assigns exercise

---

## Implementation Steps

### Step 1: Project Setup

**Files**:
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/next.config.js`
- `frontend/tailwind.config.ts`
- `frontend/.env.local`

**Description**: Initialize Next.js project with TypeScript and Tailwind CSS.

---

### Step 2: Authentication

**Files**:
- `frontend/app/(auth)/login/page.tsx`
- `frontend/app/(auth)/layout.tsx`
- `frontend/lib/auth.ts`
- `frontend/middleware.ts`

**Description**: Implement authentication flow with role-based routing.

---

### Step 3: Student Dashboard

**Files**:
- `frontend/app/(student)/dashboard/page.tsx`
- `frontend/components/ProgressCard.tsx`
- `frontend/components/ModuleCard.tsx`
- `frontend/components/ModuleGrid.tsx`
- `frontend/components/ActivityList.tsx`

**Description**: Build student dashboard with progress visualization.

---

### Step 4: Code Editor (Monaco)

**Files**:
- `frontend/app/(student)/exercise/[id]/page.tsx`
- `frontend/components/MonacoEditor.tsx`
- `frontend/components/EditorPanel.tsx`
- `frontend/components/EditorToolbar.tsx`
- `frontend/components/OutputPanel.tsx`

**Description**: Integrate Monaco Editor with Python syntax highlighting.

---

### Step 5: Chat Interface

**Files**:
- `frontend/app/(student)/chat/page.tsx`
- `frontend/components/ChatLayout.tsx`
- `frontend/components/ChatHistory.tsx`
- `frontend/components/ChatInput.tsx`
- `frontend/components/MessageBubble.tsx`

**Description**: Build chat interface with SSE streaming.

---

### Step 6: Teacher Portal

**Files**:
- `frontend/app/(teacher)/dashboard/page.tsx`
- `frontend/components/TeacherDashboard.tsx`
- `frontend/components/ClassOverview.tsx`
- `frontend/components/StruggleAlerts.tsx`
- `frontend/components/ClassProgressTable.tsx`

**Description**: Build teacher dashboard with struggle alerts.

---

### Step 7: State Management

**Files**:
- `frontend/stores/userStore.ts`
- `frontend/stores/codeStore.ts`
- `frontend/stores/chatStore.ts`
- `frontend/stores/progressStore.ts`

**Description**: Implement Zustand stores for application state.

---

### Step 8: API Integration

**Files**:
- `frontend/lib/api.ts`
- `frontend/lib/execute.ts`
- `frontend/app/api/proxy/[...path]/route.ts`

**Description**: Create API client functions and proxy routes.

---

### Step 9: Styling

**Files**:
- `frontend/app/globals.css`
- `frontend/tailwind.config.ts`
- `frontend/components/ui/` (reusable components)

**Description**: Apply Tailwind CSS styling with mastery level colors.

---

### Step 10: Kubernetes Deployment

**Files**:
- `frontend/Dockerfile`
- `frontend/.dockerignore`
- `frontend/k8s/deployment.yaml`
- `frontend/k8s/service.yaml`
- `frontend/k8s/ingress.yaml`

**Description**: Build container image and deploy to Kubernetes.

---

## Skills Used

| Skill | Purpose | When Used |
|-------|---------|-----------|
| `nextjs-k8s-deploy` | Deploy Next.js to Kubernetes | Step 10 |
| `frontend-component` | Build UI components | Steps 3-6 |

---

## Dependencies

### Internal Dependencies
- Phase 4: Backend Services (API endpoints available)
- Phase 3: Infrastructure (Kubernetes cluster ready)

### External Dependencies
- Authentication provider (or self-hosted)
- Code execution MCP server (from Phase 6)

---

## Success Criteria

- [ ] Next.js application deploys to Kubernetes
- [ ] Monaco Editor loads and functions
- [ ] Students can complete exercises
- [ ] Chat interface streams responses
- [ ] Teachers receive struggle alerts
- [ ] Responsive on desktop and tablet
- [ ] Authentication works correctly
- [ ] Deployment via Skills succeeds

---

## Next Steps

1. Run `/sp.implement` to execute this plan
2. Create ADRs for architecturally significant decisions
3. Update AGENTS.md with frontend details
