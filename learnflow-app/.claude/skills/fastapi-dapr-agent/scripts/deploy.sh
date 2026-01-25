#!/bin/bash
set -e

SERVICE_NAME=${1:?Usage: deploy.sh <service-name>}
NAMESPACE=${NAMESPACE:-learnflow}
REGISTRY=${REGISTRY:-localhost:5001}

echo "Deploying $SERVICE_NAME to namespace '$NAMESPACE'..."

# Build Docker image
docker build -t $SERVICE_NAME:latest .

# Tag for registry
docker tag $SERVICE_NAME:latest $REGISTRY/$SERVICE_NAME:latest

# Push to registry
docker push $REGISTRY/$SERVICE_NAME:latest

# Apply deployment
kubectl apply -f deployment.yaml

# Wait for rollout
kubectl rollout status deployment/$SERVICE_NAME -n $NAMESPACE

echo "✓ $SERVICE_NAME deployed"
echo "  Service: $SERVICE_NAME.$NAMESPACE.svc.cluster.local:8000"
