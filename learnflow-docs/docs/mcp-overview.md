---
slug: /mcp-overview
title: MCP Integration Overview
sidebar_position: 14
---

# MCP Servers Overview

LearnFlow provides 4 Model Context Protocol (MCP) servers that enable AI agents to access real-time data and operations.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that allows AI assistants to:
- Query databases and retrieve structured data
- Execute code in sandboxed environments
- Subscribe to real-time event streams
- Query Kubernetes cluster status

## MCP Servers in LearnFlow

| Server | Port | Purpose | Tools Available |
|--------|------|---------|------------------|
| Database MCP | 9001 | Student progress, exercises, analytics | 5 tools |
| Code Execution MCP | 9000 | Safe Python execution | 3 tools |
| Kafka Events MCP | 9002 | Real-time event streaming | 4 tools |
| K8s Operations MCP | 9003 | Kubernetes cluster operations | 5 tools |

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     AI Agent (Claude, Goose)                     │
│                                                              │
│  Uses MCP Client to connect to servers                             │
│  └──────────────────────┬─────────────────────────────────┘│
│                          │                                        │
│  ┌──────────────────────▼─────────────────────────────────┐│
│  │              MCP Server Protocol (stdio/HTTP)             ││
│  │  ┌──────────────────────────────────────────────────────┐ ││
│  │  │     Tool 1     │     Tool 2     │     Tool N     │ │ ││
│  │  └──────────────────────────────────────────────────────┘ ││
│  │                                                           ││
│  │  ┌──────────────────────────────────────────────────────┐ ││
│  │  │          Tool Implementation (Python)               │ ││
│  │  │  - Business logic                                   │ ││
│  │  │  - Database/API calls                             │ ││
│  │  │  - Error handling                                 │ ││
│  │  └──────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

## Tool Reference

### Database MCP Server (`localhost:9001`)

#### `get_student_progress`
Get a student's progress across all modules.

**Input**:
```json
{
  "student_id": "student-123"
}
```

**Output**:
```json
{
  "student_id": "student-123",
  "modules": [
    {"module_id": "basics", "mastery_score": 25.0, "exercises_completed": 3},
    {"module_id": "control_flow", "mastery_score": 0.0, "exercises_completed": 0}
  ],
  "overall_mastery": 12.5,
  "streak_days": 5
}
```

#### `get_exercises`
Get exercises catalog, optionally filtered by module.

**Input**:
```json
{
  "module_id": "basics"
}
```

**Output**:
```json
{
  "exercises": [
    {"id": "ex_1_1", "title": "Your First Variable", "difficulty": "beginner"}
  ]
}
```

### Code Execution MCP Server (`localhost:9000`)

#### `execute_code`
Execute Python code in a sandboxed environment.

**Constraints**:
- 5 second timeout
- 50MB memory limit
- No network access
- No filesystem access (temp only)

**Input**:
```json
{
  "code": "print('Hello, World!')"
}
```

**Output**:
```json
{
  "success": true,
  "output": "Hello, World!\n",
  "error": null
}
```

#### `check_syntax`
Validate Python syntax without execution.

#### `format_code`
Format Python code using Black.

### Kafka Events MCP Server (`localhost:9002`)

#### `publish_event`
Publish an event to a Kafka topic.

**Topics**:
- `learning.progress` - Concept learning events
- `code.submission` - Code review events
- `exercise.attempt` - Exercise submission events
- `struggle.alert` - Struggle detection alerts

**Input**:
```json
{
  "topic": "learning.progress",
  "data": {
    "student_id": "student-123",
    "concept": "variables",
    "mastery_level": "beginner"
  }
}
```

#### `subscribe_topic`
Subscribe to a Kafka topic and retrieve events.

**Input**:
```json
{
  "topic": "struggle.alert",
  "limit": 10,
  "offset": 0
}
```

**Output**:
```json
{
  "success": true,
  "events": [
    {
      "student_id": "student-456",
      "alert_type": "repeated_error",
      "category": "syntax",
      "message": "SyntaxError 3 times"
    }
  ]
}
```

### K8s Operations MCP Server (`localhost:9003`)

#### `get_pods`
Get all pods, optionally filtered by namespace.

**Input**:
```json
{
  "namespace": "learnflow"
}
```

**Output**:
```json
{
  "pods": [
    {"name": "triage-service", "namespace": "learnflow", "status": "Running"}
  ]
}
```

#### `get_pod_logs`
Get logs from a specific pod.

**Input**:
```json
{
  "pod_name": "triage-service",
  "namespace": "learnflow",
  "tail_lines": 100
}
```

#### `check_service_health`
Combined health check for all LearnFlow services.

**Output**:
```json
{
  "total_pods": 7,
  "running_pods": 7,
  "services": [...]
}
```

## Usage Examples

### Example 1: AI Agent Checks Student Progress

```python
# Agent uses MCP tool
result = mcp.call_tool(
    server_name="database-mcp",
    tool_name="get_student_progress",
    arguments={"student_id": "student-123"}
)

# Agent provides adaptive tutoring based on mastery
mastery_score = result["overall_mastery"]
if mastery_score < 40:
    print("Let's start with the basics...")
else:
    print("Great progress! Ready for advanced topics...")
```

### Example 2: AI Agent Executes Student Code

```python
# Agent uses MCP tool to grade submission
result = mcp.call_tool(
    server_name="code-exec-mcp",
    tool_name="execute_code",
    arguments={
        "code": student_code
    }
)

if result["success"]:
    print("Code works! Output:", result["output"])
else:
    print("Error:", result["error"])
```

### Example 3: AI Agent Subscribes to Alerts

```python
# Agent monitors for struggling students
result = mcp.call_tool(
    server_name="kafka-events-mcp",
    tool_name="subscribe_topic",
    arguments={
        "topic": "struggle.alert",
        "limit": 5
    }
)

for alert in result["events"]:
    print(f"Student {alert['student_id']} needs help: {alert['message']}")
```

## MCP Server Deployment

Each MCP server runs as a separate deployment:

```yaml
# Example: Database MCP
apiVersion: apps/v1
kind: Deployment
metadata:
  name: database-mcp-server
  namespace: learnflow
spec:
  replicas: 1
  selector:
    matchLabels:
      app: database-mcp-server
  template:
    spec:
      containers:
      - name: database-mcp-server
        image: registry.digitalocean.com/learnflow-registry/database-mcp-server:latest
        command: ["python", "main.py"]
        ports:
        - containerPort: 9001
```

## Developing MCP Tools

Tools are simple Python async functions:

```python
@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls."""
    if name == "my_custom_tool":
        result = await my_tool_logic(arguments)
        return [TextContent(json.dumps(result))]
```

## Token Efficiency

MCP servers are designed for token efficiency:
- Responses are minimal JSON (<500 tokens per session)
- Tool descriptions are concise
- Large datasets are paginated
- Only requested fields are returned

---

**Next**: [Database MCP Details](/mcp-database) →
