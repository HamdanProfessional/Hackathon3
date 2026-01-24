#!/bin/bash
# Build and deploy script for LearnFlow backend services

set -e

# Configuration
REGISTRY="${REGISTRY:-localhost:5000}"  # Use local registry by default
VERSION="${VERSION:-v1}"
SERVICES=("triage-service" "concepts-service" "debug-service" "exercise-service" "progress-service" "code-review-service")
PORTS=(8001 8002 8003 8004 8005 8006)

echo "========================================="
echo "LearnFlow Backend Build & Deploy Script"
echo "========================================="
echo "Registry: $REGISTRY"
echo "Version: $VERSION"
echo ""

# Function to build a service
build_service() {
    local service=$1
    local port=$2

    echo "Building $service (port $port)..."

    # Create Dockerfile for this service
    cat > backend/$service/Dockerfile << EOF
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy service code
COPY main.py .
COPY schemas/ ./schemas/ 2>/dev/null || true
COPY agents/ ./agents/ 2>/dev/null || true

# Copy common module
COPY common/ /app/common/

# Create logs directory
RUN mkdir -p /app/logs

EXPOSE $port

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "$port"]
EOF

    # Build image
    docker build -t ${REGISTRY}/learnflow-${service}:${VERSION} -f backend/$service/Dockerfile backend/

    echo "Built $service"
}

# Build all services
for i in "${!SERVICES[@]}"; do
    build_service "${SERVICES[$i]}" "${PORTS[$i]}"
done

echo ""
echo "========================================="
echo "All images built successfully!"
echo "========================================="
echo ""

# Push images (if registry is set)
if [ "$REGISTRY" != "localhost:5000" ]; then
    echo "Pushing images to registry..."
    for service in "${SERVICES[@]}"; do
        docker push ${REGISTRY}/learnflow-${service}:${VERSION}
        echo "Pushed $service"
    done
fi

echo ""
echo "Images:"
for service in "${SERVICES[@]}"; do
    echo "  - ${REGISTRY}/learnflow-${service}:${VERSION}"
done

echo ""
echo "To update deployments, run:"
echo "  kubectl set image deployment/<service> <service>=${REGISTRY}/learnflow-<service>:${VERSION} -n learnflow"
