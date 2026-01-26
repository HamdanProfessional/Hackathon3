# LearnFlow Frontend

AI-powered Python learning platform with intelligent tutoring and real-time code execution.

## Overview

LearnFlow is an innovative educational platform that helps students learn Python programming through:
- **AI-Powered Tutoring**: Conversational AI agents provide personalized help
- **Interactive Code Editor**: Write and execute Python code directly in the browser
- **Progress Tracking**: Visual mastery indicators and learning streaks
- **Adaptive Exercises**: Coding challenges that adjust to your skill level
- **Teacher Dashboard**: Monitor student progress and identify struggling learners

## Tech Stack

- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom Nebula Space theme
- **State Management**: Zustand
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Deployment**: Kubernetes with Docker

## Project Structure

```
learnflow-app/frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   ├── (student)/           # Student pages
│   ├── teacher/             # Teacher pages
│   ├── api/                 # API routes (SSE streaming)
│   └── globals.css          # Global styles & Nebula theme
├── components/              # React components
│   ├── ui/                  # Base UI components (shadcn/ui)
│   ├── ChatLayout.tsx       # Chat interface
│   ├── MonacoEditor.tsx     # Code editor (dynamic import)
│   └── [16 more components]
├── stores/                  # Zustand state stores
├── lib/                     # Utilities (API client, auth)
├── k8s/                     # Kubernetes manifests
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- (Optional) Minikube for local development

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Demo Accounts

```
Student: student@example.com / demo123
Teacher: teacher@example.com / demo123
```

## Design System

### Nebula Space Theme

The application uses a cosmic dark theme with:
- **Background**: Deep space dark (`#0f111a`)
- **Primary**: Nebula violet (`#8b5cf6`)
- **Accents**: Cosmic blue, pink, cyan
- **Effects**: Starfield background, glass morphism, gradient glows

### Mastery Level Colors

| Level | Range | Color | Label |
|-------|-------|-------|-------|
| Beginner | 0-40% | Red | "Getting Started" |
| Learning | 41-70% | Yellow | "Making Progress" |
| Proficient | 71-90% | Green | "Almost There" |
| Mastered | 91-100% | Blue | "Mastered!" |

### Difficulty Colors

| Difficulty | Color |
|------------|-------|
| Easy | Green (`bg-success/20 text-success`) |
| Medium | Orange/Yellow (`bg-warning/20 text-warning`) |
| Hard | Red (`bg-destructive/20 text-destructive`) |

## Pages and Routes

### Student Routes

| Route | Purpose | Components |
|-------|---------|-------------|
| `/` | Landing page | Hero, features, CTA |
| `/login` | Login | Auth form with demo accounts |
| `/register` | Registration | Sign up form |
| `/dashboard` | Student dashboard | Progress, modules, streaks |
| `/exercise` | Exercise list | All exercises with filters |
| `/exercise/[id] | Single exercise | Instructions, editor, output |
| `/chat` | AI tutor chat | Real-time streaming chat |

### Teacher Routes

| Route | Purpose | Features |
|-------|---------|----------|
| `/teacher/dashboard` | Teacher dashboard | Class stats, struggle alerts, live monitoring |

## Components

### Core Components (16 total)

| Component | Purpose | Props |
|-----------|---------|-------|
| `ChatLayout` | Chat container | - |
| `ChatHistory` | Message list | - |
| `ChatInput` | Input field | - |
| `MessageBubble` | Single message | message, role |
| `MonacoEditor` | Code editor | value, onChange, language |
| `EditorPanel` | Editor + toolbar | onRun, onSubmit |
| `OutputPanel` | Code output | - |
| `ModuleCard` | Module display | module data |
| `ProgressCard` | Progress indicator | mastery percentage |
| `ClassOverview` | Class statistics | overview data |
| `StatCard` | Metric card | label, value |
| `StruggleAlerts` | Alert list | alerts, onResolve |
| `TeacherNav` | Teacher nav | - |

## API Integration

### Backend Services

| Service | URL | Purpose |
|---------|-----|---------|
| Triage | `:8001` | Query routing |
| Concepts | `:8002` | Concept explanations |
| Debug | `:8003` | Error analysis |
| Exercise | `:8004` | Exercise generation/grading |
| Progress | `:8005` | Progress tracking |
| Code Review | `:8006` | Code quality analysis |

### Environment Variables

Create `.env.local`:

```env
# Backend Service URLs (for local development)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
NEXT_PUBLIC_TRIAGE_URL=http://localhost:8001
NEXT_PUBLIC_CONCEPTS_URL=http://localhost:8002
NEXT_PUBLIC_DEBUG_URL=http://localhost:8003
NEXT_PUBLIC_EXERCISE_URL=http://localhost:8004
NEXT_PUBLIC_PROGRESS_URL=http://localhost:8005
NEXT_PUBLIC_CODE_REVIEW_URL=http://localhost:8006

# Kubernetes Service URLs (for production)
# NEXT_PUBLIC_API_BASE_URL=http://triage-service.learnflow.svc.cluster.local:8001
# etc...

# Auth (if using Better Auth)
NEXTAUTH_SECRET=learnflow-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

## Deployment

### Docker Build

```bash
cd learnflow-app/frontend
docker build -t learnflow-frontend:v1 .
```

### Kubernetes Deployment

```bash
# Using deployment script
./deploy.sh          # Bash
./deploy.ps1          # PowerShell

# Or manual deployment
kubectl apply -f k8s/
```

### Access the Application

```bash
# Port forward for local access
kubectl port-forward -n learnflow svc/learnflow-frontend 3000:80

# Open browser to http://localhost:3000
```

## Features

### For Students

1. **Dashboard**: View overall progress, learning streak, and module completion
2. **Code Exercises**: Practice Python with hands-on coding challenges
3. **Monaco Editor**: Full-featured code editor with Python syntax highlighting
4. **AI Tutor**: Get help with Python concepts via conversational AI
5. **Progressive Hints**: Get hints that guide you without giving answers
6. **Real-time Feedback**: See code execution output immediately

### For Teachers

1. **Class Overview**: See total students, active users, and average mastery
2. **Struggle Alerts**: Real-time notifications when students need help
3. **Top Performers**: Identify students doing well
4. **Live Monitoring**: Real-time updates via Server-Sent Events
5. **Exercise Generation**: Create custom exercises for students

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### File Watching

The app uses Next.js Fast Refresh for hot module replacement during development.

### State Management

Zustand stores with persistence:
- `userStore`: User authentication state
- `codeStore`: Code editor state with localStorage persistence
- `chatStore`: Chat messages with history
- `progressStore`: Learning progress data

## License

This project is part of the LearnFlow Hackathon 3 submission.

## Related Links

- [Backend Services](../../backend/README.md)
- [MCP Servers](../../backend/mcp-servers/README.md)
- [Project Documentation](../../docs/README.md)
- [Skills Library](../../README.md)

## Troubleshooting

### Common Issues

**Issue**: `Module not found` errors
**Solution**: Run `npm install` to install dependencies

**Issue**: Monaco Editor not loading
**Solution**: Ensure `@monaco-editor/react` is installed

**Issue**: API calls failing
**Solution**: Verify backend services are running on ports 8001-8006

**Issue**: Kubernetes pods not starting
**Solution**: Check Docker images are built and loaded to Minikube

---

**Last Updated**: 2026-01-26
**Version**: 1.0.0
**Status**: Production Ready
