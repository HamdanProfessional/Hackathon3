---
slug: /
title: Introduction
sidebar_position: 1
---

# Welcome to LearnFlow 🎓

LearnFlow is an AI-powered Python learning platform that uses autonomous AI agents to provide personalized tutoring, real-time code feedback, and adaptive learning paths.

![LearnFlow](https://img.shields.io/badge/LearnFlow-AI--purple.svg)
![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🌟 Key Features

### 🤖 AI-Powered Tutoring
- **Multi-Agent System**: 7 specialized AI agents (Triage, Concepts, Debug, Exercise, Progress, Code Review, Chat)
- **Adaptive Learning**: Explanations adjust to student mastery level (Beginner → Learning → Proficient → Mastered)
- **Progressive Hints**: Guided debugging that builds problem-solving skills
- **Struggle Detection**: Automatic alerts when students need help

### 💻 Interactive Coding
- **Browser-Based Editor**: Monaco-powered code editor with Python syntax highlighting
- **Safe Execution**: Sandboxed Python execution with resource limits
- **Instant Feedback**: Real-time code review and auto-grading
- **40+ Exercises**: Hands-on coding challenges across 8 modules

### 📊 Progress Tracking
- **Mastery Scores**: Weighted calculation based on exercises, quizzes, quality, and streak
- **Learning Streaks**: Gamification to encourage consistent practice
- **Module Progress**: Track completion across 8 comprehensive Python modules
- **Teacher Dashboard**: Real-time class overview with struggle alerts

### 🏗️ Modern Architecture
- **Microservices**: 7 FastAPI backend services with Dapr sidecars
- **Event Streaming**: Kafka-based pub/sub for real-time updates
- **Kubernetes-Ready**: Helm charts for local and cloud deployment
- **MCP Integration**: Model Context Protocol servers for AI agent context access

## 🎯 Target Audience

- **Students**: Learn Python through interactive exercises and AI tutoring
- **Teachers**: Monitor class progress, identify struggling students, create assignments
- **Developers**: Extend the platform with Skills-based autonomous deployment

## 🚀 Quick Links

- [Quick Start Guide](/quickstart)
- [Architecture Overview](/architecture-overview)
- [API Reference](/backend-api)
- [Deployment Guide](/local-setup)

## 📚 Documentation Structure

| Section | Description |
|---------|-------------|
| [User Guide](/student-guide) | Student and teacher guides |
| [Backend Services](/backend-services) | API documentation and service architecture |
| [Frontend](/frontend-overview) | Component architecture and state management |
| [MCP Servers](/mcp-overview) | Model Context Protocol server documentation |
| [Deployment](/local-setup) | Local development and Kubernetes setup |

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     LearnFlow Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐     ┌─────────────┐     ┌──────────────┐      │
│  │ Frontend │ ◄──► │   API Gateway  │ ◄──► │ MCP Servers │      │
│  │ Next.js   │     │  (Optional)   │     │  (AI Agent)  │      │
│  └──────────┘     └─────────────┘     └──────────────┘      │
│         │                                       │                │
│         ▼                                       ▼                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Backend Microservices (Dapr Sidecars)          │   │
│  ├──────────┬─────────┬─────────┬──────────┬─────────────┤   │
│  │ Triage   │Concepts │  Debug  │ Exercise │  Progress    │   │
│  │ Service │ Service │ Service │ Service │   Service    │   │
│  │ (8001)   │ (8002)  │ (8003)  │ (8004)  │   (8005)     │   │
│ └──────────┴─────────┴─────────┴──────────┴─────────────┘   │
│         │                                       │                │
│         ▼                                       ▼                │
│  ┌──────────────┐     ┌──────────────────────────────────────┐  │
│  │    Kafka     │     │          PostgreSQL                 │  │
│  │  (Events)    │     │        (Persistence)              │  │
│  └──────────────┘     └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🎓 Learning Modules

1. **Python Basics** - Variables, data types, operators, I/O
2. **Control Flow** - If statements, loops, control structures
3. **Functions** - Definition, parameters, scope, closures
4. **Data Structures** - Lists, dictionaries, tuples, sets
5. **File Operations** - Reading, writing, file management
6. **Error Handling** - Try/except blocks, exceptions
7. **OOP** - Classes, objects, inheritance, polymorphism
8. **Advanced Python** - Decorators, generators, metaprogramming

## 🔧 Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15, TypeScript, Monaco Editor, Tailwind CSS |
| Backend | FastAPI, Python 3.10+, Dapr |
| Database | PostgreSQL with SQLAlchemy |
| Messaging | Apache Kafka |
| Infrastructure | Docker, Kubernetes, Helm |
| AI/ML | OpenAI API, MCP Protocol |
| Development | Git, GitHub Actions |

## 📈 Project Status

| Phase | Status | Completion |
|-------|--------|------------|
| 1: Setup | ✅ Complete | 90% |
| 2: Foundation | ✅ Complete | 100% |
| 3: Infrastructure | ✅ Complete | 95% |
| 4: Backend | ✅ Complete | 95% |
| 5: Frontend | ✅ Complete | 100% |
| 6: Integration | ✅ Complete | 100% (4/4 MCP servers) |
| 7: Build | ✅ Complete | 90% |
| 8: Documentation | 🔄 In Progress | 60% |
| 9: Cloud Deployment | ⚠️ Local Only | 10% |
| 10: CI/CD | ❌ Not Started | 0% |

## 🤝 Contributing

We welcome contributions! See [Development Guide](/local-setup) for details.

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for the Python learning community**
