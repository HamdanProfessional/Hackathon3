# LearnFlow MCP Servers

Model Context Protocol (MCP) servers for LearnFlow application.

## Servers

### 1. Database Server (`database-mcp/`)
Provides real-time access to LearnFlow PostgreSQL database:
- Student data and progress
- Exercise catalog and submissions
- Teacher analytics
- Struggle detection alerts

**Tools:**
- `get_student_progress` - Get student mastery scores
- `get_exercises` - List exercises by module
- `submit_exercise` - Submit code for grading
- `get_class_overview` - Teacher dashboard data
- `get_struggle_alerts` - Get students needing help

### 2. Code Execution Server (`code-execution-mcp/`)
Safe Python code execution for learning:
- Execute Python code in sandboxed environment
- Capture stdout/stderr
- Enforce resource limits (5s timeout, 50MB memory)
- Return execution results

**Tools:**
- `execute_code` - Run Python code safely
- `check_syntax` - Validate Python syntax
- `format_code` - Apply PEP 8 formatting

## Installation

```bash
cd backend/mcp-servers
pip install -r requirements.txt
```

## Running Servers

Development:
```bash
# Database MCP
python database-mcp/main.py

# Code Execution MCP
python code-execution-mcp/main.py
```

Production (with Dapr):
```bash
dapr run --app-id database-mcp -- python database-mcp/main.py
```

## Integration with FastAPI Services

Backend services import MCP clients:

```python
from mcp_servers.database_client import DatabaseMCP
from mcp_servers.code_execution_client import CodeExecutionMCP

# Use in services
db = DatabaseMCP()
progress = db.get_student_progress(student_id)

executor = CodeExecutionMCP()
result = executor.execute_code(code)
```

## MCP Client Configuration

For Claude Desktop:
```json
{
  "mcpServers": {
    "learnflow-db": {
      "command": "python",
      "args": ["/path/to/database-mcp/main.py"]
    },
    "learnflow-exec": {
      "command": "python",
      "args": ["/path/to/code-execution-mcp/main.py"]
    }
  }
}
```
