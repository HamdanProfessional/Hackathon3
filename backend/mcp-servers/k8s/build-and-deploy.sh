#!/bin/bash
# Build and deploy all MCP servers to Kubernetes

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

echo "======================================"
echo "Phase 6: MCP Servers - Build & Deploy"
echo "======================================"

# Function to build a server
build_server() {
    local server_name=$1
    echo ""
    echo "Building $server_name..."
    cd "$BACKEND_DIR/$server_name"

    # Build Docker image
    docker build -t $server_name:latest .

    echo "✓ Built $server_name:latest"
}

# Function to deploy a server
deploy_server() {
    local server_name=$1
    local yaml_file=$2
    echo ""
    echo "Deploying $server_name..."

    # Load image into Minikube (if using Minikube)
    if command -v minikube &> /dev/null; then
        minikube image load $server_name:latest 2>/dev/null || echo "  (Not using Minikube)"
    fi

    # Apply Kubernetes manifest
    kubectl apply -f "$SCRIPT_DIR/$yaml_file"

    echo "✓ Deployed $server_name"
}

# Build all servers
echo "Step 1: Building Docker images..."
build_server "mcp-database-server"
build_server "mcp-kafka-server"
build_server "mcp-k8s-server"
build_server "mcp-code-exec-server"

# Deploy all servers
echo ""
echo "Step 2: Deploying to Kubernetes..."
deploy_server "mcp-database-server" "mcp-database-server.yaml"
deploy_server "mcp-kafka-server" "mcp-kafka-server.yaml"
deploy_server "mcp-k8s-server" "mcp-k8s-server.yaml"
deploy_server "mcp-code-exec-server" "mcp-code-exec-server.yaml"

# Wait for pods to be ready
echo ""
echo "Step 3: Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l tier=mcp -n learnflow --timeout=60s || true

# Show pod status
echo ""
echo "Step 4: MCP Server Status:"
kubectl get pods -n learnflow -l tier=mcp

echo ""
echo "======================================"
echo "Phase 6 Complete!"
echo "======================================"
echo ""
echo "MCP Servers deployed:"
echo "  - mcp-database-server (5 tools)"
echo "  - mcp-kafka-server (4 tools)"
echo "  - mcp-k8s-server (5 tools)"
echo "  - mcp-code-exec-server (2 tools)"
echo ""
echo "Test MCP servers:"
echo "  kubectl logs -n learnflow deployment/mcp-database-server"
echo "  kubectl logs -n learnflow deployment/mcp-kafka-server"
echo "  kubectl logs -n learnflow deployment/mcp-k8s-server"
echo "  kubectl logs -n learnflow deployment/mcp-code-exec-server"
