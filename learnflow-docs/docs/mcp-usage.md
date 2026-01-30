---
slug: /mcp-usage
title: MCP Servers Usage Guide
sidebar_position: 6
---

# MCP Servers Usage Guide

LearnFlow exposes four Model Context Protocol (MCP) servers that allow AI agents to interact with the platform.

## Overview

MCP servers provide a standardized interface for:
- Database queries and operations
- Code execution in sandboxes
- Kafka event streaming
- Kubernetes cluster operations

---

## Available MCP Servers

| Server | Port | Purpose | Tools |
|--------|------|---------|-------|
| **Database MCP** | 9001 | Database operations | `get_student_progress`, `get_exercises`, `submit_exercise`, `get_class_overview`, `get_struggle_alerts` |
| **Code Execution MCP** | 9000 | Safe Python execution | `execute_code`, `check_syntax`, `format_code` |
| **Kafka Events MCP** | 9002 | Event streaming | `publish_event`, `subscribe_topic`, `list_topics`, `get_recent_events` |
| **K8s Operations MCP** | 9003 | Cluster management | `get_pods`, `get_services`, `get_pod_logs`, `check_service_health` |

---

## Starting MCP Servers

### Option 1: Docker Compose

```bash
cd learnflow-app
docker-compose -f docker-compose.dev.yml up -d mcp-code-exec mcp-database mcp-kafka-events mcp-k8s-operations
```

### Option 2: Direct Python

```bash
# Database MCP
cd backend/mcp-servers/database-mcp
python main.py

# Code Execution MCP
cd backend/mcp-servers/code-execution-mcp
python main.py

# Kafka Events MCP
cd backend/mcp-servers/kafka-events-mcp
python main.py

# K8s Operations MCP
cd backend/mcp-servers/k8s-operations-mcp
python main.py
```

---

## Tool Reference

### Database MCP Tools

#### `get_student_progress`

Get progress data for a specific student.

**Input:**
```json
{
  "student_id": "00000000-0000-0000-0000-000000000001"
}
```

**Output:**
```json
{
  "success": true,
  "student_id": "00000000-0000-0000-0000-000000000001",
  "overall_mastery": 0.65,
  "module_progress": [...],
  "exercises_completed": 12,
  "streak_days": 3
}
```

#### `get_exercises`

Get all available exercises or filter by module/difficulty.

**Input:**
```json
{
  "module": "basics",
  "difficulty": "beginner"
}
```

**Output:**
```json
{
  "success": true,
  "exercises": [
    {
      "id": "ex_1_1",
      "title": "Print Statement",
      "difficulty": "beginner",
      "points": 10,
      "module": "basics"
    }
  ]
}
```

#### `submit_exercise`

Grade a student's code submission.

**Input:**
```json
{
  "exercise_id": "ex_1_1",
  "student_id": "00000000-0000-0000-0000-000000000001",
  "code": "print('Hello, World!')"
}
```

**Output:**
```json
{
  "success": true,
  "passed": true,
  "feedback": "Perfect!",
  "test_results": [...],
  "points_earned": 10
}
```

---

### Code Execution MCP Tools

#### `execute_code`

Execute Python code in a sandboxed environment.

**Input:**
```json
{
  "code": "print('Hello, World!')\nfor i in range(5):\n    print(f\"Count: {i}\")",
  "timeout": 5
}
```

**Constraints:**
- Maximum execution time: 5 seconds (default)
- Maximum memory: 50MB
- No file I/O operations
- No network requests

**Output:**
```json
{
  "success": true,
  "stdout": "Hello, World!\nCount: 0\nCount: 1\n...",
  "stderr": "",
  "execution_time": 0.15
}
```

#### `check_syntax`

Validate Python syntax without executing.

**Input:**
```json
{
  "code": "x = 5\nprint(x"
}
```

**Output:**
```json
{
  "success": true,
  "valid": true,
  "errors": []
}
```

---

### Kafka Events MCP Tools

#### `publish_event`

Publish an event to a Kafka topic.

**Input:**
```json
{
  "topic": "learning.progress",
  "data": {
    "student_id": "123",
    "event_type": "concept_learned",
    "concept": "variables",
    "mastery_level": "learning"
  }
}
```

**Available Topics:**
- `learning.progress` - Concept learning events
- `code.submission` - Code review events
- `exercise.attempt` - Exercise submission events
- `struggle.alert` - Struggle detection alerts

**Output:**
```json
{
  "success": true,
  "topic": "learning.progress",
  "event_id": "evt_123456"
}
```

#### `subscribe_topic`

Subscribe to a Kafka topic and retrieve events.

**Input:**
```json
{
  "topic": "learning.progress",
  "limit": 10
}
```

**Output:**
```json
{
  "success": true,
  "events": [
    {
      "student_id": "123",
      "event_type": "concept_learned",
      "concept": "variables",
      "mastery_level": "learning"
    }
  ]
}
```

---

### K8s Operations MCP Tools

#### `get_pods`

List all pods in the cluster.

**Input:**
```json
{
  "namespace": "learnflow"
}
```

**Output:**
```json
{
  "success": true,
  "pods": [
    {
      "name": "triage-service",
      "namespace": "learnflow",
      "ready": "1/1",
      "status": "Running"
    }
  ]
}
```

#### `check_service_health`

Check health status of all LearnFlow services.

**Input:**
```json
{}
```

**Output:**
```json
{
  "success": true,
  "services": {
    "triage-service": {"running": true, "ready": true},
    "concepts-service": {"running": true, "ready": true},
    "debug-service": {"running": true, "ready": true}
  }
}
```

---

## Usage Examples

### Example 1: Check Student Progress

```python
import httpx

async def check_progress():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:9001/tools/call",
            json={
                "name": "get_student_progress",
                "arguments": {"student_id": "student-123"}
            }
        )
        return response.json()

result = await check_progress()
print(f"Student mastery: {result['overall_mastery']}")
```

### Example 2: Execute Code

```python
async def run_code():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:9000/tools/call",
            json={
                "name": "execute_code",
                "arguments": {
                    "code": "for i in range(5): print(i)",
                    "timeout": 3
                }
            }
        )
        return response.json()

result = await run_code()
print(f"Output:\n{result['stdout']}")
```

### Example 3: Publish Learning Event

```python
async def publish_event():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:9002/tools/call",
            json={
                "name": "publish_event",
                "arguments": {
                    "topic": "learning.progress",
                    "data": {
                        "student_id": "student-123",
                        "event_type": "concept_learned",
                        "concept": "variables",
                        "mastery_level": "beginner"
                    }
                }
            }
        )
        return response.json()

result = await publish_event()
print(f"Event published: {result['success']}")
```

---

## Claude AI Integration

These MCP servers can be used with Claude Desktop or other AI agents:

### Configure in Claude Desktop

1. Open Claude Desktop settings
2. Navigate to MCP Servers
3. Add each server:
   - **Database MCP**: `python backend/mcp-servers/database-mcp/main.py`
   - **Code Execution MCP**: `python backend/mcp-servers/code-execution-mcp/main.py`
   - **Kafka Events MCP**: `python backend/mcp-servers/kafka-events-mcp/main.py`
   - **K8s Operations MCP**: `python backend/mcp-servers/k8s-operations-mcp/main.py`

### Use in AI Prompts

Once configured, you can ask Claude to:
- "Check progress for student-123" → Database MCP
- "Run this code and show output" → Code Execution MCP
- "Publish a learning progress event" → Kafka Events MCP
- "Check all pods status" → K8s Operations MCP

---

## Troubleshooting

### Server Won't Start

**Problem**: Port already in use
```bash
# Check what's using the port
lsof -i :9001

# Kill the process or use different port
```

### Connection Refused

**Problem**: Service not running
```bash
# Check service status
docker ps | grep mcp-

# Start specific server
docker-compose -f docker-compose.dev.yml up -d mcp-code-exec
```

### Module Not Found

**Problem**: Missing dependencies
```bash
cd backend/mcp-servers/<server>
pip install -r requirements.txt
```

---

## Next Steps

- [Backend API Reference](/backend-api)
- [Deployment Guide](/local-setup)
- [Student Guide](/student-guide)
- [Teacher Guide](/teacher-guide)
