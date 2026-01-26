---
title: Quick Start Guide
sidebar_position: 2
---

# Quick Start Guide

Get up and running with LearnFlow in 5 minutes.

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Git

## 1. Clone and Install

```bash
git clone https://github.com/learnflow/learnflow.git
cd learnflow/learnflow-app/frontend
npm install
```

## 2. Start Backend

```bash
cd learnflow-app/backend
python services/triage/main.py      # Terminal 1
python services/concepts/main.py     # Terminal 2
python services/debug/main.py        # Terminal 3
python services/exercise/main.py     # Terminal 4
python services/progress/main.py     # Terminal 5
python services/code-review/main.py  # Terminal 6
```

## 3. Start MCP Servers

```bash
cd mcp-servers
python code-execution-mcp/http_server.py  # Terminal 7
python database-mcp/http_server.py       # Terminal 8
```

## 4. Start Frontend

```bash
cd ../frontend
npm run dev
```

## 5. Access LearnFlow

Open: **http://localhost:3000**

## Your First Exercise

### Navigate

Click "Start Learning" or go to: http://localhost:3000/exercise

### Write Code

```python
print("Hello, World!")
```

### Run & Submit

Click "Run" to execute, then "Submit" to grade.

## Try AI Chat

Navigate to: http://localhost:3000/chat

Ask questions like:
- "What is a variable?"
- "How do I write a for loop?"

## Check Progress

Navigate to: http://localhost:3000/dashboard

View mastery score, modules, and streak.

## Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Docs | http://localhost:3003 |
| Triage | http://localhost:8001 |
| Concepts | http://localhost:8002 |
| Debug | http://localhost:8003 |
| Exercise | http://localhost:8004 |
| Progress | http://localhost:8005 |
| Code Review | http://localhost:8006 |
| MCP Code Exec | http://localhost:9000 |
| MCP Database | http://localhost:9001 |

## Stopping Services

Press `Ctrl+C` in each terminal window.

## Need Help?

- [Installation Guide](./installation) - Detailed setup
- [API Reference](../api-reference) - API docs
- [Documentation](http://localhost:3003) - Full docs
