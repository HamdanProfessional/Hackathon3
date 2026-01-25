# FastAPI + Dapr + Agent - Reference Guide

## LearnFlow Agent Types

| Agent | Purpose | Endpoints |
|-------|---------|-----------|
| **Triage** | Route queries to specialists | `POST /triage` |
| **Concepts** | Explain Python concepts | `POST /explain` |
| **Code Review** | Analyze code quality | `POST /review` |
| **Debug** | Parse and explain errors | `POST /debug` |
| **Exercise** | Generate challenges | `POST /exercise` |
| **Progress** | Track mastery scores | `GET /progress/{user_id}` |

## Dapr Configuration

### pubsub.yaml
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: kafka.kafka.svc.cluster.local:9092
  - name: consumerGroup
    value: learnflow-group
```

### state.yaml
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: postgres-state
spec:
  type: state.postgresql
  version: v1
  metadata:
  - name: connectionString
    secretKeyRef:
      name: postgres-connection
      key: connection-string
```

## Service Template Structure

```
service-name/
├── main.py           # FastAPI app with Dapr
├── agent.py          # AI agent implementation
├── models.py         # Pydantic models
├── dapr.py           # Dapr client wrapper
├── Dockerfile        # Container definition
├── requirements.txt  # Python dependencies
└── deployment.yaml   # K8s deployment with Dapr sidecar
```

## Deployment YAML Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: triage-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: triage
  template:
    metadata:
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "triage-service"
        dapr.io/app-port: "8000"
    spec:
      containers:
      - name: triage
        image: triage-service:latest
        ports:
        - containerPort: 8000
```

## Event Publishing

```python
from dapr.clients import DaprClient

async def publish_event(topic: str, data: dict):
    with DaprClient() as dapr:
        dapr.publish_event(
            pubsub_name="kafka-pubsub",
            topic_name=topic,
            data=json.dumps(data)
        )
```
