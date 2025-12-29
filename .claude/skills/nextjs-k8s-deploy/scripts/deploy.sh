#!/bin/bash
set -e

APP_NAME=${1:?Usage: deploy.sh <app-name>}
NAMESPACE=${NAMESPACE:-learnflow}
REGISTRY=${REGISTRY:-localhost:5001}

echo "Deploying Next.js app '$APP_NAME'..."

# Build Docker image
docker build -t $APP_NAME:latest .

# Tag and push
docker tag $APP_NAME:latest $REGISTRY/$APP_NAME:latest
docker push $REGISTRY/$APP_NAME:latest

# Create namespace
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Deploy
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $APP_NAME
  namespace: $NAMESPACE
spec:
  replicas: 2
  selector:
    matchLabels:
      app: $APP_NAME
  template:
    metadata:
      labels:
        app: $APP_NAME
    spec:
      containers:
      - name: $APP_NAME
        image: $REGISTRY/$APP_NAME:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: $APP_NAME
  namespace: $NAMESPACE
spec:
  selector:
    app: $APP_NAME
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
EOF

echo "✓ $APP_NAME deployed"
echo "  Waiting for rollout..."
kubectl rollout status deployment/$APP_NAME -n $NAMESPACE --timeout=2m
