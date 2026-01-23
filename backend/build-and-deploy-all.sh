#!/bin/bash
# Autonomous Build and Deploy Script for LearnFlow Backend Services
# This script demonstrates Skills Autonomy - single command deploys everything
# Part of Hackathon 3 Skills Autonomy demonstration

set -e  # Exit on error

REGISTRY="${REGISTRY:-docker.io/learnflow}"
VERSION="${VERSION:-v1}"
NAMESPACE="${NAMESPACE:-learnflow}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

echo "=================================="
echo "LearnFlow Backend - Autonomous Build & Deploy"
echo "=================================="
echo ""
echo "Registry: $REGISTRY"
echo "Version: $VERSION"
echo "Namespace: $NAMESPACE"
echo ""

# Check Docker is available
if ! command -v docker &> /dev/null; then
    log_error "Docker not found. Please install Docker Desktop."
    exit 1
fi

# Check kubectl is available
if ! command -v kubectl &> /dev/null; then
    log_error "kubectl not found. Please install kubectl."
    exit 1
fi

# Services to build
SERVICES=(
    "triage-service"
    "concepts-service"
    "debug-service"
    "exercise-service"
    "progress-service"
    "code-review-service"
)

# ============================================
# Phase 1: Build Images
# ============================================
echo "=================================="
echo "Phase 1: Building Container Images"
echo "=================================="
echo ""

for SERVICE in "${SERVICES[@]}"; do
    echo "Building $SERVICE..."

    if [ ! -d "backend/$SERVICE" ]; then
        log_error "Directory not found: backend/$SERVICE"
        continue
    fi

    # Build image
    docker build -t ${REGISTRY}/${SERVICE}:${VERSION} backend/$SERVICE

    if [ $? -eq 0 ]; then
        log_info "$SERVICE built successfully"
    else
        log_error "$SERVICE build failed"
        exit 1
    fi
done

echo ""
log_info "All images built successfully"
echo ""

# ============================================
# Phase 2: Push Images (Optional)
# ============================================
echo "=================================="
echo "Phase 2: Pushing Images to Registry"
echo "=================================="
echo ""

# Check if user wants to push
read -p "Push images to registry? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Login to registry
    echo "Logging in to $REGISTRY..."
    docker login $REGISTRY

    for SERVICE in "${SERVICES[@]}"; do
        echo "Pushing $SERVICE..."
        docker push ${REGISTRY}/${SERVICE}:${VERSION}
        log_info "$SERVICE pushed successfully"
    done
else
    log_warn "Skipping push. Images will only be available locally."
    log_warn "For local Kubernetes (Minikube), load images with:"
    for SERVICE in "${SERVICES[@]}"; do
        echo "  minikube image load ${REGISTRY}/${SERVICE}:${VERSION}"
    done
fi

echo ""

# ============================================
# Phase 3: Deploy to Kubernetes
# ============================================
echo "=================================="
echo "Phase 3: Deploying to Kubernetes"
echo "=================================="
echo ""

# Create namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
log_info "Namespace '$NAMESPACE' ready"

# Deploy each service
for SERVICE in "${SERVICES[@]}"; do
    DEPLOYMENT_FILE="backend/$SERVICE/deployment.yaml"

    if [ ! -f "$DEPLOYMENT_FILE" ]; then
        log_error "Deployment file not found: $DEPLOYMENT_FILE"
        continue
    fi

    echo "Deploying $SERVICE..."

    # Update image in deployment (using envsubst or similar)
    # For now, we'll use kubectl set image
    kubectl apply -f $DEPLOYMENT_FILE -n $NAMESPACE

    # Update image to our built version
    kubectl set image deployment/$SERVICE $SERVICE=${REGISTRY}/${SERVICE}:${VERSION} -n $NAMESPACE

    log_info "$SERVICE deployed"
done

echo ""

# ============================================
# Phase 4: Verify Deployment
# ============================================
echo "=================================="
echo "Phase 4: Verifying Deployment"
echo "=================================="
echo ""

echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=triage-service -n $NAMESPACE --timeout=60s || log_warn "triage-service not ready after 60s"
kubectl wait --for=condition=ready pod -l app=concepts-service -n $NAMESPACE --timeout=60s || log_warn "concepts-service not ready after 60s"
kubectl wait --for=condition=ready pod -l app=debug-service -n $NAMESPACE --timeout=60s || log_warn "debug-service not ready after 60s"
kubectl wait --for=condition=ready pod -l app=exercise-service -n $NAMESPACE --timeout=60s || log_warn "exercise-service not ready after 60s"
kubectl wait --for=condition=ready pod -l app=progress-service -n $NAMESPACE --timeout=60s || log_warn "progress-service not ready after 60s"
kubectl wait --for=condition=ready pod -l app=code-review-service -n $NAMESPACE --timeout=60s || log_warn "code-review-service not ready after 60s"

echo ""
echo "Current pod status:"
kubectl get pods -n $NAMESPACE

echo ""
echo "=================================="
echo "Deployment Complete!"
echo "=================================="
echo ""
echo "Services deployed:"
kubectl get services -n $NAMESPACE

echo ""
echo "To access services:"
echo "  kubectl port-forward -n $NAMESPACE svc/triage-service 8000:8000"
echo "  kubectl port-forward -n $NAMESPACE svc/concepts-service 8001:8000"
echo "  ..."

echo ""
log_info "Skills Autonomy: Single command deployed entire backend"
