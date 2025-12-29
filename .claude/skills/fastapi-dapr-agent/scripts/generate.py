#!/usr/bin/env python3
"""Generate FastAPI + Dapr + Agent microservice scaffold."""
import argparse
import os
import sys

AGENT_TYPES = {
    "triage": {"description": "Route queries to specialist agents", "topics": ["learning.query"]},
    "concepts": {"description": "Explain Python concepts", "topics": ["learning.concept_request"]},
    "code-review": {"description": "Analyze code quality", "topics": ["code.review_request"]},
    "debug": {"description": "Parse and explain errors", "topics": ["code.error"]},
    "exercise": {"description": "Generate coding challenges", "topics": ["exercise.generate"]},
    "progress": {"description": "Track mastery scores", "topics": ["learning.progress_update"]},
}

def generate_service(name: str, agent_type: str, namespace: str = "learnflow"):
    """Generate microservice scaffold."""
    if agent_type not in AGENT_TYPES:
        print(f"Error: Unknown agent type '{agent_type}'")
        print(f"Available: {', '.join(AGENT_TYPES.keys())}")
        sys.exit(1)

    # Create directory structure
    os.makedirs(name, exist_ok=True)
    os.makedirs(f"{name}/tests", exist_ok=True)

    # Generate files
    files = {
        "main.py": generate_main_py(name, agent_type),
        "agent.py": generate_agent_py(name, agent_type),
        "models.py": generate_models_py(),
        "requirements.txt": generate_requirements(),
        "Dockerfile": generate_dockerfile(name),
        "deployment.yaml": generate_deployment_yaml(name, namespace),
    }

    for filename, content in files.items():
        with open(f"{name}/{filename}", "w") as f:
            f.write(content)

    print(f"✓ Generated service '{name}' (agent: {agent_type})")
    print(f"  Directory: {name}/")
    print(f"  Deploy: ./scripts/deploy.sh --name {name}")

def generate_main_py(name: str, agent_type: str) -> str:
    return f'''"""
{name} - FastAPI service with Dapr integration
Agent Type: {agent_type}
"""
from fastapi import FastAPI
from dapr.ext.fastapi import DaprApp
from .agent import {agent_type.title().replace('-', '')}Agent
from .models import QueryRequest, QueryResponse

app = FastAPI(title="{name}", version="1.0.0")
dapr_app = DaprApp(app)
agent = {agent_type.title().replace('-', '')}Agent()

@app.post("/", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    """Handle incoming query."""
    result = await agent.process(request.query, request.context)
    return QueryResponse(result=result)

@dapr_app.subscribe(pubsub="kafka-pubsub", topic="{AGENT_TYPES[agent_type]['topics'][0]}")
async def handle_event(event_data: dict):
    """Handle Kafka events."""
    await agent.process_event(event_data)

@app.get("/health")
async def health():
    return {{"status": "healthy"}}
'''

def generate_agent_py(name: str, agent_type: str) -> str:
    return f'''"""
{agent_type.title()} Agent Implementation
"""
from openai import AsyncOpenAI
from typing import Optional

class {agent_type.title().replace('-', '')}Agent:
    def __init__(self):
        self.client = AsyncOpenAI()

    async def process(self, query: str, context: dict) -> str:
        """Process user query with AI."""
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{{"role": "user", "content": query}}]
        )
        return response.choices[0].message.content

    async def process_event(self, event_data: dict):
        """Process Kafka event."""
        # Implement event handling logic
        pass
'''

def generate_models_py() -> str:
    return '''"""Pydantic models for request/response validation."""
from pydantic import BaseModel
from typing import Optional, Dict

class QueryRequest(BaseModel):
    query: str
    context: Optional[Dict] = {}

class QueryResponse(BaseModel):
    result: str
    metadata: Optional[Dict] = {}
'''

def generate_requirements() -> str:
    return '''fastapi==0.109.0
uvicorn==0.27.0
dapr==1.13.0
openai==1.10.0
pydantic==2.5.3
sqlmodel==0.0.14
psycopg2-binary==2.9.9
'''

def generate_dockerfile(name: str) -> str:
    return f'''FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
'''

def generate_deployment_yaml(name: str, namespace: str) -> str:
    return f'''apiVersion: apps/v1
kind: Deployment
metadata:
  name: {name}
  namespace: {namespace}
spec:
  replicas: 2
  selector:
    matchLabels:
      app: {name}
  template:
    metadata:
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "{name}"
        dapr.io/app-port: "8000"
        dapr.io/enable-api-logging: "true"
    spec:
      containers:
      - name: {name}
        image: {name}:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: learnflow-secrets
              key: openai-api-key
---
apiVersion: v1
kind: Service
metadata:
  name: {name}
  namespace: {namespace}
spec:
  selector:
    app: {name}
  ports:
  - port: 8000
    targetPort: 8000
'''

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate FastAPI + Dapr + Agent service")
    parser.add_argument("--name", required=True, help="Service name (e.g., triage-service)")
    parser.add_argument("--agent", required=True, choices=list(AGENT_TYPES.keys()), help="Agent type")
    parser.add_argument("--namespace", default="learnflow", help="Kubernetes namespace")
    args = parser.parse_args()

    generate_service(args.name, args.agent, args.namespace)
