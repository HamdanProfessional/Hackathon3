#!/bin/bash
set -e

SERVER_DIR=${1:?Usage: deploy.sh <server-dir>}
REGISTRY=${REGISTRY:-localhost:5001}

echo "Deploying MCP server from $SERVER_DIR..."

cd $SERVER_DIR

# Build image
docker build -t $SERVER_DIR-mcp:latest .

# Push to registry
docker tag $SERVER_DIR-mcp:latest $REGISTRY/$SERVER_DIR-mcp:latest
docker push $REGISTRY/$SERVER_DIR-mcp:latest

# Deploy to Kubernetes
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $SERVER_DIR-mcp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: $SERVER_DIR-mcp
  template:
    metadata:
      labels:
        app: $SERVER_DIR-mcp
    spec:
      containers:
      - name: mcp-server
        image: $REGISTRY/$SERVER_DIR-mcp:latest
        command: ["python", "main.py"]
EOF

echo "✓ MCP server deployed"
