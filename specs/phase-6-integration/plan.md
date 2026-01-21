# Phase 6: Integration (MCP Servers) - Implementation Plan

**Phase**: 6
**Focus**: Create MCP servers for real-time AI agent context
**Status**: Draft

---

## Architecture Overview

Building 4 MCP servers following the MCP Code Execution pattern:

1. **mcp-database-server** (Port 3001) - Database access for student data
2. **mcp-kafka-server** (Port 3002) - Kafka pub/sub for events
3. **mcp-k8s-server** (Port 3003) - Kubernetes operations
4. **mcp-code-execution-server** (Port 3004) - Code execution sandbox

Each server:
- Uses MCP Python SDK
- Exposes tools for AI agents
- Follows MCP Code Execution pattern
- Minimal token usage

---

## Implementation Strategy

### Approach: Skills-Based Autonomous Build

**Principle**: Use `mcp-code-execution` skill to generate MCP servers.

**Build Process**:
1. Use `mcp-code-execution` skill to generate server scaffold
2. Implement MCP tools for data access
3. Add error handling and validation
4. Write tests
5. Deploy to Kubernetes

---

## Step-by-Step Implementation

### Step 1: Prerequisites Verification

**Goal**: Ensure backend services from Phase 4 are ready.

**Actions**:
- [ ] Verify all 5 backend services running
- [ ] Verify PostgreSQL accessible
- [ ] Verify Kafka accessible
- [ ] Verify kubectl configured

---

### Step 2: MCP Database Server

**Using mcp-code-execution Skill**:
```bash
python .claude/skills/mcp-code-execution/scripts/generate.py \
    --name mcp-database-server \
    --port 3001
```

**Tools to Implement**:
- `get_student_progress` - Get student mastery and progress
- `get_code_submissions` - Get recent code submissions
- `get_exercise_history` - Get exercise completion history
- `get_struggling_students` - Identify struggling students

**Implementation**:
```python
# tools/database_tools.py
from mcp import Server, mcp_tool
from typing import Optional
import asyncpg

app = Server("mcp-database-server")
db_pool = None

async def get_db_connection():
    global db_pool
    if db_pool is None:
        db_pool = await asyncpg.create_pool(
            host="postgres.postgres.svc.cluster.local",
            database="learnflow",
            user="learnflow_user",
            password=os.getenv("DB_PASSWORD")
        )
    return db_pool

@app.mcp_tool(
    name="get_student_progress",
    description="Get a student's current progress and mastery levels",
)
async def get_student_progress(student_id: str) -> dict:
    pool = await get_db_connection()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT module, mastery_level, exercise_score, quiz_score, streak_days
            FROM student_progress
            WHERE student_id = $1
        """, student_id)
        return [dict(r) for r in rows]

@app.mcp_tool(
    name="get_code_submissions",
    description="Get recent code submissions for a student",
)
async def get_code_submissions(student_id: str, limit: int = 10) -> list:
    pool = await get_db_connection()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT code, error_message, executed_at
            FROM code_submissions
            WHERE student_id = $1
            ORDER BY executed_at DESC
            LIMIT $2
        """, student_id, limit)
        return [dict(r) for r in rows]
```

---

### Step 3: MCP Kafka Server

**Using mcp-code-execution Skill**:
```bash
python .claude/skills/mcp-code-execution/scripts/generate.py \
    --name mcp-kafka-server \
    --port 3002
```

**Tools to Implement**:
- `publish_learning_event` - Publish to learning topics
- `subscribe_to_events` - Subscribe to Kafka topics
- `get_event_history` - Retrieve historical events
- `publish_struggle_alert` - Publish struggle alerts

**Implementation**:
```python
# tools/kafka_tools.py
from mcp import Server, mcp_tool
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
import json

app = Server("mcp-kafka-server")
producer = None

async def get_producer():
    global producer
    if producer is None:
        producer = AIOKafkaProducer(
            bootstrap_servers="kafka.kafka.svc.cluster.local:9092",
            value_serializer=lambda v: json.dumps(v).encode()
        )
        await producer.start()
    return producer

@app.mcp_tool(
    name="publish_learning_event",
    description="Publish a learning progress event to Kafka",
)
async def publish_learning_event(
    topic: str,
    event_type: str,
    student_id: str,
    data: dict
) -> dict:
    prod = await get_producer()
    event = {
        "event_type": event_type,
        "student_id": student_id,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }
    await prod.send_and_wait(topic, value=event)
    return {"status": "published", "topic": topic}

@app.mcp_tool(
    name="publish_struggle_alert",
    description="Publish a struggle detection alert",
)
async def publish_struggle_alert(
    student_id: str,
    alert_type: str,
    severity: str,
    context: dict
) -> dict:
    prod = await get_producer()
    alert = {
        "alert_id": str(uuid4()),
        "student_id": student_id,
        "alert_type": alert_type,
        "severity": severity,
        "timestamp": datetime.utcnow().isoformat(),
        "context": context
    }
    await prod.send_and_wait("struggle.alert", value=alert)
    return {"status": "alerted", "alert_id": alert["alert_id"]}
```

---

### Step 4: MCP Kubernetes Server

**Using mcp-code-execution Skill**:
```bash
python .claude/skills/mcp-code-execution/scripts/generate.py \
    --name mcp-k8s-server \
    --port 3003
```

**Tools to Implement**:
- `get_pod_status` - Get status of all pods
- `get_service_logs` - Get logs from service
- `check_service_health` - Check health endpoints
- `describe_pod` - Get detailed pod info
- `get_kafka_topics` - List Kafka topics

**Implementation**:
```python
# tools/k8s_tools.py
from mcp import Server, mcp_tool
import subprocess
import json
import requests

app = Server("mcp-k8s-server")

@app.mcp_tool(
    name="get_pod_status",
    description="Get status of all pods in a namespace",
)
async def get_pod_status(
    namespace: str = "learnflow",
    label_selector: Optional[str] = None
) -> list:
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

@app.mcp_tool(
    name="check_service_health",
    description="Check health endpoints of all LearnFlow services",
)
async def check_service_health(namespace: str = "learnflow") -> dict:
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
```

---

### Step 5: MCP Code Execution Server

**Using mcp-code-execution Skill**:
```bash
python .claude/skills/mcp-code-execution/scripts/generate.py \
    --name mcp-code-execution-server \
    --port 3004
```

**Tools to Implement**:
- `execute_code` - Execute Python code in sandbox
- `test_with_test_cases` - Auto-grade code

**Implementation**:
```python
# tools/execution_tools.py
from mcp import Server, mcp_tool
import subprocess
import tempfile
import os
import asyncio

app = Server("mcp-code-execution-server")

@app.mcp_tool(
    name="execute_code",
    description="Execute Python code in a sandboxed environment",
)
async def execute_code(
    code: str,
    timeout: int = 5,
    memory_limit_mb: int = 50
) -> dict:
    result = {
        "output": None,
        "error": None,
        "execution_time": None,
        "passed": False
    }

    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            code_file = f.name

        start = time.time()

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

            result["execution_time"] = time.time() - start
            result["output"] = stdout.decode('utf-8')
            result["error"] = stderr.decode('utf-8') if stderr else None
            result["passed"] = process.returncode == 0

        except asyncio.TimeoutError:
            process.kill()
            result["error"] = f"Execution timeout (>{timeout}s)"

    except Exception as e:
        result["error"] = str(e)

    finally:
        if 'code_file' in locals():
            try:
                os.unlink(code_file)
            except:
                pass

    return result

@app.mcp_tool(
    name="test_with_test_cases",
    description="Run code against test cases for auto-grading",
)
async def test_with_test_cases(code: str, test_cases: list) -> dict:
    results = []

    for i, test_case in enumerate(test_cases):
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

---

### Step 6: Kubernetes Deployment

**Deploy All MCP Servers**:
```bash
# Using mcp-code-execution skill deploy script
./.claude/skills/mcp-code-execution/scripts/deploy.sh
```

**Deployment Pattern**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-database-server
  namespace: learnflow
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mcp-database-server
  template:
    metadata:
      labels:
        app: mcp-database-server
    spec:
      containers:
      - name: mcp-server
        image: mcp-database-server:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: connection-string
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
  name: mcp-database-server
  namespace: learnflow
spec:
  selector:
    app: mcp-database-server
  ports:
  - port: 3001
    targetPort: 3001
```

---

### Step 7: Integration Testing

**Test MCP Tool Access**:
```python
# tests/test_mcp_servers.py
import pytest
from mcp import Client

@pytest.mark.asyncio
async def test_database_server():
    client = Client('stdio', command=['python', 'mcp_database_server.py'])
    await client.start()

    result = await client.call_tool('get_student_progress', {
        'student_id': 'test-id'
    })

    assert isinstance(result, list)
    await client.stop()

@pytest.mark.asyncio
async def test_kafka_server():
    client = Client('stdio', command=['python', 'mcp_kafka_server.py'])
    await client.start()

    result = await client.call_tool('publish_learning_event', {
        'topic': 'learning.progress',
        'event_type': 'test',
        'student_id': 'test-id',
        'data': {}
    })

    assert result['status'] == 'published'
    await client.stop()

@pytest.mark.asyncio
async def test_code_execution():
    client = Client('stdio', command=['python', 'mcp_code_exec_server.py'])
    await client.start()

    result = await client.call_tool('execute_code', {
        'code': 'print("Hello, World!")'
    })

    assert result['output'] == 'Hello, World!\n'
    assert result['passed'] == True
    await client.stop()
```

---

## Success Criteria Validation

- [ ] All 4 MCP servers deployed
- [ ] All tools accessible via MCP protocol
- [ ] Database queries working
- [ ] Kafka pub/sub working
- [ ] K8s operations working
- [ ] Code execution sandbox working
- [ ] Token efficiency validated
- [ ] Zero manual intervention

---

## Dependencies

**Required**:
- PostgreSQL deployed (Phase 3)
- Kafka deployed (Phase 3)
- Backend services deployed (Phase 4)
- MCP Python SDK installed

**Blocking**:
- Phase 4 must be complete
