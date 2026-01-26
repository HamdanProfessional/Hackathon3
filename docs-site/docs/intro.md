---
title: Welcome to LearnFlow
slug: /
---

# Welcome to LearnFlow

**AI-Powered Python Learning Platform with Autonomous Deployment**

LearnFlow is an intelligent learning platform that helps students master Python programming through conversational AI agents, interactive coding exercises, and real-time feedback.

![LearnFlow Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-production--ready-success)
![License](https://img.shields.io/badge/license-MIT-purple)

## What is LearnFlow?

LearnFlow combines modern cloud-native technologies with AI to create an immersive learning experience:

- **6 AI Agents** - Specialized tutors for concepts, debugging, exercises, progress tracking, and code review
- **Interactive Code Editor** - Monaco Editor with live Python execution
- **Mastery Tracking** - Adaptive learning paths based on your progress
- **Exercise Generator** - Personalized coding challenges that match your skill level
- **Real-Time Feedback** - Instant responses from AI tutors as you learn

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/learnflow/learnflow.git
cd learnflow/learnflow-app/frontend
npm install
```

### 2. Start Backend Services

```bash
cd ../../backend
python services/triage/main.py      # Terminal 1 (Port 8001)
python services/concepts/main.py     # Terminal 2 (Port 8002)
python services/debug/main.py        # Terminal 3 (Port 8003)
python services/exercise/main.py     # Terminal 4 (Port 8004)
python services/progress/main.py     # Terminal 5 (Port 8005)
python services/code-review/main.py  # Terminal 6 (Port 8006)
```

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

Access at **http://localhost:3000**

## Architecture

- **Next.js 15** frontend with TypeScript and Tailwind CSS
- **FastAPI** backend services (6 microservices)
- **MCP Servers** for database and code execution
- **Dapr** service mesh for event-driven communication
- **Kafka/Redpanda** for messaging between services

## Documentation

- [Architecture](./architecture-complete) - Complete system architecture
- [Overview](./overview) - Documentation index
- [Skills Catalog](./SKILLS_CATALOG) - Autonomous deployment skills
- [Phase 3: Infrastructure](./phase-3-complete) - Kafka and PostgreSQL deployment
- [Phase 4: Backend Services](./phase-4-final-complete) - All 6 microservices deployed

## Features

### AI-Powered Learning

- Intelligent Query Routing - Automatically directs questions to the right specialist agent
- Adaptive Explanations - Concepts are explained at your mastery level
- Code Debugging Assistance - Get hints and explanations for errors
- Personalized Exercises - Challenges generated based on your progress

### Real-Time Interaction

- Live Code Execution - Run Python code directly in the browser
- Streaming Chat - Real-time responses from AI tutors
- Instant Feedback - Immediate grading and suggestions

## Support

- **GitHub**: [https://github.com/learnflow/learnflow](https://github.com/learnflow/learnflow)
- **Issues**: [https://github.com/learnflow/learnflow/issues](https://github.com/learnflow/learnflow/issues)

## License

MIT License - see LICENSE file for details
