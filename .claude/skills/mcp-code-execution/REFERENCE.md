# MCP Code Execution Pattern - Reference Guide

## The Token Efficiency Pattern

### Problem: Direct MCP Integration
- 5 MCP servers = 50,000+ tokens loaded before any work
- Every intermediate result flows through context
- Example: 25,000 token transcript × 2 = 50,000 tokens

### Solution: Code Execution Pattern
- SKILL.md: ~100 tokens (instructions)
- scripts/*.py: 0 tokens (executed, not loaded)
- Result: 80-98% token reduction

## MCP Server Template Structure

```
mcp-server-name/
├── main.py            # MCP server entry point
├── tools/             # Tool implementations
│   ├── __init__.py
│   └── tool_name.py
├── handlers/          # Event handlers
│   └── events.py
├── models/            # Data models
│   └── schemas.py
└── config/            # Configuration
    └── settings.py
```

## Tool Implementation Pattern

### Inefficient: Direct Tool Call
```python
@mcp.tool()
def get_large_sheet(sheet_id: str):
    # Returns 10,000 rows into context
    return gdrive.get_sheet(sheet_id)
```

### Efficient: Code Execution
```python
@mcp.tool()
def get_pending_rows(sheet_id: str, limit: int = 5):
    # Filters in script, returns minimal result
    all_rows = gdrive.get_sheet(sheet_id)
    pending = [r for r in all_rows if r.status == "pending"]
    return pending[:limit]  # Only 5 rows
```

## LearnFlow Context Providers

### User Progress Provider
```python
@mcp.tool()
def get_user_progress(user_id: str):
    """Get user learning progress (summary only)."""
    # Returns: {mastery: 75, streak: 5, last_activity: "2025-01-15"}
    return progress_service.get_summary(user_id)
```

### Exercise Generator Provider
```python
@mcp.tool()
def generate_exercise(topic: str, difficulty: str):
    """Generate coding exercise (don't include solutions)."""
    exercise = exercise_service.create(topic, difficulty)
    return {
        "title": exercise.title,
        "description": exercise.description,
        "starter_code": exercise.starter_code,
        # No solutions returned to minimize tokens
    }
```

## Server Configuration

### LearnFlow MCP Server
```python
from mcp import Server

app = Server("learnflow-context")

@app.tool()
def get_code_context(user_id: str, exercise_id: str):
    """Get code context for tutoring."""
    # Minimal context only
    return {
        "code": code_service.get_latest(user_id, exercise_id),
        "errors": code_service.get_recent_errors(user_id),
        "hints_count": code_service.get_hints_used(user_id, exercise_id)
    }
```

## Deployment

### Local Testing
```bash
python main.py
# Server runs on stdio for MCP protocol
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: learnflow-mcp-server
spec:
  template:
    spec:
      containers:
      - name: mcp-server
        image: learnflow-mcp:latest
        command: ["python", "main.py"]
```

## Dapr Integration

### State Store Access
```python
from dapr.clients import DaprClient

def get_user_state(user_id: str) -> dict:
    with DaprClient() as dapr:
        state = dapr.get_state(
            store_name="postgres-state",
            key=f"user-{user_id}"
        )
        return json.loads(state.data)
```
