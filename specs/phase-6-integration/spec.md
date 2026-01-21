# Phase 6: Integration (MCP Servers) Specification

**Status**: Draft
**Phase**: 6
**Focus**: Create MCP servers for real-time AI agent context and system integration

---

## Overview

Build Model Context Protocol (MCP) servers that give AI agents real-time access to LearnFlow platform data. MCP servers provide:
- **Database Access**: Real-time student progress, code submissions, exercise history
- **Kafka Events**: Subscribe to learning events, struggle alerts
- **Kubernetes Operations**: Query pod status, service health, logs
- **Code Execution**: Execute student code in sandboxed environment

Following the **MCP Code Execution Pattern**, these servers expose tools that AI agents can call, with efficient token usage through script-based execution.

---

## Success Criteria

- [ ] 4 MCP servers deployed and running
- [ ] MCP tools accessible from backend services
- [ ] Real-time data access working
- [ ] Kafka event streaming functional
- [ ] Code execution sandbox operational
- [ ] Token efficiency validated (<500 tokens per session)
- [ ] Zero manual intervention - autonomous deployment via Skills

---

## Architecture

### Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI SERVICES                                │
│                                                                        │
│  ┌──────────────────────┐      ┌──────────────────────┐              │
│  │   Concepts Service   │      │    Debug Service     │              │
│  │                      │      │                      │              │
│  │  ┌────────────────┐  │      │  ┌────────────────┐  │              │
│  │  │ OpenAI Agent   │  │      │  │ OpenAI Agent   │  │              │
│  │  │ (AsyncOpenAI)  │  │      │  │ (AsyncOpenAI)  │  │              │
│  │  └────────┬───────┘  │      │  └────────┬───────┘  │              │
│  │           │           │      │           │           │              │
│  │           │ MCP Tool  │      │           │ MCP Tool  │              │
│  │           │ Call      │      │           │ Call      │              │
│  └───────────┼───────────┘      └───────────┼───────────┘              │
│              │                              │                           │
└──────────────┼──────────────────────────────┼───────────────────────────┘
               │                              │
               ▼                              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         MCP SERVERS                                    │
│                                                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │  MCP Database    │  │   MCP Kafka      │  │   MCP K8s        │    │
│  │     Server       │  │     Server       │  │     Server       │    │
│  │                  │  │                  │  │                  │    │
│  │ Tools:           │  │ Tools:           │  │ Tools:           │    │
│  │ • get_progress   │  │ • publish_event  │  │ • get_pods       │    │
│  │ • get_submission │  │ • subscribe      │  │ • get_logs       │    │
│  │ • get_exercise   │  │ • get_events     │  │ • check_health   │    │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘    │
│           │                     │                     │               │
│           │ Queries             │ Reads/Publish       │ kubectl       │
│           ▼                     ▼                     ▼               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │   PostgreSQL     │  │     Kafka        │  │    Kubernetes    │    │
│  │   (learnflow)    │  │  (Pub/Sub)       │  │     Cluster      │    │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## MCP Servers

### 1. MCP Database Server

**Purpose**: Provide AI agents with real-time access to student data, progress, and code submissions.

**Port**: 3001
**Transport**: stdio (local), SSE (remote)

**Tools**:

```python
# Tool: get_student_progress
mcp_tool(
    name="get_student_progress",
    description="Get a student's current progress and mastery levels",
    parameters={
        "student_id": {
            "type": "string",
            "description": "UUID of the student",
            "required": True
        }
    }
)
async def get_student_progress(student_id: str) -> dict:
    """
    Returns student progress including:
    - Overall mastery level
    - Per-module mastery
    - Recent activity
    - Current streak
    """
    query = """
        SELECT module, mastery_level, exercise_score, quiz_score
        FROM student_progress
        WHERE student_id = $1
    """
    results = await db.fetch_all(query, student_id)
    return {
        "student_id": student_id,
        "modules": [dict(r) for r in results],
        "overall_mastery": calculate_overall(results)
    }

# Tool: get_code_submissions
mcp_tool(
    name="get_code_submissions",
    description="Get recent code submissions for a student",
    parameters={
        "student_id": {"type": "string", "required": True},
        "limit": {"type": "integer", "default": 10}
    }
)
async def get_code_submissions(student_id: str, limit: int = 10) -> list:
    """
    Returns recent code submissions with:
    - Code content
    - Error messages (if any)
    - Execution timestamp
    """
    query = """
        SELECT code, error_message, executed_at
        FROM code_submissions
        WHERE student_id = $1
        ORDER BY executed_at DESC
        LIMIT $2
    """
    return await db.fetch_all(query, student_id, limit)

# Tool: get_exercise_history
mcp_tool(
    name="get_exercise_history",
    description="Get exercise completion history for analytics",
    parameters={
        "student_id": {"type": "string", "required": True},
        "module": {"type": "string", "required": False}
    }
)
async def get_exercise_history(student_id: str, module: str = None) -> list:
    """
    Returns exercise attempts including:
    - Exercise completion rate
    - Average attempts per exercise
    - Time spent per exercise
    """
    query = """
        SELECT exercise_id, passed, attempts, completed_at
        FROM exercise_attempts
        WHERE student_id = $1
        AND ($2::text IS NULL OR exercise_id IN (
            SELECT id FROM exercises WHERE module = $2
        ))
        ORDER BY completed_at DESC
    """
    return await db.fetch_all(query, student_id, module)

# Tool: get_struggling_students
mcp_tool(
    name="get_struggling_students",
    description="Identify students showing struggle patterns",
    parameters={
        "threshold": {"type": "integer", "default": 3},
        "hours": {"type": "integer", "default": 24}
    }
)
async def get_struggling_students(threshold: int = 3, hours: int = 24) -> list:
    """
    Returns students with struggle indicators:
    - Same error repeated N times
    - N failed exercises in a row
    - Quiz score below 50%
    """
    query = """
        SELECT s.id, s.email, COUNT(cs.id) as error_count
        FROM students s
        JOIN code_submissions cs ON s.id = cs.student_id
        WHERE cs.error_message IS NOT NULL
        AND cs.executed_at > NOW() - INTERVAL '1 hour' * $2
        GROUP BY s.id, s.email
        HAVING COUNT(cs.id) >= $1
    """
    return await db.fetch_all(query, threshold, hours)
```

**Schema**:
```python
# schemas.py (for type validation)
class StudentProgress(BaseModel):
    student_id: str
    module: str
    mastery_level: float
    exercise_score: float
    quiz_score: float
    streak_days: int

class CodeSubmission(BaseModel):
    id: str
    student_id: str
    code: str
    error_message: Optional[str]
    executed_at: datetime
```

---

### 2. MCP Kafka Server

**Purpose**: Enable AI agents to publish and subscribe to learning events for real-time analytics and coordination.

**Port**: 3002
**Transport**: stdio (local), SSE (remote)

**Tools**:

```python
# Tool: publish_learning_event
mcp_tool(
    name="publish_learning_event",
    description="Publish a learning progress event to Kafka",
    parameters={
        "topic": {
            "type": "string",
            "description": "Kafka topic (learning.progress, code.submission, etc.)",
            "required": True
        },
        "event_type": {"type": "string", "required": True},
        "student_id": {"type": "string", "required": True},
        "data": {"type": "object", "required": True}
    }
)
async def publish_learning_event(
    topic: str,
    event_type: str,
    student_id: str,
    data: dict
) -> dict:
    """
    Publishes an event to Kafka for:
    - Progress tracking
    - Analytics
    - Struggle detection
    - Agent coordination
    """
    event = {
        "event_type": event_type,
        "student_id": student_id,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }
    await kafka_producer.send_and_wait(topic, value=event)
    return {"status": "published", "topic": topic, "event_id": str(uuid4())}

# Tool: subscribe_to_events
mcp_tool(
    name="subscribe_to_events",
    description="Subscribe to Kafka topics for real-time event streaming",
    parameters={
        "topics": {
            "type": "array",
            "items": {"type": "string"},
            "required": True
        },
        "consumer_group": {"type": "string", "default": "mcp-consumer"}
    }
)
async def subscribe_to_events(
    topics: list[str],
    consumer_group: str
) -> AsyncIterator[dict]:
    """
    Yields events from subscribed topics:
    - learning.progress
    - code.submission
    - exercise.attempt
    - struggle.alert
    """
    consumer = AIOKafkaConsumer(
        *topics,
        bootstrap_servers="kafka.kafka.svc.cluster.local:9092",
        group_id=consumer_group
    )
    await consumer.start()
    try:
        async for msg in consumer:
            yield json.loads(msg.value)
    finally:
        await consumer.stop()

# Tool: get_event_history
mcp_tool(
    name="get_event_history",
    description="Retrieve historical events from Kafka (if retained)",
    parameters={
        "topic": {"type": "string", "required": True},
        "student_id": {"type": "string", "required": False},
        "limit": {"type": "integer", "default": 100}
    }
)
async def get_event_history(
    topic: str,
    student_id: str = None,
    limit: int = 100
) -> list:
    """
    Retrieves historical events for:
    - Debugging
    - Pattern analysis
    - Student progress review
    """
    # Note: Requires Kafka to have retention enabled
    # For MVP, this may query a separate event store database
    query = """
        SELECT event_type, student_id, timestamp, data
        FROM event_store
        WHERE topic = $1
        AND ($2::text IS NULL OR student_id = $2)
        ORDER BY timestamp DESC
        LIMIT $3
    """
    return await db.fetch_all(query, topic, student_id, limit)

# Tool: publish_struggle_alert
mcp_tool(
    name="publish_struggle_alert",
    description="Publish a struggle detection alert for teacher notification",
    parameters={
        "student_id": {"type": "string", "required": True},
        "alert_type": {
            "type": "string",
            "enum": ["repeated_error", "stuck_long", "low_quiz", "many_failures"],
            "required": True
        },
        "severity": {"type": "string", "enum": ["low", "medium", "high", "urgent"]},
        "context": {"type": "object", "required": True}
    }
)
async def publish_struggle_alert(
    student_id: str,
    alert_type: str,
    severity: str,
    context: dict
) -> dict:
    """
    Publishes struggle alerts to:
    - struggle.alert topic
    - Teacher dashboard (via WebSocket)
    - Notification service
    """
    alert = {
        "alert_id": str(uuid4()),
        "student_id": student_id,
        "alert_type": alert_type,
        "severity": severity,
        "timestamp": datetime.utcnow().isoformat(),
        "context": context
    }
    await kafka_producer.send_and_wait("struggle.alert", value=alert)
    return {"status": "alerted", "alert_id": alert["alert_id"]}
```

**Event Schemas**:

```python
# learning.progress event
{
    "event_type": "learning.progress",
    "student_id": "uuid",
    "module": "Control Flow",
    "mastery_change": 0.05,
    "new_mastery": 0.65,
    "activity": "exercise_completed"
}

# code.submission event
{
    "event_type": "code.submission",
    "student_id": "uuid",
    "code": "for i in range(5):",
    "error": "SyntaxError: unexpected EOF",
    "passed": false
}

# exercise.attempt event
{
    "event_type": "exercise.attempt",
    "student_id": "uuid",
    "exercise_id": "uuid",
    "passed": true,
    "attempts": 2,
    "time_spent_seconds": 180
}

# struggle.alert event
{
    "event_type": "struggle.alert",
    "student_id": "uuid",
    "alert_type": "repeated_error",
    "severity": "medium",
    "error_count": 4,
    "error_message": "SyntaxError: unexpected EOF"
}
```

---

### 3. MCP Kubernetes Server

**Purpose**: Provide AI agents with visibility into Kubernetes cluster state for debugging and health monitoring.

**Port**: 3003
**Transport**: stdio (local), SSE (remote)

**Tools**:

```python
# Tool: get_pod_status
mcp_tool(
    name="get_pod_status",
    description="Get status of all pods in a namespace",
    parameters={
        "namespace": {"type": "string", "default": "learnflow"},
        "label_selector": {"type": "string", "required": False}
    }
)
async def get_pod_status(
    namespace: str = "learnflow",
    label_selector: str = None
) -> list:
    """
    Returns pod status including:
    - Pod name
    - Status (Running, Pending, Failed, etc.)
    - Restarts
    - Age
    """
    cmd = ["kubectl", "get", "pods", "-n", namespace, "-o", "json"]
    if label_selector:
        cmd.extend(["-l", label_selector])

    result = subprocess.run(cmd, capture_output=True, text=True)
    pods = json.loads(result.stdout)["items"]

    return [
        {
            "name": p["metadata"]["name"],
            "status": p["status"]["phase"],
            "restarts": sum(c.get("restartCount", 0) for c in p["status"].get("containerStatuses", [])),
            "ready": sum(1 for c in p["status"].get("containerStatuses", []) if c.get("ready")),
            "total": len(p["status"].get("containerStatuses", []))
        }
        for p in pods
    ]

# Tool: get_service_logs
mcp_tool(
    name="get_service_logs",
    description="Get logs from a specific service pod",
    parameters={
        "namespace": {"type": "string", "required": True},
        "pod": {"type": "string", "required": True},
        "tail": {"type": "integer", "default": 50},
        "container": {"type": "string", "required": False}
    }
)
async def get_service_logs(
    namespace: str,
    pod: str,
    tail: int = 50,
    container: str = None
) -> str:
    """
    Returns recent log entries for debugging:
    - Error messages
    - Request/response logs
    - Stack traces
    """
    cmd = ["kubectl", "logs", "-n", namespace, pod, "--tail", str(tail)]
    if container:
        cmd.extend(["-c", container])

    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout

# Tool: check_service_health
mcp_tool(
    name="check_service_health",
    description="Check health endpoints of all LearnFlow services",
    parameters={
        "namespace": {"type": "string", "default": "learnflow"}
    }
)
async def check_service_health(namespace: str = "learnflow") -> dict:
    """
    Checks health of all services:
    - HTTP status code
    - Response time
    - Service availability
    """
    services = ["triage", "concepts", "debug", "exercise", "progress"]
    health_status = {}

    for service in services:
        try:
            start = time.time()
            response = requests.get(
                f"http://{service}-service:8000/health",
                timeout=5
            )
            response_time = time.time() - start
            health_status[service] = {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "response_time_ms": round(response_time * 1000, 2)
            }
        except Exception as e:
            health_status[service] = {
                "status": "unreachable",
                "error": str(e)
            }

    return health_status

# Tool: describe_pod
mcp_tool(
    name="describe_pod",
    description="Get detailed information about a pod for debugging",
    parameters={
        "namespace": {"type": "string", "required": True},
        "pod": {"type": "string", "required": True}
    }
)
async def describe_pod(namespace: str, pod: str) -> dict:
    """
    Returns detailed pod information:
    - Events
    - Resource usage
    - Container states
    - Volumes
    """
    cmd = ["kubectl", "describe", "pod", "-n", namespace, pod]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return {"pod": pod, "description": result.stdout}

# Tool: get_kafka_topics
mcp_tool(
    name="get_kafka_topics",
    description="List all Kafka topics and their status",
    parameters={}
)
async def get_kafka_topics() -> list:
    """
    Returns Kafka topic information:
    - Topic name
    - Partitions
    - Replication factor
    - Consumer groups
    """
    cmd = [
        "kubectl", "exec", "-n", "kafka", "kafka-0", "--",
        "kafka-topics.sh", "--list", "--bootstrap-server", "localhost:9092"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    topics = result.stdout.strip().split("\n")
    return topics
```

---

### 4. MCP Code Execution Server

**Purpose**: Execute student code in a sandboxed environment and return results.

**Port**: 3004
**Transport**: stdio (local), SSE (remote)

**Tools**:

```python
# Tool: execute_code
mcp_tool(
    name="execute_code",
    description="Execute Python code in a sandboxed environment",
    parameters={
        "code": {"type": "string", "required": True},
        "timeout": {"type": "integer", "default": 5},
        "memory_limit_mb": {"type": "integer", "default": 50}
    }
)
async def execute_code(
    code: str,
    timeout: int = 5,
    memory_limit_mb: int = 50
) -> dict:
    """
    Executes Python code with:
    - 5 second timeout
    - 50MB memory limit
    - No network access
    - Standard library only
    - Temp file access only

    Returns:
    - stdout output
    - stderr (errors)
    - execution_time
    - memory_used
    """
    result = {
        "output": None,
        "error": None,
        "execution_time": None,
        "passed": False
    }

    try:
        # Create temp file for code
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            code_file = f.name

        # Execute with resource limits
        start_time = time.time()

        process = await asyncio.create_subprocess_exec(
            'prlimit',
            '--as=' + str(memory_limit_mb * 1024 * 1024),
            '--cpu=' + str(timeout),
            'python3',
            code_file,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        try:
            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=timeout + 1
            )

            result["execution_time"] = time.time() - start_time
            result["output"] = stdout.decode('utf-8')
            result["error"] = stderr.decode('utf-8') if stderr else None
            result["passed"] = process.returncode == 0

        except asyncio.TimeoutError:
            process.kill()
            result["error"] = f"Execution timeout (>{timeout}s)"

    except Exception as e:
        result["error"] = str(e)

    finally:
        # Cleanup temp file
        if 'code_file' in locals():
            try:
                os.unlink(code_file)
            except:
                pass

    return result

# Tool: test_with_test_cases
mcp_tool(
    name="test_with_test_cases",
    description="Run code against test cases for auto-grading",
    parameters={
        "code": {"type": "string", "required": True},
        "test_cases": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "input": {"type": "string"},
                    "expected_output": {"type": "string"}
                }
            },
            "required": True
        }
    }
)
async def test_with_test_cases(code: str, test_cases: list) -> dict:
    """
    Auto-grades code by running against test cases:
    - Injects test cases into code
    - Executes each test
    - Compares output
    - Returns pass/fail per test
    """
    results = []

    for i, test_case in enumerate(test_cases):
        # Inject test case into code
        test_code = f"""
{code}

# Test case {i + 1}
input_data = {test_case['input']}
print(repr(input_data))
"""
        result = await execute_code(test_code)
        actual_output = result['output'] or result['error']

        results.append({
            "test_case": i + 1,
            "input": test_case['input'],
            "expected": test_case['expected_output'],
            "actual": actual_output,
            "passed": actual_output.strip() == test_case['expected_output'].strip()
        })

    passed = sum(1 for r in results if r['passed'])
    return {
        "total": len(results),
        "passed": passed,
        "percentage": (passed / len(results)) * 100,
        "results": results
    }
```

**Sandbox Security**:
- Uses `prlimit` for resource constraints
- Network namespace isolation
- No filesystem access except /tmp
- Whitelisted imports only (for MVP)

---

## MCP Code Execution Pattern

### Structure

Each MCP server follows this pattern:

```
.claude/skills/mcp-code-execution/
├── SKILL.md              # Instructions (~100 tokens)
├── REFERENCE.md          # Deep docs (loaded on-demand)
└── scripts/
    ├── deploy.sh         # Deploys MCP server as K8s Deployment
    ├── generate.py       # Generates MCP server scaffold
    └── test.py           # Tests MCP server tools
```

### Server Template

```python
# Generated server scaffold (scripts/generate.py output)
"""
MCP Server: {server_name}
Generated: {timestamp}
"""

from mcp import Server, mcp_tool
import asyncio

app = Server("{server_name}")

@app.mcp_tool(
    name="example_tool",
    description="Example tool description",
)
async def example_tool(param: str) -> dict:
    """Tool implementation"""
    return {"result": param}

if __name__ == "__main__":
    app.run()
```

---

## Skills Used

### mcp-code-execution

**Location**: `.claude/skills/mcp-code-execution/`

**Scripts**:
- `scripts/generate.py` - Generates MCP server scaffold
- `scripts/deploy.sh` - Deploys MCP server to Kubernetes
- `scripts/test.py` - Tests MCP server tools

**Usage**:
```bash
# Generate MCP server
python .claude/skills/mcp-code-execution/scripts/generate.py \
    --name learnflow-database \
    --port 3001

# Deploy to Kubernetes
./.claude/skills/mcp-code-execution/scripts/deploy.sh

# Test tools
python .claude/skills/mcp-code-execution/scripts/test.py
```

---

## Deployment Configuration

### Kubernetes Deployment

```yaml
# mcp-server-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{SERVER_NAME}}
  namespace: learnflow
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {{SERVER_NAME}}
  template:
    metadata:
      labels:
        app: {{SERVER_NAME}}
    spec:
      containers:
      - name: mcp-server
        image: {{SERVER_NAME}}:latest
        ports:
        - containerPort: {{PORT}}
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: connection-string
        - name: KAFKA_BROKERS
          value: "kafka.kafka.svc.cluster.local:9092"
        resources:
          requests:
            memory: "128Mi"
            cpu: "50m"
          limits:
            memory: "256Mi"
            cpu: "100m"
---
apiVersion: v1
kind: Service
metadata:
  name: {{SERVER_NAME}}
  namespace: learnflow
spec:
  selector:
    app: {{SERVER_NAME}}
  ports:
  - port: {{PORT}}
    targetPort: {{PORT}}
```

---

## Validation

### MCP Server Health Check

```bash
# Test MCP Database Server
python -c "
from mcp import Client
client = Client('stdio', command=['python', 'mcp_database_server.py'])
client.start()
result = client.call_tool('get_student_progress', {'student_id': 'test-id'})
print(result)
client.stop()
"

# Test MCP Kafka Server
python -c "
from mcp import Client
client = Client('stdio', command=['python', 'mcp_kafka_server.py'])
client.start()
result = client.call_tool('publish_learning_event', {
    'topic': 'learning.progress',
    'event_type': 'test',
    'student_id': 'test-id',
    'data': {}
})
print(result)
client.stop()
"
```

---

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| MCP tool response time | < 500ms (database), < 100ms (kafka publish) |
| Memory per MCP server | 256MB |
| CPU per MCP server | 100m |
| Token efficiency | < 500 tokens per session |
| Tool availability | 99% (dev) |

---

## Dependencies

**Required**:
- PostgreSQL deployed (from Phase 3)
- Kafka deployed (from Phase 3)
- Backend services deployed (from Phase 4)
- MCP Python SDK installed

**Blocking**:
- Phase 3 must be complete
- Phase 4 must be complete

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| MCP SDK compatibility issues | Medium | Medium | Pin SDK version, test early |
| Code sandbox escape | Low | High | Use container isolation, strict limits |
| Kafka consumer lag | Medium | Low | Monitor consumer group offsets |
| Database connection pool exhaustion | Low | Medium | Implement connection pooling, limits |

---

## Deliverables

1. **4 MCP Servers**
   - mcp-database-server
   - mcp-kafka-server
   - mcp-k8s-server
   - mcp-code-execution-server

2. **Kubernetes Deployments**
   - All MCP servers deployed
   - Services configured
   - Health endpoints responding

3. **Documentation**
   - Tool schemas documented
   - Usage examples provided
   - Integration guide

---

## Next Phase

After Phase 6 completion, proceed to **Phase 7: LearnFlow Build** where the complete application will be assembled and tested end-to-end.
