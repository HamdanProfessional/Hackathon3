#!/bin/bash
# Build and Deploy Script for LearnFlow Frontend
# This script builds the Docker image and deploys to Kubernetes

set -e

# Configuration
IMAGE_NAME="ghcr.io/hamdanprofessional/learnflow-frontend"
IMAGE_TAG="v1"
NAMESPACE="learnflow"

echo "====================================="
echo "LearnFlow Frontend Build & Deploy"
echo "====================================="
echo ""

# Step 1: Build the Next.js application
echo "Step 1: Building Next.js application..."
cd "$(dirname "$0")"
npm run build

# Step 2: Build Docker image
echo ""
echo "Step 2: Building Docker image..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest

# Step 3: Push to registry (uncomment if using GHCR)
echo ""
echo "Step 3: Pushing Docker image to registry..."
# docker push ${IMAGE_NAME}:${IMAGE_TAG}
# docker push ${IMAGE_NAME}:latest

# Step 4: Apply Kubernetes manifests
echo ""
echo "Step 4: Applying Kubernetes manifests..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Step 5: Wait for deployment to be ready
echo ""
echo "Step 5: Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s \
  deployment/learnflow-frontend -n ${NAMESPACE}

# Step 6: Show status
echo ""
echo "Step 6: Deployment status..."
kubectl get pods -n ${NAMESPACE} -l app=learnflow-frontend
kubectl get svc -n ${NAMESPACE} -l app=learnflow-frontend
kubectl get ingress -n ${NAMESPACE} -l app=learnflow-frontend

echo ""
echo "====================================="
echo "Deployment complete!"
echo "====================================="
echo ""
echo "To access the application:"
if kubectl get ingress -n ${NAMESPACE} | grep -q learnflow; then
  HOST=$(kubectl get ingress learnflow-frontend-ingress -n ${NAMESPACE} -o jsonpath='{.spec.rules[0].host}')
  echo "  http://${HOST}"
else
  PORT=$(kubectl get svc learnflow-frontend -n ${NAMESPACE} -o jsonpath='{.spec.ports[0].port}')
  echo "  Port forward: kubectl port-forward -n ${NAMESPACE} svc/learnflow-frontend 3000:${PORT}"
  echo "  Then open: http://localhost:3000"
fi
echo ""
